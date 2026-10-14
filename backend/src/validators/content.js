import { HttpError } from '../utils/http.js';
import { empty } from '../utils/php.js';

/** Replicates PHP: title is required for create. */
export function validateTitleRequired(body) {
  if (empty(body?.title)) throw new HttpError(400, 'Title is required');
}

/** Accepts `orderedIds` or an array of objects under `key` (blogs/podcasts/services). */
export function extractOrderedIds(body, key) {
  let ids = body?.orderedIds;
  if (empty(ids) && Array.isArray(body?.[key])) {
    ids = body[key].map((item) => item?._id ?? item?.id);
  }
  if (!Array.isArray(ids)) throw new HttpError(400, 'orderedIds array is required');
  return ids;
}
