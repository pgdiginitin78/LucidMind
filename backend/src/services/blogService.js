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

export async function listBlogs(options = {}) {
  const { isAdmin = false, category, tag, search, isPublished, page, limit } = options;

  const conditions = [];
  const params = [];

  // Public callers only see published blogs
  if (!isAdmin) {
    conditions.push('is_published = 1');
  } else if (isPublished !== undefined && isPublished !== null && String(isPublished).trim() !== '') {
    conditions.push('is_published = ?');
    params.push(toInt(isPublished));
  }

  if (category && String(category).trim()) {
    conditions.push('category = ?');
    params.push(String(category).trim());
  }

  if (tag && String(tag).trim()) {
    conditions.push('tag = ?');
    params.push(String(tag).trim());
  }

  if (search && String(search).trim()) {
    const q = `%${String(search).trim()}%`;
    conditions.push('(title LIKE ? OR excerpt LIKE ? OR description LIKE ? OR content LIKE ?)');
    params.push(q, q, q, q);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  if (page && limit) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const offset = (pageNum - 1) * limitNum;

    const countSql = `SELECT COUNT(*) as total FROM blogs ${whereClause}`;
    const countRows = await db.query(countSql, params);
    const total = countRows[0]?.total || 0;

    const dataSql = `SELECT * FROM blogs ${whereClause} ORDER BY sort_order ASC, created_at DESC LIMIT ? OFFSET ?`;
    const rows = await db.query(dataSql, [...params, limitNum, offset]);

    return {
      blogs: rows.map(mapBlog),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  const rows = await db.query(`SELECT * FROM blogs ${whereClause} ORDER BY sort_order ASC, created_at DESC`, params);
  return rows.map(mapBlog);
}

export async function getBlog(idOrSlug, options = {}) {
  const { isAdmin = false } = options;
  const rows = await db.query('SELECT * FROM blogs WHERE id = ? OR slug = ?', [idOrSlug, idOrSlug]);
  if (!rows[0]) throw new HttpError(404, 'Blog not found');
  const blog = mapBlog(rows[0]);
  if (!isAdmin && !blog.isPublished) {
    throw new HttpError(404, 'Blog not found');
  }
  return blog;
}

export async function createBlog(data) {
  const title = (data.title || '').trim();
  if (!title) throw new HttpError(400, 'Title is required');

  const id = uniqueId('blog_');
  let slug = data.slug ? slugify(data.slug) : slugify(title);
  if (!slug) slug = id;

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
  const isPublished = isset(data.isPublished) ? toInt(data.isPublished) : (isset(data.isActive) ? toInt(data.isActive) : 1);
  const tags = JSON.stringify(Array.isArray(data.tags) ? data.tags : []);

  try {
    // If slug collision check in DB:
    if (!data.slug) {
      const existing = await db.query('SELECT id FROM blogs WHERE slug = ?', [slug]);
      if (existing && existing.length > 0) {
        let suffix = 2;
        let candidate = `${slug}-${suffix}`;
        while (true) {
          const check = await db.query('SELECT id FROM blogs WHERE slug = ?', [candidate]);
          if (!check || check.length === 0) {
            slug = candidate;
            break;
          }
          suffix += 1;
          candidate = `${slug}-${suffix}`;
        }
      }
    }

    await db.query(
      `INSERT INTO blogs (id, title, slug, tag, category, author, author_role, read_time, date, excerpt,
        description, content, image, cover_image, is_published, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, slug, tag, category, author, authorRole, readTime, date, excerpt, description,
        content, image, coverImage, isPublished, tags].map((v) => (v === undefined ? null : v)),
    );
  } catch (err) {
    throw dbError(err);
  }

  let saved;
  try {
    saved = await getBlog(id, { isAdmin: true });
  } catch {
    saved = null;
  }
  return { ...data, ...saved, _id: id, id };
}

export async function updateBlog(id, input) {
  const data = { ...input };
  if (isset(data.title) && !isset(data.slug)) {
    data.slug = slugify(data.title);
  } else if (isset(data.slug)) {
    data.slug = slugify(data.slug);
  }

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
  } else if (isset(data.isActive)) {
    fields.push('is_published = ?');
    values.push(toInt(data.isActive));
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
  if (!result.affectedRows) throw new HttpError(404, 'Blog not found or no changes made');
  return getBlog(id, { isAdmin: true });
}

export async function deleteBlog(id) {
  const result = await db.query('DELETE FROM blogs WHERE id = ?', [id]);
  if (!result.affectedRows) throw new HttpError(404, 'Blog not found');
}

export async function setBlogPublished(id, isPublished) {
  const result = await db.query('UPDATE blogs SET is_published = ? WHERE id = ?', [toInt(isPublished), id]);
  if (!result.affectedRows) throw new HttpError(404, 'Blog not found');
  return getBlog(id, { isAdmin: true });
}

export async function reorderBlogs(orderedIds) {
  await db.withTransaction(async (conn) => {
    for (const [index, id] of orderedIds.entries()) {
      await conn.execute('UPDATE blogs SET sort_order = ? WHERE id = ?', [index + 1, id ?? null]);
    }
  });
  return listBlogs({ isAdmin: true });
}
