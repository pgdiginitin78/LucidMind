import Blog from '../models/Blog.model.js';

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .trim();
};

const getAllBlogs = async (onlyPublished = true) => {
  const filter = onlyPublished ? { isPublished: true } : {};
  return Blog.find(filter).populate('author', 'name email').sort({ createdAt: -1 });
};

const getBlogBySlug = async (slug) => {
  const blog = await Blog.findOne({ slug }).populate('author', 'name email');
  if (!blog) throw new Error('Blog not found');
  return blog;
};

const createBlog = async (blogData, authorId) => {
  const slug = slugify(blogData.title);
  return Blog.create({ ...blogData, slug, author: authorId });
};

const updateBlog = async (blogId, updateData) => {
  if (updateData.title) updateData.slug = slugify(updateData.title);
  const blog = await Blog.findByIdAndUpdate(blogId, updateData, { new: true });
  if (!blog) throw new Error('Blog not found');
  return blog;
};

const deleteBlog = async (blogId) => {
  const blog = await Blog.findByIdAndDelete(blogId);
  if (!blog) throw new Error('Blog not found');
  return blog;
};

const publishBlog = async (blogId) => {
  const blog = await Blog.findByIdAndUpdate(
    blogId,
    { isPublished: true, publishedAt: new Date() },
    { new: true }
  );
  if (!blog) throw new Error('Blog not found');
  return blog;
};

export default { getAllBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog, publishBlog };
