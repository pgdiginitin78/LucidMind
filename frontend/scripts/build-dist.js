import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../dist');
const uploadsDir = path.join(distDir, 'uploads');

async function buildDist() {
  console.log('Assembling final deployment dist folder...');

  // The API is now the standalone Node/Express app in /backend (deployed separately or serving
  // this dist folder via SERVE_FRONTEND=true), so it is no longer copied into dist/api.
  await fs.mkdir(uploadsDir, { recursive: true });

  console.log('Deployment dist successfully built!');
}

buildDist().catch(console.error);
