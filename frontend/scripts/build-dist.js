import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, "../dist");
const rootDistDir = path.resolve(__dirname, "../../dist");
const uploadsDir = path.join(distDir, "uploads");

async function buildDist() {
  console.log("Assembling final deployment dist folder...");

  await fs.mkdir(uploadsDir, { recursive: true });
  try {
    await fs.rm(rootDistDir, { recursive: true, force: true });
    await fs.cp(distDir, rootDistDir, { recursive: true });
  } catch (err) {
    console.error("Warning: could not sync to root dist:", err.message);
  }

  console.log("Deployment dist successfully built!");
}

buildDist().catch(console.error);
