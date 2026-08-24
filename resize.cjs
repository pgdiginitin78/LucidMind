const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const projectRoot = 'd:\\Nitin\\projects\\lucidmind';
const filesToResize = [
  { path: 'src/assets/podcastThumbnails/Capacity vs Capability.webp', w: 730, h: 411 },
  { path: 'src/assets/logo/Lucid-mind-logos.webp', w: 160, h: 160 },
  { path: 'src/assets/logo/Lucid-mind-logos1.webp', w: 188, h: 75 },
  { path: 'src/assets/articles/The Mindset Shift.webp', w: 730, h: 411 },
  { path: 'src/assets/articles/Mentorship in the Age of AI.webp', w: 730, h: 411 },
  { path: 'src/assets/articles/Three Programming Revolutions.webp', w: 730, h: 411 },
  { path: 'src/assets/articles/My Lens For Evaluating Any Emerging Technology.webp', w: 730, h: 411 }
];

async function resizeFiles() {
  for (const file of filesToResize) {
    const fullPath = path.join(projectRoot, file.path);
    if (!fs.existsSync(fullPath)) {
      console.log(`Skipping (not found): ${fullPath}`);
      continue;
    }
    
    try {
      const minPath = fullPath.replace('.webp', '.min.webp');
      await sharp(fullPath)
        .resize(file.w, file.h, { fit: 'cover' })
        .webp({ quality: 85 })
        .toFile(minPath);
      
      console.log(`Successfully resized: ${file.path} to ${minPath}`);
    } catch (err) {
      console.error(`Error resizing ${file.path}:`, err);
    }
  }
}

resizeFiles();
