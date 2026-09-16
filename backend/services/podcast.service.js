import Podcast from '../models/Podcast.model.js';

const getAllPodcasts = async (onlyPublished = true) => {
  const filter = onlyPublished ? { isPublished: true } : {};
  return Podcast.find(filter).populate('host', 'name email').sort({ episodeNumber: -1 });
};

const getPodcastById = async (podcastId) => {
  const podcast = await Podcast.findById(podcastId).populate('host', 'name email');
  if (!podcast) throw new Error('Podcast not found');
  return podcast;
};

const createPodcast = async (podcastData, hostId) => {
  return Podcast.create({ ...podcastData, host: hostId });
};

const updatePodcast = async (podcastId, updateData) => {
  const podcast = await Podcast.findByIdAndUpdate(podcastId, updateData, { new: true });
  if (!podcast) throw new Error('Podcast not found');
  return podcast;
};

const deletePodcast = async (podcastId) => {
  const podcast = await Podcast.findByIdAndDelete(podcastId);
  if (!podcast) throw new Error('Podcast not found');
  return podcast;
};

const publishPodcast = async (podcastId) => {
  const podcast = await Podcast.findByIdAndUpdate(podcastId, { isPublished: true }, { new: true });
  if (!podcast) throw new Error('Podcast not found');
  return podcast;
};

export default { getAllPodcasts, getPodcastById, createPodcast, updatePodcast, deletePodcast, publishPodcast };
