import mongoose from 'mongoose';

const podcastSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    episode: {
      type: String,
      default: 'Ep. 01',
      trim: true,
    },
    src: {
      type: String,
      required: true,
      trim: true,
    },
    audioUrl: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      default: '15 mins',
    },
    host: {
      type: String,
      default: 'Ravishankar Pingali',
    },
    guest: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    tags: [String],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Podcast = mongoose.model('Podcast', podcastSchema);
export default Podcast;
