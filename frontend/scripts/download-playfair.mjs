/**
 * download-playfair.mjs
 * Downloads Playfair Display WOFF2 fonts from Google Fonts for local hosting.
 */

import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { get } from 'https';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '../public/fonts/playfair');

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const CSS_URL = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function fetchText(url, headers = {}) {
  return new Promise((resolve, reject) => {
    get(url, { headers: { 'User-Agent': UA, ...headers } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchText(res.headers.location, headers).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    get(url, { headers: { 'User-Agent': UA } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    }).on('error', reject);
  });
}

console.log('Fetching Google Fonts CSS...');
const css = await fetchText(CSS_URL);

const woff2Matches = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g)];
const woff2Urls = [...new Set(woff2Matches.map(m => m[1]))];

console.log(`Found ${woff2Urls.length} WOFF2 URL(s):`);
woff2Urls.forEach(u => console.log(' ', u));

if (woff2Urls.length === 0) {
  console.error('No WOFF2 URLs found. Dumping CSS snippet:');
  console.log(css.substring(0, 500));
  process.exit(1);
}

// Download each WOFF2 file
const weightMap = { '600': 'SemiBold', '700': 'Bold', '400': 'Regular' };

for (const url of woff2Urls) {
  // Try to detect weight from CSS context
  const idx = css.indexOf(url);
  const ctxBefore = css.substring(Math.max(0, idx - 200), idx);
  let weight = 'Regular';
  for (const [wt, name] of Object.entries(weightMap)) {
    if (ctxBefore.includes(`font-weight: ${wt}`)) {
      weight = name;
      break;
    }
  }
  
  const filename = `PlayfairDisplay-${weight}.woff2`;
  const dest = join(outDir, filename);
  
  if (existsSync(dest)) {
    console.log(`✓ Already exists: ${filename}`);
    continue;
  }

  console.log(`Downloading ${filename}...`);
  await downloadFile(url, dest);
  const { statSync } = await import('fs');
  console.log(`✅ ${filename} (${(statSync(dest).size / 1024).toFixed(1)} KB)`);
}
console.log('\nDone! Playfair Display fonts saved to /public/fonts/playfair/');
