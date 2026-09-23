import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Blog from '../models/Blog.model.js';

const DB_FILE = path.join(process.cwd(), 'backend', 'data', 'db.json');

const getLocalBlogs = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      return data.blogs || [];
    }
  } catch {
    return [];
  }
  return [];
};

const saveLocalBlogs = (blogs) => {
  try {
    let data = {};
    if (fs.existsSync(DB_FILE)) {
      data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
    data.blogs = blogs;
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local blogs:', err.message);
  }
};

const slugify = (text) => {
  return (text || '')
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .trim();
};

const getAllBlogs = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const blogs = await Blog.find().sort({ createdAt: -1 });
      return res.status(200).json({ blogs });
    }
    const blogs = getLocalBlogs();
    return res.status(200).json({ blogs });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (mongoose.connection.readyState === 1) {
      const blog = await Blog.findOne({ slug });
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      return res.status(200).json({ blog });
    }
    const blogs = getLocalBlogs();
    const blog = blogs.find((b) => b.slug === slug || b._id === slug || b.id === slug);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    return res.status(200).json({ blog });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const {
      title,
      tag,
      category,
      author,
      authorRole,
      readTime,
      date,
      excerpt,
      description,
      content,
      image,
      coverImage,
      isPublished,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const slug = req.body.slug || slugify(title);

    if (mongoose.connection.readyState === 1) {
      const blog = await Blog.create({
        title,
        slug,
        tag: tag || 'MINDSET',
        category: category || tag || 'Thought Leadership',
        author: author || 'Ravishankar Pingali',
        authorRole:
          authorRole ||
          'Building Adaptive Enterprises | GCC Leader | Enterprise Reinvention | Board Advisor',
        readTime: readTime || '3 MIN READ',
        date: date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        excerpt: excerpt || description || '',
        description: description || excerpt || '',
        content: content || '',
        image: image || coverImage || '',
        coverImage: coverImage || image || '',
        isPublished: isPublished !== undefined ? isPublished : true,
      });
      return res.status(201).json({ message: 'Blog created', blog });
    }

    const blogs = getLocalBlogs();
    const newBlog = {
      _id: 'blog_' + Date.now(),
      title,
      slug,
      tag: tag || 'MINDSET',
      category: category || tag || 'Thought Leadership',
      author: author || 'Ravishankar Pingali',
      authorRole:
        authorRole ||
        'Building Adaptive Enterprises | GCC Leader | Enterprise Reinvention | Board Advisor',
      readTime: readTime || '3 MIN READ',
      date: date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      excerpt: excerpt || description || '',
      description: description || excerpt || '',
      content: content || '',
      image: image || coverImage || '',
      coverImage: coverImage || image || '',
      isPublished: isPublished !== undefined ? isPublished : true,
      createdAt: new Date().toISOString(),
    };
    blogs.unshift(newBlog);
    saveLocalBlogs(blogs);
    return res.status(201).json({ message: 'Blog created', blog: newBlog });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const body = { ...req.body };
    if (body.title && !body.slug) {
      body.slug = slugify(body.title);
    }

    if (mongoose.connection.readyState === 1) {
      const blog = await Blog.findByIdAndUpdate(id, body, { new: true, runValidators: true });
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      return res.status(200).json({ message: 'Blog updated', blog });
    }

    const blogs = getLocalBlogs();
    const idx = blogs.findIndex((b) => b._id === id || b.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Blog not found' });

    blogs[idx] = {
      ...blogs[idx],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    saveLocalBlogs(blogs);
    return res.status(200).json({ message: 'Blog updated', blog: blogs[idx] });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const blog = await Blog.findByIdAndDelete(id);
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      return res.status(200).json({ message: 'Blog deleted' });
    }

    let blogs = getLocalBlogs();
    const exists = blogs.some((b) => b._id === id || b.id === id);
    if (!exists) return res.status(404).json({ message: 'Blog not found' });

    blogs = blogs.filter((b) => b._id !== id && b.id !== id);
    saveLocalBlogs(blogs);
    return res.status(200).json({ message: 'Blog deleted' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const publishBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;
    if (mongoose.connection.readyState === 1) {
      const blog = await Blog.findByIdAndUpdate(
        id,
        { isPublished: Boolean(isPublished) },
        { new: true }
      );
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      return res.status(200).json({ message: 'Blog publish status updated', blog });
    }
    const blogs = getLocalBlogs();
    const idx = blogs.findIndex((b) => b._id === id || b.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Blog not found' });
    blogs[idx].isPublished = Boolean(isPublished);
    blogs[idx].updatedAt = new Date().toISOString();
    saveLocalBlogs(blogs);
    return res.status(200).json({ message: 'Blog publish status updated', blog: blogs[idx] });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const reorderBlogs = async (req, res) => {
  try {
    const orderedIds = req.body.orderedIds || req.body.blogs?.map((b) => b._id || b.id);
    if (!orderedIds || !Array.isArray(orderedIds)) {
      return res.status(400).json({ message: 'orderedIds array is required' });
    }
    const current = getLocalBlogs();
    const map = new Map(current.map((b) => [String(b._id || b.id), b]));
    const reordered = [];
    orderedIds.forEach((id, idx) => {
      const item = map.get(String(id));
      if (item) {
        reordered.push({ ...item, order: idx + 1 });
        map.delete(String(id));
      }
    });
    for (const rem of map.values()) {
      reordered.push({ ...rem, order: reordered.length + 1 });
    }
    saveLocalBlogs(reordered);
    return res.status(200).json({ message: 'Articles reordered', blogs: reordered });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default { getAllBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog, publishBlog, reorderBlogs };

