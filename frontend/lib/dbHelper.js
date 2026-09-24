import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "backend", "data", "db.json");
const TMP_PATH = path.join("/tmp", "lucidmind_db.json");

let memoryDb = null;

export function getDb() {
  if (memoryDb) return memoryDb;
  try {
    if (fs.existsSync(TMP_PATH)) {
      const content = fs.readFileSync(TMP_PATH, "utf8");
      memoryDb = JSON.parse(content);
      return memoryDb;
    }
  } catch {}
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, "utf8");
      memoryDb = JSON.parse(content);
      return memoryDb;
    }
  } catch (err) {
    console.error("Error reading db.json:", err);
  }
  return { users: [], services: [], blogs: [], podcasts: [] };
}

export function saveDb(data) {
  memoryDb = data;
  let written = false;
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
    written = true;
  } catch {
    try {
      fs.writeFileSync(TMP_PATH, JSON.stringify(data, null, 2), "utf8");
      written = true;
    } catch {}
  }
  return written;
}

// SERVICES
export function getServices() {
  const db = getDb();
  return db.services || [];
}

export function createService(payload) {
  const db = getDb();
  const newService = {
    _id: "srv_" + Date.now(),
    ...payload,
    createdAt: new Date().toISOString(),
  };
  db.services = [newService, ...(db.services || [])];
  saveDb(db);
  return newService;
}

export function updateService(id, payload) {
  const db = getDb();
  const list = db.services || [];
  const idx = list.findIndex((s) => s._id === id || s.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...payload, updatedAt: new Date().toISOString() };
  db.services = list;
  saveDb(db);
  return list[idx];
}

export function deleteService(id) {
  const db = getDb();
  const list = db.services || [];
  const next = list.filter((s) => s._id !== id && s.id !== id);
  db.services = next;
  saveDb(db);
  return true;
}

export function reorderServices(orderedIds) {
  if (!Array.isArray(orderedIds)) return [];
  const db = getDb();
  const current = db.services || [];
  const map = new Map(current.map((s) => [String(s._id || s.id), s]));
  const reordered = [];
  orderedIds.forEach((id, idx) => {
    const item = map.get(String(id));
    if (item) {
      reordered.push({ ...item, order: idx + 1 });
      map.delete(String(id));
    }
  });
  for (const remaining of map.values()) {
    reordered.push({ ...remaining, order: reordered.length + 1 });
  }
  db.services = reordered;
  saveDb(db);
  return reordered;
}

// BLOGS
export function getBlogs() {
  const db = getDb();
  return db.blogs || [];
}

export function createBlog(payload) {
  const db = getDb();
  const newBlog = {
    _id: "blog_" + Date.now(),
    isActive: true,
    isPublished: true,
    ...payload,
    createdAt: new Date().toISOString(),
  };
  db.blogs = [newBlog, ...(db.blogs || [])];
  saveDb(db);
  return newBlog;
}

export function updateBlog(id, payload) {
  const db = getDb();
  const list = db.blogs || [];
  const idx = list.findIndex((b) => b._id === id || b.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...payload, updatedAt: new Date().toISOString() };
  db.blogs = list;
  saveDb(db);
  return list[idx];
}

export function deleteBlog(id) {
  const db = getDb();
  const list = db.blogs || [];
  const next = list.filter((b) => b._id !== id && b.id !== id);
  db.blogs = next;
  saveDb(db);
  return true;
}

export function reorderBlogs(orderedIds) {
  if (!Array.isArray(orderedIds)) return [];
  const db = getDb();
  const current = db.blogs || [];
  const map = new Map(current.map((b) => [String(b._id || b.id), b]));
  const reordered = [];
  orderedIds.forEach((id, idx) => {
    const item = map.get(String(id));
    if (item) {
      reordered.push({ ...item, order: idx + 1 });
      map.delete(String(id));
    }
  });
  for (const remaining of map.values()) {
    reordered.push({ ...remaining, order: reordered.length + 1 });
  }
  db.blogs = reordered;
  saveDb(db);
  return reordered;
}

// PODCASTS
export function getPodcasts() {
  const db = getDb();
  return db.podcasts || [];
}

export function createPodcast(payload) {
  const db = getDb();
  const newPodcast = {
    _id: "pod_" + Date.now(),
    isActive: true,
    isPublished: true,
    ...payload,
    createdAt: new Date().toISOString(),
  };
  db.podcasts = [newPodcast, ...(db.podcasts || [])];
  saveDb(db);
  return newPodcast;
}

export function updatePodcast(id, payload) {
  const db = getDb();
  const list = db.podcasts || [];
  const idx = list.findIndex((p) => p._id === id || p.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...payload, updatedAt: new Date().toISOString() };
  db.podcasts = list;
  saveDb(db);
  return list[idx];
}

export function deletePodcast(id) {
  const db = getDb();
  const list = db.podcasts || [];
  const next = list.filter((p) => p._id !== id && p.id !== id);
  db.podcasts = next;
  saveDb(db);
  return true;
}

export function reorderPodcasts(orderedIds) {
  if (!Array.isArray(orderedIds)) return [];
  const db = getDb();
  const current = db.podcasts || [];
  const map = new Map(current.map((p) => [String(p._id || p.id), p]));
  const reordered = [];
  orderedIds.forEach((id, idx) => {
    const item = map.get(String(id));
    if (item) {
      reordered.push({ ...item, order: idx + 1 });
      map.delete(String(id));
    }
  });
  for (const remaining of map.values()) {
    reordered.push({ ...remaining, order: reordered.length + 1 });
  }
  db.podcasts = reordered;
  saveDb(db);
  return reordered;
}
