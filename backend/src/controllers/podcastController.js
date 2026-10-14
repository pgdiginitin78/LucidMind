import { asyncHandler } from '../utils/http.js';
import * as podcasts from '../services/podcastService.js';
import { extractOrderedIds, validateTitleRequired } from '../validators/content.js';

export const list = asyncHandler(async (req, res) => {
  res.json({ podcasts: await podcasts.listPodcasts() });
});

export const get = asyncHandler(async (req, res) => {
  res.json({ podcast: await podcasts.getPodcast(req.params.id) });
});

export const create = asyncHandler(async (req, res) => {
  const body = req.body ?? {};
  validateTitleRequired(body);
  res.status(201).json({ message: 'Podcast created', podcast: await podcasts.createPodcast(body) });
});

export const update = asyncHandler(async (req, res) => {
  res.json({ message: 'Podcast updated', podcast: await podcasts.updatePodcast(req.params.id, req.body ?? {}) });
});

export const remove = asyncHandler(async (req, res) => {
  await podcasts.deletePodcast(req.params.id);
  res.json({ message: 'Podcast deleted' });
});

export const publish = asyncHandler(async (req, res) => {
  const podcast = await podcasts.setPodcastPublished(req.params.id, req.body?.isPublished ?? 0);
  res.json({ message: 'Podcast publish status updated', podcast });
});

export const reorder = asyncHandler(async (req, res) => {
  const ids = extractOrderedIds(req.body, 'podcasts');
  res.json({ podcasts: await podcasts.reorderPodcasts(ids) });
});
