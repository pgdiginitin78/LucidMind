import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Podcast from '../models/Podcast.model.js';

const DB_FILE = path.join(process.cwd(), 'backend', 'data', 'db.json');

const getLocalPodcasts = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      return data.podcasts || [];
    }
  } catch {
    return [];
  }
  return [];
};

const saveLocalPodcasts = (podcasts) => {
  try {
    let data = {};
    if (fs.existsSync(DB_FILE)) {
      data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
    data.podcasts = podcasts;
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local podcasts:', err.message);
  }
};

const getAllPodcasts = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const podcasts = await Podcast.find().sort({ createdAt: -1 });
      return res.status(200).json({ podcasts });
    }
    const podcasts = getLocalPodcasts();
    return res.status(200).json({ podcasts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPodcastById = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const podcast = await Podcast.findById(id);
      if (!podcast) return res.status(404).json({ message: 'Podcast not found' });
      return res.status(200).json({ podcast });
    }
    const podcasts = getLocalPodcasts();
    const podcast = podcasts.find((p) => p._id === id || p.id === id);
    if (!podcast) return res.status(404).json({ message: 'Podcast not found' });
    return res.status(200).json({ podcast });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createPodcast = async (req, res) => {
  try {
    const {
      title,
      episode,
      src,
      audioUrl,
      thumbnail,
      coverImage,
      duration,
      host,
      guest,
      description,
      isPublished,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const slug =
      req.body.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const finalSrc = src || audioUrl || '';

    if (mongoose.connection.readyState === 1) {
      const podcast = await Podcast.create({
        title,
        slug,
        episode: episode || 'Ep. 01',
        src: finalSrc,
        audioUrl: finalSrc,
        thumbnail: thumbnail || coverImage || '',
        coverImage: coverImage || thumbnail || '',
        duration: duration || '15 mins',
        host: host || 'Ravishankar Pingali',
        guest: guest || '',
        description: description || '',
        isPublished: isPublished !== undefined ? isPublished : true,
      });
      return res.status(201).json({ message: 'Podcast created', podcast });
    }

    const podcasts = getLocalPodcasts();
    const newPodcast = {
      _id: 'pod_' + Date.now(),
      title,
      slug,
      episode: episode || `Ep. 0${podcasts.length + 1}`,
      src: finalSrc,
      audioUrl: finalSrc,
      thumbnail: thumbnail || coverImage || '',
      coverImage: coverImage || thumbnail || '',
      duration: duration || '15 mins',
      host: host || 'Ravishankar Pingali',
      guest: guest || '',
      description: description || '',
      isPublished: isPublished !== undefined ? isPublished : true,
      createdAt: new Date().toISOString(),
    };
    podcasts.unshift(newPodcast);
    saveLocalPodcasts(podcasts);
    return res.status(201).json({ message: 'Podcast created', podcast: newPodcast });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updatePodcast = async (req, res) => {
  try {
    const { id } = req.params;
    const body = { ...req.body };

    if (body.src && !body.audioUrl) body.audioUrl = body.src;
    if (body.audioUrl && !body.src) body.src = body.audioUrl;
    if (body.thumbnail && !body.coverImage) body.coverImage = body.thumbnail;
    if (body.coverImage && !body.thumbnail) body.thumbnail = body.coverImage;

    if (mongoose.connection.readyState === 1) {
      const podcast = await Podcast.findByIdAndUpdate(id, body, { new: true, runValidators: true });
      if (!podcast) return res.status(404).json({ message: 'Podcast not found' });
      return res.status(200).json({ message: 'Podcast updated', podcast });
    }

    const podcasts = getLocalPodcasts();
    const idx = podcasts.findIndex((p) => p._id === id || p.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Podcast not found' });

    podcasts[idx] = {
      ...podcasts[idx],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    saveLocalPodcasts(podcasts);
    return res.status(200).json({ message: 'Podcast updated', podcast: podcasts[idx] });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deletePodcast = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const podcast = await Podcast.findByIdAndDelete(id);
      if (!podcast) return res.status(404).json({ message: 'Podcast not found' });
      return res.status(200).json({ message: 'Podcast deleted' });
    }

    let podcasts = getLocalPodcasts();
    const exists = podcasts.some((p) => p._id === id || p.id === id);
    if (!exists) return res.status(404).json({ message: 'Podcast not found' });

    podcasts = podcasts.filter((p) => p._id !== id && p.id !== id);
    saveLocalPodcasts(podcasts);
    return res.status(200).json({ message: 'Podcast deleted' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export default { getAllPodcasts, getPodcastById, createPodcast, updatePodcast, deletePodcast };
