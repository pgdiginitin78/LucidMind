#!/usr/bin/env node
/**
 * Creates the database (if missing) and applies database/schema.sql (all CREATE TABLE IF NOT EXISTS,
 * so it never drops or alters existing tables). Intended for LOCAL setup and first-time Hostinger setup.
 * Refuses to run when NODE_ENV=production unless ALLOW_PRODUCTION_SETUP=true.
 */
import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';
import config from '../src/config/env.js';

if (config.isProduction && process.env.ALLOW_PRODUCTION_SETUP !== 'true') {
  console.error('Refusing to run in production. Set ALLOW_PRODUCTION_SETUP=true to apply the (non-destructive) schema.');
  process.exit(1);
}

const { host, port, user, password, database } = config.db;
const schemaPath = path.join(config.backendRoot, 'database', 'schema.sql');
const statements = fs.readFileSync(schemaPath, 'utf8').split(/;\s*(?:\r?\n|$)/).map((s) => s.trim()).filter(Boolean);

let conn;
try {
  conn = await mysql.createConnection({ host, port, user, password, multipleStatements: false });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${database.replace(/`/g, '')}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await conn.query(`USE \`${database.replace(/`/g, '')}\``);
  for (const sql of statements) await conn.query(sql);
  console.log(`Database "${database}" ready on ${host}:${port} (${statements.length} statements applied).`);
} catch (err) {
  console.error('Setup failed:', err.code || err.message);
  process.exitCode = 1;
} finally {
  await conn?.end();
}
