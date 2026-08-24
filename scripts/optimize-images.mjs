/**
 * optimize-images.mjs
 * Converts PNG/JPG assets to WebP format using sharp.
 * Run: node scripts/optimize-images.mjs
 */

import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

const tasks = [
  // Section backgrounds — very large, huge savings with WebP
  {
    input: join(projectRoot, 'src/assets/articles_section_bg.png'),
    output: join(projectRoot, 'src/assets/articles_section_bg.webp'),
    options: { width: 1400, quality: 82 }
  },
  {
    input: join(projectRoot, 'src/assets/podcasts_section_bg.png'),
    output: join(projectRoot, 'src/assets/podcasts_section_bg.webp'),
    options: { width: 1400, quality: 82 }
  },
  // Article card images — displayed at ~350-600px wide
  {
    input: join(projectRoot, 'src/assets/articles/Building Teams.png'),
    output: join(projectRoot, 'src/assets/articles/Building Teams.webp'),
    options: { width: 700, quality: 85 }
  },
  {
    input: join(projectRoot, 'src/assets/articles/Evolution of Software Engineering in the AI Era.png'),
    output: join(projectRoot, 'src/assets/articles/Evolution of Software Engineering in the AI Era.webp'),
    options: { width: 700, quality: 85 }
  },
  {
    input: join(projectRoot, 'src/assets/articles/HYPERAUTOMATION UNLEASHED.png'),
    output: join(projectRoot, 'src/assets/articles/HYPERAUTOMATION UNLEASHED.webp'),
    options: { width: 700, quality: 82 }
  },
  {
    input: join(projectRoot, 'src/assets/articles/How to Build Effective AI Agents.png'),
    output: join(projectRoot, 'src/assets/articles/How to Build Effective AI Agents.webp'),
    options: { width: 700, quality: 85 }
  },
  {
    input: join(projectRoot, 'src/assets/articles/Mentorship in the Age of AI.png'),
    output: join(projectRoot, 'src/assets/articles/Mentorship in the Age of AI.webp'),
    options: { width: 700, quality: 82 }
  },
  {
    input: join(projectRoot, 'src/assets/articles/My Lens For Evaluating Any Emerging Technology.png'),
    output: join(projectRoot, 'src/assets/articles/My Lens For Evaluating Any Emerging Technology.webp'),
    options: { width: 700, quality: 82 }
  },
  {
    input: join(projectRoot, 'src/assets/articles/The Mindset Shift.png'),
    output: join(projectRoot, 'src/assets/articles/The Mindset Shift.webp'),
    options: { width: 700, quality: 82 }
  },
  {
    input: join(projectRoot, 'src/assets/articles/The Next Evolution in AI.png'),
    output: join(projectRoot, 'src/assets/articles/The Next Evolution in AI.webp'),
    options: { width: 700, quality: 85 }
  },
  {
    input: join(projectRoot, 'src/assets/articles/Three Programming Revolutions.png'),
    output: join(projectRoot, 'src/assets/articles/Three Programming Revolutions.webp'),
    options: { width: 700, quality: 82 }
  },
  {
    input: join(projectRoot, 'src/assets/articles/The Triad of Transformation.jpg'),
    output: join(projectRoot, 'src/assets/articles/The Triad of Transformation.webp'),
    options: { width: 700, quality: 85 }
  },
];

let successCount = 0;
let errorCount = 0;

for (const task of tasks) {
  if (!existsSync(task.input)) {
    console.warn(`⚠️  Skipping (not found): ${task.input}`);
    continue;
  }

  try {
    const img = sharp(task.input);
    const { width: origWidth } = await img.metadata();

    let pipeline = img;
    if (task.options.width && origWidth > task.options.width) {
      pipeline = pipeline.resize({ width: task.options.width, withoutEnlargement: true });
    }

    await pipeline.webp({ quality: task.options.quality || 85 }).toFile(task.output);

    const inputSize = (await import('fs')).statSync(task.input).size;
    const outputSize = (await import('fs')).statSync(task.output).size;
    const savings = (((inputSize - outputSize) / inputSize) * 100).toFixed(1);

    console.log(`✅ ${basename(task.input)}`);
    console.log(`   ${(inputSize / 1024).toFixed(0)} KB → ${(outputSize / 1024).toFixed(0)} KB  (${savings}% smaller)`);
    successCount++;
  } catch (err) {
    console.error(`❌ Failed: ${basename(task.input)} — ${err.message}`);
    errorCount++;
  }
}

console.log(`\n─────────────────────────────`);
console.log(`Done: ${successCount} converted, ${errorCount} failed`);
