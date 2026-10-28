import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';
import config from './env.js';
import logger from '../utils/logger.js';
import sqliteAdapter from './sqliteAdapter.js';

let pool = null;
let activeClient = null; // 'mysql' | 'sqlite'
let lastMysqlError = null;
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

async function ensureMysqlSchema(conn) {
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
  } catch (err) {
    logger.warn('Schema check warning:', err.message);
  }
}

async function resolveClient() {
  if (activeClient) return activeClient;

  if (config.db.client === 'sqlite') {
    activeClient = 'sqlite';
    return activeClient;
  }

  // 1. Try MySQL on primary host
  try {
    const p = getPool(config.db.host);
    const conn = await p.getConnection();
    await ensureMysqlSchema(conn);
    conn.release();
    activeClient = 'mysql';
    lastMysqlError = null;
    logger.info(`Connected to MySQL database on ${effectiveHost}`);
    return activeClient;
  } catch (err) {
    lastMysqlError = err;
    logger.warn(`MySQL connection to ${config.db.host} failed (${err.code || err.message}).`);

    // 2. If host was 'localhost', try 127.0.0.1 (or vice versa for Linux IPv4/IPv6 socket resolution)
    const alternateHost = config.db.host === 'localhost' ? '127.0.0.1' : (config.db.host === '127.0.0.1' ? 'localhost' : null);
    if (alternateHost) {
      try {
        const altPool = getPool(alternateHost);
        const conn = await altPool.getConnection();
        await ensureMysqlSchema(conn);
        conn.release();
        activeClient = 'mysql';
        lastMysqlError = null;
        logger.info(`Connected to MySQL database on alternate host ${effectiveHost}`);
        return activeClient;
      } catch (altErr) {
        lastMysqlError = altErr;
        logger.warn(`Alternate MySQL connection to ${alternateHost} also failed (${altErr.code || altErr.message}).`);
      }
    }
  }

  // 3. Fallback to SQLite so the website NEVER throws 500 Internal Server Error
  activeClient = 'sqlite';
  logger.warn(
    `MySQL not available (${lastMysqlError?.code || lastMysqlError?.message}). Gracefully using built-in SQLite so the site remains online.`
  );
  return activeClient;
}

/**
 * Database facade. Automatically routes to MySQL on Hostinger/production
 * or built-in SQLite when local/remote MySQL is temporarily unreachable.
 */
const db = {
  /** Run a parameterised query and return the rows (or the result header for writes). */
  async query(sql, params = []) {
    const client = await resolveClient();
    if (client === 'sqlite') {
      return sqliteAdapter.query(sql, params);
    }
    const [result] = await getPool().execute(sql, params);
    return result;
  },

  /** Run `fn(connection)` inside a transaction; always commits/rolls back and releases. */
  async withTransaction(fn) {
    const client = await resolveClient();
    if (client === 'sqlite') {
      return sqliteAdapter.withTransaction(fn);
    }

    const conn = await getPool().getConnection();
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
    const client = await resolveClient();
    if (client === 'sqlite') {
      await sqliteAdapter.ping();
      return { client: 'sqlite', mysqlError: lastMysqlError?.message || lastMysqlError?.code };
    }
    const conn = await getPool().getConnection();
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
    await sqliteAdapter.close();
    activeClient = null;
  },
};

export default db;
