import db from '../config/database.js';
import { HttpError } from '../utils/http.js';
import { coalesce, isset, parseJsonArray, slugify, toInt, uniqueId } from '../utils/php.js';
import { triggerDbSyncToJson } from '../utils/syncJson.js';

// The PHP controller lazily added/widened columns on first request. This runs once per process,
// is idempotent, and never drops or rewrites data.
let schemaReady = null;
export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      try {
        const cols = await db.query("SHOW COLUMNS FROM podcasts LIKE 'media_type'");
        if (!cols.length) {
          await db.query("ALTER TABLE podcasts ADD COLUMN media_type VARCHAR(50) DEFAULT 'podcast'");
        }
        const thumb = await db.query("SHOW COLUMNS FROM podcasts LIKE 'thumbnail'");
        if (thumb[0] && /varchar/i.test(thumb[0].Type || '')) {
          await db.query('ALTER TABLE podcasts MODIFY COLUMN thumbnail LONGTEXT, MODIFY COLUMN cover_image LONGTEXT');
        }
        return true;
      } catch {
        schemaReady = null; // retry on a later request
        return false;
      }
    })();
  }
  return schemaReady;
}
export const resetSchemaCache = () => {
  schemaReady = null;
};

export const mapPodcast = (row) => {
  const tags = parseJsonArray(row.tags);
  const hasVideoTag = tags.includes('video') || /^v\d+/i.test(String(row.episode ?? '').trim());
  return {
    ...row,
    _id: row.id,
    tags,
    isPublished: Boolean(row.is_published),
    audioUrl: row.audio_url,
    coverImage: row.cover_image,
    mediaType: row.media_type ? row.media_type : hasVideoTag ? 'video' : 'podcast',
  };
};

const UPDATE_MAPPING = {
  title: 'title',
  slug: 'slug',
  episode: 'episode',
  src: 'src',
  audioUrl: 'audio_url',
  thumbnail: 'thumbnail',
  coverImage: 'cover_image',
  duration: 'duration',
  host: 'host',
  guest: 'guest',
  description: 'description',
};

const dbError = (err) => {
  if (err?.code === 'ER_DUP_ENTRY') return new HttpError(400, 'A podcast with this value already exists');
  if (err?.sqlState || err?.code?.startsWith?.('ER_')) return new HttpError(400, 'Invalid podcast data');
  return err;
};

export async function listPodcasts() {
  await ensureSchema();
  const rows = await db.query('SELECT * FROM podcasts ORDER BY sort_order ASC, created_at DESC');
  return rows.map(mapPodcast);
}

export async function getPodcast(id) {
  await ensureSchema();
  const rows = await db.query('SELECT * FROM podcasts WHERE id = ?', [id]);
  if (!rows[0]) throw new HttpError(404, 'Podcast not found');
  return mapPodcast(rows[0]);
}

export async function createPodcast(data) {
  const hasMediaTypeCol = await ensureSchema();

  const id = uniqueId('pod_');
  const slug = data.slug ? data.slug : slugify(data.title);
  const episode = coalesce(data.episode, 'Ep. 01');
  const finalSrc = coalesce(data.src, data.audioUrl, '');
  const thumbnail = coalesce(data.thumbnail, data.coverImage, '');
  const coverImage = coalesce(data.coverImage, thumbnail);
  const duration = coalesce(data.duration, '15 mins');
  const host = coalesce(data.host, 'Ravishankar Pingali');
  const guest = coalesce(data.guest, '');
  const description = coalesce(data.description, '');
  const isPublished = isset(data.isPublished) ? toInt(data.isPublished) : 1;
  const tags = Array.isArray(data.tags) ? [...data.tags] : [];
  const mediaType = (data.mediaType || data.type || 'podcast').toString().toLowerCase();
  if (!tags.includes(mediaType)) tags.push(mediaType);
  const tagsJson = JSON.stringify(tags);

  const base = [id, data.title, slug, episode, finalSrc, finalSrc, thumbnail, coverImage, duration, host, guest,
    description, tagsJson, isPublished];

  try {
    if (hasMediaTypeCol) {
      await db.query(
        `INSERT INTO podcasts (id, title, slug, episode, src, audio_url, thumbnail, cover_image, duration, host,
          guest, description, tags, is_published, media_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [...base, mediaType],
      );
    } else {
      await db.query(
        `INSERT INTO podcasts (id, title, slug, episode, src, audio_url, thumbnail, cover_image, duration, host,
          guest, description, tags, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        base,
      );
    }
  } catch (err) {
    throw dbError(err);
  }
  triggerDbSyncToJson();
  return { ...data, _id: id, mediaType, tags };
}

export async function updatePodcast(id, input) {
  const hasMediaTypeCol = await ensureSchema();
  const data = { ...input };

  const rows = await db.query('SELECT * FROM podcasts WHERE id = ?', [id]);
  const existing = rows[0];
  if (!existing) throw new HttpError(404, 'Podcast not found');

  const fields = [];
  const values = [];

  if (hasMediaTypeCol && (isset(data.mediaType) || isset(data.type))) {
    fields.push('media_type = ?');
    values.push(String(data.mediaType ?? data.type ?? 'podcast').toLowerCase());
  }

  // Mirror paired fields like the PHP controller
  if (isset(data.src) && !isset(data.audioUrl)) data.audioUrl = data.src;
  if (isset(data.audioUrl) && !isset(data.src)) data.src = data.audioUrl;
  if (isset(data.thumbnail) && !isset(data.coverImage)) data.coverImage = data.thumbnail;
  if (isset(data.coverImage) && !isset(data.thumbnail)) data.thumbnail = data.coverImage;

  for (const [jsonKey, col] of Object.entries(UPDATE_MAPPING)) {
    if (isset(data[jsonKey])) {
      fields.push(`${col} = ?`);
      values.push(data[jsonKey]);
    }
  }
  if (isset(data.isPublished)) {
    fields.push('is_published = ?');
    values.push(toInt(data.isPublished));
  }

  const mediaTypeVal = String(data.mediaType ?? data.type ?? '').toLowerCase();
  let tags = Array.isArray(data.tags) ? [...data.tags] : parseJsonArray(existing.tags);
  if (mediaTypeVal) {
    tags = tags.filter((t) => t !== 'video' && t !== 'podcast');
    tags.push(mediaTypeVal);
  }
  fields.push('tags = ?');
  values.push(JSON.stringify(tags));

  try {
    await db.query(`UPDATE podcasts SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
  } catch (err) {
    throw dbError(err);
  }
  triggerDbSyncToJson();
  return getPodcast(id);
}

export async function deletePodcast(id) {
  const result = await db.query('DELETE FROM podcasts WHERE id = ?', [id]);
  if (!result.affectedRows) throw new HttpError(404, 'Podcast not found');
  triggerDbSyncToJson();
}

export async function setPodcastPublished(id, isPublished) {
  const result = await db.query('UPDATE podcasts SET is_published = ? WHERE id = ?', [toInt(isPublished), id]);
  if (!result.affectedRows) throw new HttpError(404, 'Podcast not found');
  triggerDbSyncToJson();
  return getPodcast(id);
}

export async function reorderPodcasts(orderedIds) {
  await db.withTransaction(async (conn) => {
    for (const [index, id] of orderedIds.entries()) {
      await conn.execute('UPDATE podcasts SET sort_order = ? WHERE id = ?', [index + 1, id ?? null]);
    }
  });
  triggerDbSyncToJson();
  return listPodcasts();
}
