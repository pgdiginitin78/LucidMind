/**
 * Helpers replicating the PHP semantics the original controllers relied on
 * (isset / empty / (int) casts / slugify), so request behaviour stays identical.
 */

/** PHP isset(): defined and not null. */
export const isset = (v) => v !== undefined && v !== null;

/** PHP empty(): "", "0", 0, null, false, undefined, [] */
export const empty = (v) =>
  v === undefined ||
  v === null ||
  v === false ||
  v === 0 ||
  v === '' ||
  v === '0' ||
  (Array.isArray(v) && v.length === 0);

/** PHP (int) cast. */
export const toInt = (v) => {
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (typeof v === 'number') return Math.trunc(v) || 0;
  if (typeof v === 'string') return parseInt(v, 10) || 0;
  return v ? 1 : 0;
};

/** PHP `$a ?? $b` */
export const coalesce = (...vals) => {
  for (const v of vals) if (isset(v)) return v;
  return undefined;
};

export const slugify = (text) =>
  String(text ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Parse a JSON column that may already be parsed by the driver. */
export const parseJsonArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

/** PHP uniqid(prefix): 13 hex chars derived from time. */
export const uniqueId = (prefix) => {
  const ms = Date.now();
  const sec = Math.floor(ms / 1000).toString(16).padStart(8, '0');
  const usec = ((ms % 1000) * 1000 + Math.floor(Math.random() * 1000)).toString(16).padStart(5, '0');
  return `${prefix}${sec}${usec}`;
};
