import { asyncHandler } from '../utils/http.js';
import * as services from '../services/catalogService.js';
import { extractOrderedIds, validateTitleRequired } from '../validators/content.js';

export const list = asyncHandler(async (req, res) => {
  res.json({ services: await services.listServices() });
});

export const create = asyncHandler(async (req, res) => {
  const body = req.body ?? {};
  validateTitleRequired(body);
  res.status(201).json({ message: 'Service created', service: await services.createService(body) });
});

export const update = asyncHandler(async (req, res) => {
  res.json({ message: 'Service updated', service: await services.updateService(req.params.id, req.body ?? {}) });
});

export const remove = asyncHandler(async (req, res) => {
  await services.deleteService(req.params.id);
  res.json({ message: 'Service deleted' });
});

export const reorder = asyncHandler(async (req, res) => {
  const ids = extractOrderedIds(req.body, 'services');
  res.json({ services: await services.reorderServices(ids) });
});
