import fs from 'node:fs';
import path from 'node:path';
import config from '../config/env.js';
import db from '../config/database.js';

let syncTimeout = null;

export function triggerDbSyncToJson() {
  if (config.isProduction || Boolean(process.env.VERCEL)) {
    return; // Production must strictly use persistent database, never server filesystem
  }
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(async () => {
    try {
      const recoveredPath = path.resolve(config.backendRoot, 'data', 'recovered_db.json');
      const blogs = await db.query('SELECT * FROM blogs ORDER BY sort_order ASC, created_at DESC');
      const podcasts = await db.query('SELECT * FROM podcasts ORDER BY sort_order ASC, created_at DESC');
      const services = await db.query('SELECT * FROM services ORDER BY sort_order ASC, created_at DESC');

      const oldData = fs.existsSync(recoveredPath) ? JSON.parse(fs.readFileSync(recoveredPath, 'utf8')) : {};

      const mappedBlogs = (blogs || []).map((b) => ({
        ...b,
        _id: b.id,
        isPublished: Boolean(b.is_published),
        isActive: Boolean(b.is_published),
        order: b.sort_order,
        coverImage: b.cover_image,
        readTime: b.read_time,
        authorRole: b.author_role,
        tags: typeof b.tags === 'string' && b.tags.startsWith('[') ? JSON.parse(b.tags) : b.tags,
      }));

      const mappedPodcasts = (podcasts || []).map((p) => ({
        ...p,
        _id: p.id,
        isPublished: Boolean(p.is_published),
        isActive: Boolean(p.is_published),
        order: p.sort_order,
        audioUrl: p.audio_url,
        coverImage: p.cover_image,
        mediaType: p.media_type,
        tags: typeof p.tags === 'string' && p.tags.startsWith('[') ? JSON.parse(p.tags) : p.tags,
      }));

      const mappedServices = (services || []).map((s) => ({
        ...s,
        _id: s.id,
        isActive: Boolean(s.is_active),
        order: s.sort_order,
        realProblem: s.real_problem,
        successLooksLike: s.success_looks_like,
        features: typeof s.features === 'string' && s.features.startsWith('[') ? JSON.parse(s.features) : s.features,
      }));

      const updated = {
        users: oldData.users || [],
        services: mappedServices,
        blogs: mappedBlogs,
        podcasts: mappedPodcasts,
      };

      fs.writeFileSync(recoveredPath, JSON.stringify(updated, null, 2), 'utf8');
    } catch (e) {
      // Non-fatal background sync
    }
  }, 500);
  syncTimeout.unref();
}
