/**
 * LucidMind XML Sitemap Generator
 * Generates an up-to-date sitemap.xml for https://lucidmind.co.in/
 * Can be run manually with: node frontend/scripts/generate-sitemap.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://lucidmind.co.in';

// Real, public, indexable canonical routes
const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/advisory', priority: '0.9', changefreq: 'weekly' },
  { path: '/insights', priority: '0.9', changefreq: 'weekly' },
  { path: '/podcasts', priority: '0.8', changefreq: 'weekly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
];

export function generateSitemapXml() {
  const today = new Date().toISOString().split('T')[0];

  const xmlEntries = STATIC_ROUTES.map((route) => {
    const loc = `${BASE_URL}${route.path === '/' ? '/' : route.path}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${xmlEntries}
</urlset>
`;
}

export function writeSitemap() {
  const sitemapXml = generateSitemapXml();
  const publicPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(publicPath, sitemapXml, 'utf-8');
  console.log(`[Sitemap] Successfully wrote sitemap to ${publicPath}`);
}

// Run directly if invoked from command line
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeSitemap();
}
