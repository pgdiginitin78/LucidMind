import sharp from "sharp";
import { readdir, unlink } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Only convert PNGs in the aboutUs images folder (the newly added ones)
const targetDirs = [
  path.resolve(__dirname, "../components/sections/aboutUs/images"),
];

async function convertPngsToWebp(dir) {
  const files = await readdir(dir);
  const pngs = files.filter((f) => f.toLowerCase().endsWith(".png"));

  if (pngs.length === 0) {
    console.log(`  No PNGs found in ${dir}`);
    return;
  }

  for (const file of pngs) {
    const inputPath = path.join(dir, file);
    const outputName = file.replace(/\.png$/i, ".webp");
    const outputPath = path.join(dir, outputName);

    process.stdout.write(`  Converting: ${file} → ${outputName} ... `);

    await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);

    const { size: inputSize } = await import("fs").then(
      (fs) =>
        new Promise((res) => fs.stat(inputPath, (_, s) => res(s)))
    );
    const { size: outputSize } = await import("fs").then(
      (fs) =>
        new Promise((res) => fs.stat(outputPath, (_, s) => res(s)))
    );

    const saved = (((inputSize - outputSize) / inputSize) * 100).toFixed(1);
    console.log(
      `done! ${(inputSize / 1024).toFixed(0)}KB → ${(outputSize / 1024).toFixed(0)}KB (${saved}% smaller)`
    );

    // Delete original PNG
    await unlink(inputPath);
    console.log(`  Deleted: ${file}`);
  }
}

console.log("\n🔄 Converting PNG images to WebP...\n");

for (const dir of targetDirs) {
  console.log(`📁 ${dir}`);
  await convertPngsToWebp(dir);
}

console.log("\n✅ All PNGs converted to WebP!\n");
console.log(
  "⚠️  Remember to update import paths in About.jsx (.png → .webp)\n"
);
