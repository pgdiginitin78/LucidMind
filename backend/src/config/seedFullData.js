import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import logger from "../utils/logger.js";
import config from "./env.js";



export function seedFullData(db, force = false) {
  const recoveredFile = path.resolve(
    config.backendRoot,
    "data",
    "recovered_db.json",
  );
  if (!fs.existsSync(recoveredFile)) return;

  const data = JSON.parse(fs.readFileSync(recoveredFile, "utf8"));

  // 1. Users
  const userCount =
    db.prepare("SELECT COUNT(*) as cnt FROM users").all()[0]?.cnt || 0;
  if (userCount === 0 || force) {
    const adminPasswordHash = bcrypt.hashSync("admin@1234", 10);
    db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(
      "admin",
      adminPasswordHash,
    );
    logger.info("Created admin user: admin / admin@1234");
  }

  // 2. Blogs - ONLY seed if table is empty (or force is true)
  const blogCount =
    db.prepare("SELECT COUNT(*) as cnt FROM blogs").all()[0]?.cnt || 0;
  if ((blogCount === 0 || force) && Array.isArray(data.blogs)) {
    const insertBlog = db.prepare(`
      INSERT OR REPLACE INTO blogs (
        id, title, slug, tag, category, author, author_role, read_time, date,
        excerpt, description, content, image, cover_image, tags, is_published,
        published_at, sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < data.blogs.length; i++) {
      const b = data.blogs[i];
      const id = b._id || b.id || `blog_${i + 1}`;
      const slug = b.slug || b.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const tags = Array.isArray(b.tags)
        ? JSON.stringify(b.tags)
        : typeof b.tags === "string"
          ? b.tags
          : "[]";
      const isPub = b.isPublished !== false && b.isActive !== false ? 1 : 0;
      const order = typeof b.order === "number" ? b.order : i + 1;

      insertBlog.run(
        id,
        b.title || "",
        slug,
        b.tag || "MINDSET",
        b.category || b.tag || "Thought Leadership",
        b.author || "Ravishankar Pingali",
        b.authorRole ||
          "Building Adaptive Enterprises | GCC Leader | Board Advisor",
        b.readTime || "3 MIN READ",
        b.date || "October 2026",
        b.excerpt || b.description || "",
        b.description || b.excerpt || "",
        b.content || "",
        b.image || b.coverImage || "",
        b.coverImage || b.image || "",
        tags,
        isPub,
        b.publishedAt || b.createdAt || new Date().toISOString(),
        order,
        b.createdAt || new Date().toISOString(),
        b.updatedAt || new Date().toISOString(),
      );
    }
    logger.info(`Seeded ${data.blogs.length} original blogs into database.`);
  }

  // 3. Podcasts & Videos - ONLY seed if table is empty (or force is true)
  const podCount =
    db.prepare("SELECT COUNT(*) as cnt FROM podcasts").all()[0]?.cnt || 0;
  if ((podCount === 0 || force) && Array.isArray(data.podcasts)) {
    const insertPod = db.prepare(`
      INSERT OR REPLACE INTO podcasts (
        id, title, slug, episode, src, audio_url, thumbnail, cover_image,
        duration, host, guest, description, tags, media_type, is_published,
        sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < data.podcasts.length; i++) {
      const p = data.podcasts[i];
      const id = p._id || p.id || `pod_${i + 1}`;
      const slug = p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const isPub =
        p.isPublished !== false && p.is_published !== 0 && p.isActive !== false
          ? 1
          : 0;
      const order =
        typeof p.sort_order === "number"
          ? p.sort_order
          : typeof p.order === "number"
            ? p.order
            : i + 1;
      const mediaType = (
        p.media_type ||
        p.mediaType ||
        "podcast"
      ).toLowerCase();
      const tags = Array.isArray(p.tags) ? [...p.tags] : [];
      if (!tags.includes(mediaType)) tags.push(mediaType);

      insertPod.run(
        id,
        p.title || "",
        slug,
        p.episode || `Ep. 0${i + 1}`,
        p.src || p.audio_url || p.audioUrl || "",
        p.audio_url || p.audioUrl || p.src || "",
        p.thumbnail || p.cover_image || p.coverImage || p.image || "",
        p.cover_image || p.coverImage || p.thumbnail || p.image || "",
        p.duration || "",
        p.host || "Ravishankar Pingali",
        p.guest || "",
        p.description || "",
        JSON.stringify(tags),
        mediaType,
        isPub,
        order,
        p.created_at || p.createdAt || new Date().toISOString(),
        p.updated_at || p.updatedAt || new Date().toISOString(),
      );
    }
    logger.info(
      `Seeded ${data.podcasts.length} original podcasts/videos into database.`,
    );
  }

  // 4. Services - ONLY seed if table is empty (or force is true)
  const srvCount =
    db.prepare("SELECT COUNT(*) as cnt FROM services").all()[0]?.cnt || 0;
  if ((srvCount === 0 || force) && Array.isArray(data.services)) {
    const insertSrv = db.prepare(`
      INSERT OR REPLACE INTO services (
        id, title, slug, subtitle, category, real_problem, description,
        features, success_looks_like, icon, image, is_active, sort_order,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < data.services.length; i++) {
      const s = data.services[i];
      const id = s._id || s.id || `srv_${i + 1}`;
      const slug = s.slug || s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const isActive = s.isActive !== false ? 1 : 0;
      const order = typeof s.order === "number" ? s.order : i + 1;
      const features = Array.isArray(s.features)
        ? JSON.stringify(s.features)
        : "[]";

      insertSrv.run(
        id,
        s.title || "",
        slug,
        s.subtitle || "",
        s.category || "Phase 1: Getting Started",
        s.realProblem || "",
        s.description || "",
        features,
        s.successLooksLike || "",
        s.icon || "Rocket",
        s.image || "",
        isActive,
        order,
        s.createdAt || new Date().toISOString(),
        s.updatedAt || new Date().toISOString(),
      );
    }
    logger.info(
      `Seeded ${data.services.length} original services into database.`,
    );
  }
}
