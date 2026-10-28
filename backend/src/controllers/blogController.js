import { asyncHandler } from '../utils/http.js';
import * as blogs from '../services/blogService.js';
import { extractOrderedIds, validateTitleRequired } from '../validators/content.js';

export const list = asyncHandler(async (req, res) => {
  const isAdmin = Boolean(req.user);
  const { category, tag, search, isPublished, page, limit } = req.query;

  const result = await blogs.listBlogs({
    isAdmin,
    category,
    tag,
    search,
    isPublished,
    page: page ? parseInt(page, 10) : undefined,
    limit: limit ? parseInt(limit, 10) : undefined,
  });

  if (result && typeof result === 'object' && !Array.isArray(result) && 'pagination' in result) {
    res.json(result);
  } else {
    res.json({ blogs: result });
  }
});

export const get = asyncHandler(async (req, res) => {
  const isAdmin = Boolean(req.user);
  res.json({ blog: await blogs.getBlog(req.params.id, { isAdmin }) });
});

export const create = asyncHandler(async (req, res) => {
  const body = req.body ?? {};
  validateTitleRequired(body);
  res.status(201).json({ message: 'Blog created', blog: await blogs.createBlog(body) });
});

export const update = asyncHandler(async (req, res) => {
  res.json({ message: 'Blog updated', blog: await blogs.updateBlog(req.params.id, req.body ?? {}) });
});

export const remove = asyncHandler(async (req, res) => {
  await blogs.deleteBlog(req.params.id);
  res.json({ message: 'Blog deleted' });
});

export const publish = asyncHandler(async (req, res) => {
  const blog = await blogs.setBlogPublished(req.params.id, req.body?.isPublished ?? 0);
  res.json({ message: 'Blog publish status updated', blog });
});

export const reorder = asyncHandler(async (req, res) => {
  const ids = extractOrderedIds(req.body, 'blogs');
  res.json({ blogs: await blogs.reorderBlogs(ids) });
});
