import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
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
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      default: 'Phase 1: Getting Started',
    },
    realProblem: {
      type: String,
    },
    description: {
      type: String,
    },
    features: {
      type: [String],
      default: [],
    },
    successLooksLike: {
      type: String,
    },
    icon: {
      type: String,
      default: 'Rocket',
    },
    image: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
