import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';
import config from './env.js';
import logger from '../utils/logger.js';

let pool = null;
let effectiveHost = config.db.host;

export function getPool(overrideHost = null) {
  const host = overrideHost || effectiveHost;
  if (!pool || (overrideHost && overrideHost !== effectiveHost)) {
    if (pool) {
      try {
        pool.end().catch(() => {});
      } catch {}
    }
    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    const maxConnections = isServerless ? Math.min(config.db.connectionLimit, 5) : config.db.connectionLimit;

    effectiveHost = host;
    pool = mysql.createPool({
      host,
      port: config.db.port,
      database: config.db.database,
      user: config.db.user,
      password: config.db.password,
      charset: 'utf8mb4',
      waitForConnections: true,
      connectionLimit: maxConnections,
      queueLimit: 0,
      connectTimeout: 8000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      dateStrings: true,
    });
    pool.on?.('error', (err) => logger.error('MySQL pool error:', err.message));
  }
  return pool;
}

let schemaEnsured = false;
async function ensureMysqlSchema(conn) {
  if (schemaEnsured) return;
  try {
    const schemaPath = path.join(config.backendRoot, 'database', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      const statements = sql
        .split(/;\s*(?:\r?\n|$)/)
        .map((s) => s.trim())
        .filter(Boolean);
      for (const stmt of statements) {
        await conn.query(stmt).catch(() => {});
      }
    }

    // If blogs table is empty, auto-seed master content from recovered_db.json into MySQL
    const [rows] = await conn.query('SELECT COUNT(*) as cnt FROM blogs');
    const blogCount = rows?.[0]?.cnt || 0;
    if (blogCount === 0) {
      const recoveredPath = path.join(config.backendRoot, 'data', 'recovered_db.json');
      if (fs.existsSync(recoveredPath)) {
        const data = JSON.parse(fs.readFileSync(recoveredPath, 'utf8'));
        if (Array.isArray(data.blogs)) {
          for (const b of data.blogs) {
            await conn.query(
              `INSERT IGNORE INTO blogs (id, title, slug, tag, category, author, author_role, read_time, date, excerpt, description, content, image, cover_image, tags, is_published, published_at, sort_order)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                b.id || b._id,
                b.title || '',
                b.slug || b.id,
                b.tag || 'MINDSET',
                b.category || b.tag || 'Thought Leadership',
                b.author || 'Ravishankar Pingali',
                b.authorRole || b.author_role || '',
                b.readTime || b.read_time || '3 MIN READ',
                b.date || '',
                b.excerpt || b.description || '',
                b.description || b.excerpt || '',
                b.content || '',
                b.image || b.coverImage || '',
                b.coverImage || b.image || '',
                JSON.stringify(Array.isArray(b.tags) ? b.tags : []),
                b.isPublished !== false && b.is_published !== 0 ? 1 : 0,
                b.publishedAt || b.published_at || new Date().toISOString(),
                b.sortOrder || b.sort_order || 0,
              ],
            ).catch(() => {});
          }
          logger.info(`Seeded ${data.blogs.length} blogs into MySQL.`);
        }
        if (Array.isArray(data.podcasts)) {
          for (const p of data.podcasts) {
            await conn.query(
              `INSERT IGNORE INTO podcasts (id, title, slug, episode, src, audio_url, thumbnail, cover_image, duration, host, guest, description, tags, media_type, is_published, sort_order)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                p.id || p._id,
                p.title || '',
                p.slug || p.id,
                p.episode || 'Ep. 01',
                p.src || '',
                p.audioUrl || p.audio_url || '',
                p.thumbnail || p.coverImage || '',
                p.coverImage || p.thumbnail || '',
                p.duration || '15 mins',
                p.host || 'Ravishankar Pingali',
                p.guest || '',
                p.description || '',
                JSON.stringify(Array.isArray(p.tags) ? p.tags : []),
                p.mediaType || p.media_type || 'podcast',
                p.isPublished !== false && p.is_published !== 0 ? 1 : 0,
                p.sortOrder || p.sort_order || 0,
              ],
            ).catch(() => {});
          }
          logger.info(`Seeded ${data.podcasts.length} podcasts into MySQL.`);
        }
      }
    }

    schemaEnsured = true;
  } catch (err) {
    logger.warn('Schema check warning:', err.message);
  }
}

async function getConnectionWithRetry() {
  try {
    const p = getPool(config.db.host);
    const conn = await p.getConnection();
    await ensureMysqlSchema(conn);
    return conn;
  } catch (err) {
    // If primary host was 'localhost' and gave ECONNREFUSED on Linux, try 127.0.0.1
    const alternateHost = config.db.host === 'localhost' ? '127.0.0.1' : (config.db.host === '127.0.0.1' ? 'localhost' : null);
    if (alternateHost) {
      try {
        const altPool = getPool(alternateHost);
        const conn = await altPool.getConnection();
        await ensureMysqlSchema(conn);
        return conn;
      } catch {}
    }
    throw err;
  }
}

/**
 * Pure MySQL Database Facade.
 * 100% persistent MySQL. Zero SQLite.
 */
const db = {
  /** Run a parameterised query against MySQL */
  async query(sql, params = []) {
    const [result] = await getPool().execute(sql, params);
    return result;
  },

  /** Run inside a MySQL transaction */
  async withTransaction(fn) {
    const conn = await getConnectionWithRetry();
    try {
      await conn.beginTransaction();
      const result = await fn(conn);
      await conn.commit();
      return result;
    } catch (err) {
      try {
        await conn.rollback();
      } catch (rollbackErr) {
        logger.error('Rollback failed:', rollbackErr.message);
      }
      throw err;
    } finally {
      conn.release();
    }
  },

  async ping() {
    const conn = await getConnectionWithRetry();
    try {
      await conn.query('SELECT 1');
      return { client: 'mysql' };
    } finally {
      conn.release();
    }
  },

  async close() {
    if (pool) {
      const p = pool;
      pool = null;
      await p.end();
    }
  },
};

export default db;
