import db from '../config/database.js';
import { HttpError } from '../utils/http.js';
import { coalesce, isset, parseJsonArray, slugify, toInt, uniqueId } from '../utils/php.js';

export const mapService = (row) => ({
  ...row,
  _id: row.id,
  features: parseJsonArray(row.features),
  isActive: Boolean(row.is_active),
  realProblem: row.real_problem,
  successLooksLike: row.success_looks_like,
});

const UPDATE_MAPPING = {
  title: 'title',
  slug: 'slug',
  subtitle: 'subtitle',
  category: 'category',
  realProblem: 'real_problem',
  description: 'description',
  successLooksLike: 'success_looks_like',
  icon: 'icon',
  image: 'image',
  order: 'sort_order',
};

/** Features may arrive as an array or a comma separated string. */
const normaliseFeatures = (features) => {
  if (typeof features === 'string') {
    return features.split(',').map((f) => f.trim()).filter(Boolean);
  }
  return Array.isArray(features) ? features : [];
};

const dbError = (err) => {
  if (err?.code === 'ER_DUP_ENTRY') return new HttpError(400, 'A service with this slug already exists');
  if (err?.sqlState || err?.code?.startsWith?.('ER_')) return new HttpError(400, 'Invalid service data');
  return err;
};

export async function listServices() {
  const rows = await db.query('SELECT * FROM services ORDER BY sort_order ASC, created_at DESC');
  return rows.map(mapService);
}

export async function createService(data) {
  const id = uniqueId('srv_');
  const slug = data.slug ? data.slug : slugify(data.title);
  const features = normaliseFeatures(data.features ?? []);

  try {
    await db.query(
      `INSERT INTO services (id, title, slug, subtitle, category, real_problem, description, features,
        success_looks_like, icon, image, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.title,
        slug,
        coalesce(data.subtitle, ''),
        coalesce(data.category, 'Phase 1: Getting Started'),
        coalesce(data.realProblem, ''),
        coalesce(data.description, ''),
        JSON.stringify(features),
        coalesce(data.successLooksLike, ''),
        coalesce(data.icon, 'Rocket'),
        coalesce(data.image, ''),
        isset(data.isActive) ? toInt(data.isActive) : 1,
        toInt(coalesce(data.order, 0)),
      ],
    );
  } catch (err) {
    throw dbError(err);
  }
  return { ...data, _id: id, features };
}

export async function updateService(id, data) {
  const fields = [];
  const values = [];

  for (const [jsonKey, col] of Object.entries(UPDATE_MAPPING)) {
    if (isset(data[jsonKey])) {
      fields.push(`${col} = ?`);
      values.push(data[jsonKey]);
    }
  }
  if (isset(data.isActive)) {
    fields.push('is_active = ?');
    values.push(toInt(data.isActive));
  }
  if (isset(data.features)) {
    fields.push('features = ?');
    values.push(JSON.stringify(normaliseFeatures(data.features)));
  }
  if (!fields.length) throw new HttpError(400, 'No fields to update');

  let result;
  try {
    result = await db.query(`UPDATE services SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
  } catch (err) {
    throw dbError(err);
  }
  if (!result.affectedRows) throw new HttpError(404, 'Service not found or no changes made');

  const rows = await db.query('SELECT * FROM services WHERE id = ?', [id]);
  return mapService(rows[0]);
}

export async function deleteService(id) {
  const result = await db.query('DELETE FROM services WHERE id = ?', [id]);
  if (!result.affectedRows) throw new HttpError(404, 'Service not found');
}

export async function reorderServices(orderedIds) {
  await db.withTransaction(async (conn) => {
    for (const [index, id] of orderedIds.entries()) {
      await conn.execute('UPDATE services SET sort_order = ? WHERE id = ?', [index + 1, id ?? null]);
    }
  });
  return listServices();
}
