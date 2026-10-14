import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, '..');
const sqlitePath = path.join(backendRoot, 'data', 'lucidmind.sqlite');
const recoveredPath = path.join(backendRoot, 'data', 'recovered_db.json');
const backendUploads = path.join(backendRoot, 'uploads');
const frontendUploads = path.resolve(backendRoot, '../frontend/public/uploads');

if (!fs.existsSync(sqlitePath)) {
  console.log('No sqlite database found at', sqlitePath);
  process.exit(0);
}

const db = new DatabaseSync(sqlitePath);

// 1. Sync uploads to frontend public
if (fs.existsSync(backendUploads)) {
  fs.mkdirSync(frontendUploads, { recursive: true });
  for (const f of fs.readdirSync(backendUploads)) {
    const src = path.join(backendUploads, f);
    const dest = path.join(frontendUploads, f);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
    }
  }
}

// 2. Read latest rows from SQLite
const blogs = db.prepare('SELECT * FROM blogs ORDER BY sort_order ASC, created_at DESC').all().map(b => ({
  ...b,
  _id: b.id,
  isPublished: Boolean(b.is_published),
  isActive: Boolean(b.is_published),
  order: b.sort_order,
  coverImage: b.cover_image,
  readTime: b.read_time,
  authorRole: b.author_role,
  tags: typeof b.tags === 'string' && b.tags.startsWith('[') ? JSON.parse(b.tags) : b.tags
}));

const podcasts = db.prepare('SELECT * FROM podcasts ORDER BY sort_order ASC, created_at DESC').all().map(p => ({
  ...p,
  _id: p.id,
  isPublished: Boolean(p.is_published),
  isActive: Boolean(p.is_published),
  order: p.sort_order,
  audioUrl: p.audio_url,
  coverImage: p.cover_image,
  mediaType: p.media_type,
  tags: typeof p.tags === 'string' && p.tags.startsWith('[') ? JSON.parse(p.tags) : p.tags
}));

const services = db.prepare('SELECT * FROM services ORDER BY sort_order ASC, created_at DESC').all().map(s => ({
  ...s,
  _id: s.id,
  isActive: Boolean(s.is_active),
  order: s.sort_order,
  realProblem: s.real_problem,
  successLooksLike: s.success_looks_like,
  features: typeof s.features === 'string' && s.features.startsWith('[') ? JSON.parse(s.features) : s.features
}));

const oldData = fs.existsSync(recoveredPath) ? JSON.parse(fs.readFileSync(recoveredPath, 'utf8')) : {};

const updatedData = {
  users: oldData.users || [],
  services,
  blogs,
  podcasts
};

fs.writeFileSync(recoveredPath, JSON.stringify(updatedData, null, 2), 'utf8');
console.log('Successfully synced SQLite data and uploaded files into recovered_db.json and frontend/public/uploads!');
