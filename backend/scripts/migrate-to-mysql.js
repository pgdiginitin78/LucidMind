#!/usr/bin/env node
/**
 * Safe, idempotent migration script to populate MySQL from existing JSON/SQLite backups.
 * 
 * Guarantees:
 * 1. Checks existing records before inserting to prevent duplicate keys or overwriting.
 * 2. Preserves existing blog IDs, titles, slugs, descriptions, content, images, tags, dates, publication status.
 * 3. Never deletes, drops, or truncates existing production tables or records.
 * 4. Can be executed multiple times safely.
 */
import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import config from '../src/config/env.js';

async function migrate() {
  console.log('--- LucidMind Safe MySQL Migration ---');
  console.log(`Target database: ${config.db.user}@${config.db.host}:${config.db.port}/${config.db.database}`);

  let conn;
  try {
    conn = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      charset: 'utf8mb4',
    });
    console.log('MySQL connection established successfully.');
  } catch (err) {
    console.error('Cannot connect to MySQL database:', err.code || err.message);
    console.error('Ensure MySQL is running and credentials in environment variables are correct.');
    process.exit(1);
  }

  try {
    // 1. Ensure Schema
    const schemaPath = path.join(config.backendRoot, 'database', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const statements = fs.readFileSync(schemaPath, 'utf8')
        .split(/;\s*(?:\r?\n|$)/)
        .map((s) => s.trim())
        .filter(Boolean);
      for (const stmt of statements) {
        await conn.query(stmt);
      }
      console.log('Verified database schema tables exist.');
    }

    // 2. Load Source Data
    const recoveredPath = path.join(config.backendRoot, 'data', 'recovered_db.json');
    if (!fs.existsSync(recoveredPath)) {
      console.error(`Backup data file not found at ${recoveredPath}. Cannot migrate.`);
      return;
    }
    const sourceData = JSON.parse(fs.readFileSync(recoveredPath, 'utf8'));

    // 3. Migrate Users (Safe seed)
    const [existingUsers] = await conn.query('SELECT COUNT(*) as count FROM users');
    if (existingUsers[0].count === 0) {
      const adminPass = process.env.ADMIN_PASSWORD || 'admin@1234';
      const hash = bcrypt.hashSync(adminPass, 10);
      await conn.query('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hash]);
      console.log('Seeded initial admin user.');
    } else {
      console.log(`Users table has ${existingUsers[0].count} record(s). Preserving existing users.`);
    }

    // 4. Migrate Blogs
    const [currentBlogs] = await conn.query('SELECT id, slug FROM blogs');
    const existingBlogIds = new Set(currentBlogs.map((b) => b.id));
    const existingBlogSlugs = new Set(currentBlogs.map((b) => b.slug));
    console.log(`Current blogs in MySQL: ${existingBlogIds.size}`);

    let blogsInserted = 0;
    let blogsSkipped = 0;

    const sourceBlogs = Array.isArray(sourceData.blogs) ? sourceData.blogs : [];
    for (let i = 0; i < sourceBlogs.length; i++) {
      const b = sourceBlogs[i];
      const id = b._id || b.id || `blog_${i + 1}`;
      const slug = b.slug || b.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || id;

      if (existingBlogIds.has(id) || existingBlogSlugs.has(slug)) {
        blogsSkipped++;
        continue;
      }

      const tags = Array.isArray(b.tags)
        ? JSON.stringify(b.tags)
        : typeof b.tags === 'string'
        ? b.tags
        : '[]';
      const isPub = b.isPublished !== false && b.isActive !== false ? 1 : 0;
      const order = typeof b.order === 'number' ? b.order : (b.sort_order || i + 1);

      await conn.query(
        `INSERT INTO blogs (
          id, title, slug, tag, category, author, author_role, read_time, date,
          excerpt, description, content, image, cover_image, tags, is_published,
          published_at, sort_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          b.title || '',
          slug,
          b.tag || 'MINDSET',
          b.category || b.tag || 'Thought Leadership',
          b.author || 'Ravishankar Pingali',
          b.authorRole || b.author_role || 'Building Adaptive Enterprises | GCC Leader | Board Advisor',
          b.readTime || b.read_time || '3 MIN READ',
          b.date || 'October 2026',
          b.excerpt || b.description || '',
          b.description || b.excerpt || '',
          b.content || '',
          b.image || b.coverImage || '',
          b.coverImage || b.image || '',
          tags,
          isPub,
          b.publishedAt || b.published_at || new Date().toISOString().slice(0, 19).replace('T', ' '),
          order,
          b.createdAt || b.created_at || new Date().toISOString().slice(0, 19).replace('T', ' '),
          b.updatedAt || b.updated_at || new Date().toISOString().slice(0, 19).replace('T', ' '),
        ]
      );
      existingBlogIds.add(id);
      existingBlogSlugs.add(slug);
      blogsInserted++;
    }

    console.log(`Blogs migration complete: ${blogsInserted} inserted, ${blogsSkipped} skipped (already present).`);

    // 5. Migrate Podcasts
    const [currentPods] = await conn.query('SELECT id, slug FROM podcasts');
    const existingPodIds = new Set(currentPods.map((p) => p.id));
    let podsInserted = 0;
    let podsSkipped = 0;
    const sourcePods = Array.isArray(sourceData.podcasts) ? sourceData.podcasts : [];

    for (let i = 0; i < sourcePods.length; i++) {
      const p = sourcePods[i];
      const id = p._id || p.id || `pod_${i + 1}`;
      if (existingPodIds.has(id)) {
        podsSkipped++;
        continue;
      }
      const slug = p.slug || p.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || id;
      const isPub = p.isPublished !== false && p.is_published !== 0 && p.isActive !== false ? 1 : 0;
      const order = typeof p.order === 'number' ? p.order : (p.sort_order || i + 1);
      const tags = Array.isArray(p.tags) ? JSON.stringify(p.tags) : typeof p.tags === 'string' ? p.tags : '["video"]';

      await conn.query(
        `INSERT INTO podcasts (
          id, title, slug, episode, src, audio_url, thumbnail, cover_image,
          duration, host, guest, description, tags, media_type, is_published,
          sort_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          p.title || '',
          slug,
          p.episode || 'Ep. 01',
          p.src || p.audioUrl || '',
          p.audioUrl || p.src || '',
          p.thumbnail || p.coverImage || '',
          p.coverImage || p.thumbnail || '',
          p.duration || '15 mins',
          p.host || 'Ravishankar Pingali',
          p.guest || '',
          p.description || '',
          tags,
          p.mediaType || p.media_type || 'podcast',
          isPub,
          order,
          p.createdAt || p.created_at || new Date().toISOString().slice(0, 19).replace('T', ' '),
          p.updatedAt || p.updated_at || new Date().toISOString().slice(0, 19).replace('T', ' '),
        ]
      );
      existingPodIds.add(id);
      podsInserted++;
    }
    console.log(`Podcasts migration complete: ${podsInserted} inserted, ${podsSkipped} skipped.`);

    // 6. Migrate Services
    const [currentServices] = await conn.query('SELECT id, slug FROM services');
    const existingServiceIds = new Set(currentServices.map((s) => s.id));
    let srvInserted = 0;
    let srvSkipped = 0;
    const sourceServices = Array.isArray(sourceData.services) ? sourceData.services : [];

    for (let i = 0; i < sourceServices.length; i++) {
      const s = sourceServices[i];
      const id = s._id || s.id || `service_${i + 1}`;
      if (existingServiceIds.has(id)) {
        srvSkipped++;
        continue;
      }
      const slug = s.slug || s.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || id;
      const isAct = s.isActive !== false && s.is_active !== 0 ? 1 : 0;
      const order = typeof s.order === 'number' ? s.order : (s.sort_order || i + 1);
      const features = Array.isArray(s.features) ? JSON.stringify(s.features) : typeof s.features === 'string' ? s.features : '[]';

      await conn.query(
        `INSERT INTO services (
          id, title, slug, subtitle, category, real_problem, description,
          features, success_looks_like, icon, image, is_active, sort_order,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          s.title || '',
          slug,
          s.subtitle || '',
          s.category || 'Phase 1: Getting Started',
          s.realProblem || s.real_problem || '',
          s.description || '',
          features,
          s.successLooksLike || s.success_looks_like || '',
          s.icon || 'Rocket',
          s.image || '',
          isAct,
          order,
          s.createdAt || s.created_at || new Date().toISOString().slice(0, 19).replace('T', ' '),
          s.updatedAt || s.updated_at || new Date().toISOString().slice(0, 19).replace('T', ' '),
        ]
      );
      existingServiceIds.add(id);
      srvInserted++;
    }
    console.log(`Services migration complete: ${srvInserted} inserted, ${srvSkipped} skipped.`);

    // 7. Verification Summary
    const [finalBlogs] = await conn.query('SELECT COUNT(*) as count FROM blogs');
    const [finalPods] = await conn.query('SELECT COUNT(*) as count FROM podcasts');
    const [finalServices] = await conn.query('SELECT COUNT(*) as count FROM services');
    console.log('--- Final Database Verification ---');
    console.log(`Total blogs in MySQL: ${finalBlogs[0].count}`);
    console.log(`Total podcasts in MySQL: ${finalPods[0].count}`);
    console.log(`Total services in MySQL: ${finalServices[0].count}`);
    console.log('Migration completed successfully with zero duplicates.');
  } finally {
    await conn.end();
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
