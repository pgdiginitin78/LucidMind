import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import multer from "multer";
import config from "../config/env.js";
import db from "../config/database.js";
import logger from "../utils/logger.js";
import { HttpError } from "../utils/http.js";

const MIME_BY_EXT = {
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  png: ["image/png"],
  svg: ["image/svg+xml"],
  webp: ["image/webp"],
  gif: ["image/gif"],
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    fs.mkdir(config.uploads.dir, { recursive: true }, (err) => {
      if (!err) return cb(null, config.uploads.dir);
      const fallbackDir = path.join(os.tmpdir(), "lucidmind-uploads");
      fs.mkdir(fallbackDir, { recursive: true }, (tmpErr) =>
        cb(tmpErr, fallbackDir),
      );
    });
  },
  filename(req, file, cb) {
    const clean = path
      .basename(file.originalname)
      .replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${Date.now()}-${clean}`);
  },
});

export const uploadSingle = multer({
  storage,
  limits: { fileSize: config.uploads.maxBytes, files: 1 },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).slice(1).toLowerCase();
    const allowed = MIME_BY_EXT[ext];
    if (!allowed || !allowed.includes(file.mimetype)) {
      return cb(
        new HttpError(400, "Unsupported file format", {
          error:
            "Unsupported file format. Only JPG, PNG, SVG, WEBP, and GIF are allowed.",
        }),
      );
    }
    return cb(null, true);
  },
}).single("file");

let uploadTableEnsured = false;

async function ensureUploadedFilesTable() {
  if (uploadTableEnsured) return;
  await db.query(
    `CREATE TABLE IF NOT EXISTS uploaded_files (
      filename VARCHAR(255) PRIMARY KEY,
      mime_type VARCHAR(120) NOT NULL,
      data LONGBLOB NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
  );
  uploadTableEnsured = true;
}

export function resetUploadTableCache() {
  uploadTableEnsured = false;
  
}

const canUseDbPersistence = () =>
  config.nodeEnv !== "test" || Boolean(db._isMock);

export async function findUploadedFileInDb(filename) {
  if (!canUseDbPersistence()) return null;
  try {
    await ensureUploadedFilesTable();
    const rows = await db.query(
      "SELECT mime_type, data FROM uploaded_files WHERE filename = ? LIMIT 1",
      [filename],
    );
    const row = rows?.[0];
    if (!row || !row.data) return null;
    return {
      mimeType: row.mime_type || "application/octet-stream",
      data: Buffer.isBuffer(row.data) ? row.data : Buffer.from(row.data),
    };
  } catch (err) {
    logger.warn("Uploaded file DB lookup failed:", err.message);
    return null;
  }
}

export async function describeUpload(file) {
  if (!file)
    throw new HttpError(400, "No file provided", { error: "No file provided" });
  if (config.nodeEnv !== "test") {
    try {
      const publicUploads = path.resolve(
        config.backendRoot,
        "../frontend/public/uploads",
      );
      fs.mkdirSync(publicUploads, { recursive: true });
      fs.copyFileSync(file.path, path.join(publicUploads, file.filename));
    } catch {
      // Non-fatal on read-only serverless filesystems
    }
  }

  if (canUseDbPersistence()) {
    try {
      const buffer = fs.readFileSync(file.path);
      await ensureUploadedFilesTable();
      await db.query(
        "INSERT INTO uploaded_files (filename, mime_type, data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE mime_type = VALUES(mime_type), data = VALUES(data)",
        [file.filename, file.mimetype || "application/octet-stream", buffer],
      );
    } catch (err) {
      logger.warn("Uploaded file DB persistence failed:", err.message);
    }
  }

  return {
    success: true,
    url: `/uploads/${file.filename}`,
    filename: file.filename,
  };
}
