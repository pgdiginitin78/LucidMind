import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import bcrypt from 'bcryptjs';
import config from './env.js';
import logger from '../utils/logger.js';
import { seedFullData } from './seedFullData.js';

let dbSync = null;

function getDbPath() {
  const dataDir = path.resolve(config.backendRoot, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'lucidmind.sqlite');
}

function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS blogs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      tag TEXT DEFAULT 'MINDSET',
      category TEXT DEFAULT 'Thought Leadership',
      author TEXT DEFAULT 'Ravishankar Pingali',
      author_role TEXT,
      read_time TEXT DEFAULT '3 MIN READ',
      date TEXT,
      excerpt TEXT,
      description TEXT,
      content TEXT,
      image TEXT,
      cover_image TEXT,
      tags TEXT,
      is_published INTEGER DEFAULT 1,
      published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS podcasts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      episode TEXT DEFAULT 'Ep. 01',
      src TEXT,
      audio_url TEXT,
      thumbnail TEXT,
      cover_image TEXT,
      duration TEXT DEFAULT '15 mins',
      host TEXT DEFAULT 'Ravishankar Pingali',
      guest TEXT DEFAULT '',
      description TEXT,
      tags TEXT,
      media_type TEXT DEFAULT 'podcast',
      is_published INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      subtitle TEXT,
      category TEXT DEFAULT 'Phase 1: Getting Started',
      real_problem TEXT,
      description TEXT,
      features TEXT,
      success_looks_like TEXT,
      icon TEXT DEFAULT 'Rocket',
      image TEXT,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed all authentic blogs, podcasts, services, and admin user
  seedFullData(db);
}

export function getSqliteDb() {
  if (!dbSync) {
    const dbPath = getDbPath();
    dbSync = new DatabaseSync(dbPath);
    initSchema(dbSync);
    logger.info(`Local SQLite database initialized at ${dbPath}`);
  }
  return dbSync;
}

export const sqliteAdapter = {
  async query(sql, params = []) {
    const db = getDbPath ? getSqliteDb() : null;
    const trimmed = sql.trim();

    // Emulate MySQL SHOW COLUMNS
    const showMatch = trimmed.match(/^SHOW\s+COLUMNS\s+FROM\s+(\w+)(?:\s+LIKE\s+'([^']+)')?/i);
    if (showMatch) {
      const table = showMatch[1];
      const likeCol = showMatch[2];
      const cols = db.prepare(`PRAGMA table_info(${table})`).all();
      let matched = cols.map((c) => ({
        Field: c.name,
        Type: (c.type || 'text').toLowerCase(),
        Null: c.notnull ? 'NO' : 'YES',
        Key: c.pk ? 'PRI' : '',
        Default: c.dflt_value,
        Extra: '',
      }));
      if (likeCol) {
        matched = matched.filter((c) => c.Field.toLowerCase() === likeCol.toLowerCase());
      }
      return matched;
    }

    // Emulate MySQL ALTER TABLE MODIFY COLUMN (no-op in SQLite since TEXT is dynamic)
    if (/^ALTER\s+TABLE\s+\w+\s+MODIFY\s+COLUMN/i.test(trimmed)) {
      return { affectedRows: 0 };
    }

    // Queries that return rows (SELECT, PRAGMA)
    if (/^(SELECT|PRAGMA)/i.test(trimmed)) {
      const stmt = db.prepare(trimmed);
      const rows = stmt.all(...params);
      return rows.map((r) => ({ ...r }));
    }

    // Queries that mutate data (INSERT, UPDATE, DELETE, CREATE, ALTER)
    const stmt = db.prepare(trimmed);
    const result = stmt.run(...params);
    return {
      affectedRows: result.changes,
      insertId: result.lastInsertRowid,
      changedRows: result.changes,
    };
  },

  async withTransaction(fn) {
    const db = getSqliteDb();
    db.exec('BEGIN TRANSACTION');
    try {
      const conn = {
        execute: async (sql, params = []) => {
          const res = await sqliteAdapter.query(sql, params);
          return [res];
        },
      };
      const result = await fn(conn);
      db.exec('COMMIT');
      return result;
    } catch (err) {
      try {
        db.exec('ROLLBACK');
      } catch {
        // ignore rollback error
      }
      throw err;
    }
  },

  async ping() {
    getSqliteDb();
    return true;
  },

  async close() {
    if (dbSync) {
      try {
        dbSync.close();
      } catch {}
      dbSync = null;
    }
  },
};

export default sqliteAdapter;
