import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    tag: {
      type: String,
      default: 'MINDSET',
      trim: true,
    },
    category: {
      type: String,
      default: 'Thought Leadership',
    },
    readTime: {
      type: String,
      default: '3 MIN READ',
    },
    date: {
      type: String,
    },
    author: {
      type: String,
      default: 'Ravishankar Pingali',
    },
    authorRole: {
      type: String,
      default: 'Building Adaptive Enterprises | GCC Leader | Enterprise Reinvention | Board Advisor',
    },
    excerpt: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    tags: [String],
    isPublished: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
