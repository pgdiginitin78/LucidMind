import mysql from 'mysql2/promise';
import config from './env.js';
import logger from '../utils/logger.js';

let pool = null;

export function getPool() {
  if (!pool) {
    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    const maxConnections = isServerless ? Math.min(config.db.connectionLimit, 5) : config.db.connectionLimit;

    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      database: config.db.database,
      user: config.db.user,
      password: config.db.password,
      charset: 'utf8mb4',
      waitForConnections: true,
      connectionLimit: maxConnections,
      queueLimit: 0,
      connectTimeout: 10000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      dateStrings: true,
    });
    pool.on?.('error', (err) => logger.error('MySQL pool error:', err.message));
  }
  return pool;
}

/**
 * Database facade. 100% persistent MySQL.
 * No SQLite, no local file storage, no temporary data loss.
 */
const db = {
  /** Run a parameterised query and return the rows (or the result header for writes). */
  async query(sql, params = []) {
    const [result] = await getPool().execute(sql, params);
    return result;
  },

  /** Run `fn(connection)` inside a transaction; always commits/rolls back and releases. */
  async withTransaction(fn) {
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
    const conn = await getPool().getConnection();
    try {
      await conn.query('SELECT 1');
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
  },
};

export default db;
