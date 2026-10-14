import db from '../config/database.js';
import { HttpError } from '../utils/http.js';
import { coalesce, isset, parseJsonArray, slugify, toInt, uniqueId } from '../utils/php.js';

export const mapBlog = (row) => ({
  ...row,
  _id: row.id,
  tags: parseJsonArray(row.tags),
  isPublished: Boolean(row.is_published),
  authorRole: row.author_role,
  readTime: row.read_time,
  coverImage: row.cover_image,
});

const UPDATE_MAPPING = {
  title: 'title',
  slug: 'slug',
  tag: 'tag',
  category: 'category',
  author: 'author',
  authorRole: 'author_role',
  readTime: 'read_time',
  date: 'date',
  excerpt: 'excerpt',
  description: 'description',
  content: 'content',
  image: 'image',
  coverImage: 'cover_image',
};

const dbError = (err) => {
  if (err?.code === 'ER_DUP_ENTRY') return new HttpError(400, 'A blog with this slug already exists');
  if (err?.sqlState || err?.code?.startsWith?.('ER_')) return new HttpError(400, 'Invalid blog data');
  return err;
};

export async function listBlogs() {
  const rows = await db.query('SELECT * FROM blogs ORDER BY sort_order ASC, created_at DESC');
  return rows.map(mapBlog);
}

export async function getBlog(idOrSlug) {
  const rows = await db.query('SELECT * FROM blogs WHERE id = ? OR slug = ?', [idOrSlug, idOrSlug]);
  if (!rows[0]) throw new HttpError(404, 'Blog not found');
  return mapBlog(rows[0]);
}

export async function createBlog(data) {
  const id = uniqueId('blog_');
  const slug = data.slug ? data.slug : slugify(data.title);
  const tag = coalesce(data.tag, 'MINDSET');
  const category = coalesce(data.category, tag);
  const author = coalesce(data.author, 'Ravishankar Pingali');
  const authorRole = coalesce(
    data.authorRole,
    'Building Adaptive Enterprises | GCC Leader | Enterprise Reinvention | Board Advisor',
  );
  const readTime = coalesce(data.readTime, '3 MIN READ');
  const date = coalesce(
    data.date,
    new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  );
  const excerpt = coalesce(data.excerpt, data.description, '');
  const description = coalesce(data.description, excerpt);
  const content = coalesce(data.content, '');
  const image = coalesce(data.image, data.coverImage, '');
  const coverImage = coalesce(data.coverImage, image);
  const isPublished = isset(data.isPublished) ? toInt(data.isPublished) : 1;
  const tags = JSON.stringify(Array.isArray(data.tags) ? data.tags : []);

  try {
    await db.query(
      `INSERT INTO blogs (id, title, slug, tag, category, author, author_role, read_time, date, excerpt,
        description, content, image, cover_image, is_published, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, data.title, slug, tag, category, author, authorRole, readTime, date, excerpt, description,
        content, image, coverImage, isPublished, tags].map((v) => (v === undefined ? null : v)),
    );
  } catch (err) {
    throw dbError(err);
  }
  return { ...data, _id: id };
}

export async function updateBlog(id, input) {
  const data = { ...input };
  if (isset(data.title) && !isset(data.slug)) data.slug = slugify(data.title);

  const fields = [];
  const values = [];
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
  if (Array.isArray(data.tags)) {
    fields.push('tags = ?');
    values.push(JSON.stringify(data.tags));
  }
  if (!fields.length) throw new HttpError(400, 'No fields to update');

  let result;
  try {
    result = await db.query(`UPDATE blogs SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
  } catch (err) {
    throw dbError(err);
  }
  // affectedRows = matched rows, so an unchanged save is not misreported as "not found"
  if (!result.affectedRows) throw new HttpError(404, 'Blog not found or no changes made');
  return getBlog(id);
}

export async function deleteBlog(id) {
  const result = await db.query('DELETE FROM blogs WHERE id = ?', [id]);
  if (!result.affectedRows) throw new HttpError(404, 'Blog not found');
}

export async function setBlogPublished(id, isPublished) {
  const result = await db.query('UPDATE blogs SET is_published = ? WHERE id = ?', [toInt(isPublished), id]);
  if (!result.affectedRows) throw new HttpError(404, 'Blog not found');
  return getBlog(id);
}

export async function reorderBlogs(orderedIds) {
  await db.withTransaction(async (conn) => {
    for (const [index, id] of orderedIds.entries()) {
      await conn.execute('UPDATE blogs SET sort_order = ? WHERE id = ?', [index + 1, id ?? null]);
    }
  });
  return listBlogs();
}
