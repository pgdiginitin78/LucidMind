import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../dist');
const apiDistDir = path.join(distDir, 'api');
const backendDir = path.join(__dirname, '../../backend');
const uploadsDir = path.join(distDir, 'uploads');

async function buildDist() {
  console.log('Assembling final deployment dist folder...');
  
  // Create API and uploads folders
  await fs.mkdir(apiDistDir, { recursive: true });
  await fs.mkdir(uploadsDir, { recursive: true });
  
  // Copy all backend files into dist/api/
  console.log('Copying PHP backend to dist/api...');
  await fs.cp(backendDir, apiDistDir, {
    recursive: true,
    filter: (src) => {
      // Exclude unnecessary files
      const name = path.basename(src);
      if (['node_modules', '.git', 'package-lock.json', 'backend-package.json', 'router.php'].includes(name)) {
        return false;
      }
      return true;
    }
  });

  console.log('Deployment dist successfully built!');
}

buildDist().catch(console.error);
