import mysql from 'mysql2/promise';
import config from './env.js';
import logger from '../utils/logger.js';
import sqliteAdapter from './sqliteAdapter.js';

let pool = null;
let activeClient = null; // 'mysql' | 'sqlite'

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      database: config.db.database,
      user: config.db.user,
      password: config.db.password,
      charset: 'utf8mb4',
      waitForConnections: true,
      connectionLimit: config.db.connectionLimit,
      queueLimit: 0,
      enableKeepAlive: true,
      dateStrings: true,
    });
    pool.on?.('error', (err) => logger.error('MySQL pool error', err.message));
  }
  return pool;
}

async function resolveClient() {
  if (activeClient) return activeClient;

  if (config.db.client === 'sqlite') {
    activeClient = 'sqlite';
    return activeClient;
  }

  if (config.db.client === 'mysql') {
    activeClient = 'mysql';
    return activeClient;
  }

  // Auto mode: probe MySQL first. If reachable, use MySQL; else fall back to local SQLite.
  try {
    const p = getPool();
    const conn = await p.getConnection();
    conn.release();
    activeClient = 'mysql';
    logger.info('Connected to MySQL database.');
  } catch (err) {
    activeClient = 'sqlite';
    logger.info(
      'Local MySQL not detected (' + (err.code || err.message) + '). Seamlessly using built-in SQLite (backend/data/lucidmind.sqlite).'
    );
  }

  return activeClient;
}

/**
 * Database facade. Automatically routes to MySQL on Hostinger/production
 * or built-in SQLite locally when local MySQL is not running.
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
        logger.error('Rollback failed', rollbackErr.message);
      }
      throw err;
    } finally {
      conn.release();
    }
  },

  async ping() {
    const client = await resolveClient();
    if (client === 'sqlite') {
      return sqliteAdapter.ping();
    }
    const conn = await getPool().getConnection();
    try {
      await conn.ping();
      return true;
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
