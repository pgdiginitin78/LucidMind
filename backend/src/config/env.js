import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, "../..");

// Environment files, highest priority first (dotenv never overrides an already-set value):
//   real process env (Hostinger panel)  >  .env.<NODE_ENV>  >  .env
//   local dev  -> backend/.env.development      Hostinger -> panel variables or backend/.env.production
const envName = process.env.NODE_ENV || "development";
const candidateEnvPaths = [
  path.join(backendRoot, `.env.${envName}`),
  path.join(backendRoot, ".env"),
  path.resolve(backendRoot, "../.env"),
  "/home4/lucidmindco/.env",
  "/home4/lucidmindco/public_html/.env",
  "/home4/lucidmindco/public_html/api/.env",
  "/home/lucidmindco/.env",
  "/home/lucidmindco/public_html/.env",
];
for (const p of candidateEnvPaths) {
  dotenv.config({ path: p, quiet: true });
}

const pick = (...names) => {
  for (const n of names) {
    const v = process.env[n];
    if (v !== undefined && String(v).trim() !== "") return String(v).trim();
  }
  return "";
};

const nodeEnv = pick("NODE_ENV") || "development";
const isProduction = nodeEnv === "production";

const jwtSecret =
  pick("JWT_SECRET") || "lucidmind_hostinger_production_secret_key_2026";

const defaultOrigins = [
  "https://lucidmind.co.in",
  "https://www.lucidmind.co.in",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
];

const extraOrigins = pick("FRONTEND_URL")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

const config = {
  nodeEnv,
  isProduction,
  port: Number(pick("PORT")) || 5000,
  backendRoot,
  allowedOrigins: [...new Set([...defaultOrigins, ...extraOrigins])],

  db: {
    // 100% persistent MySQL. Zero SQLite.
    client: "mysql",
    host: pick("DATABASE_HOST", "DB_HOST") || "localhost",
    port: Number(pick("DATABASE_PORT", "DB_PORT")) || 3306,
    database: pick("DATABASE_NAME", "DB_NAME") || "lucidmin_lucidmindco_usr",
    user: pick("DATABASE_USER", "DB_USER") || "lucidmin_lucidmindco",
    password: pick("DATABASE_PASSWORD", "DB_PASSWORD") || "lucidmindco_usr",
    connectionLimit: Number(pick("DATABASE_POOL_SIZE")) || 10,
  },

  jwt: {
    secret: jwtSecret || "dev-only-insecure-jwt-secret",
    expiresIn: "30d", // matches the PHP backend (30 days)
  },

  // Shared passphrase used by the frontend (CryptoJS) to obfuscate login payloads in transit.
  // It is inherently public (shipped to the browser). The fallback mirrors frontend/lib/crypto.js
  // and the PHP backend so existing builds keep working. Real protection is HTTPS.
  payloadSecret:
    pick("PAYLOAD_SECRET", "NEXT_PUBLIC_PAYLOAD_SECRET") ||
    "lucidmind_payload_secret_key_2026",

  smtp: {
    host: pick("SMTP_HOST") || "smtp.gmail.com",
    port: Number(pick("SMTP_PORT")) || 465,
    encryption: (pick("SMTP_ENCRYPTION") || "ssl").toLowerCase(),
    user: pick("SMTP_USER"),
    password: pick("SMTP_APP_PASSWORD", "SMTP_PASSWORD"),
    receivers: pick("RECEIVER_EMAIL"),
  },

  uploads: {
    dir: path.resolve(backendRoot, pick("UPLOAD_DIR") || "uploads"),
    maxBytes: (Number(pick("MAX_UPLOAD_SIZE_MB")) || 50) * 1024 * 1024,
  },

  serveFrontend: pick("SERVE_FRONTEND").toLowerCase() === "true",
  frontendDist: path.resolve(
    backendRoot,
    pick("FRONTEND_DIST_DIR") || "../frontend/dist",
  ),
  trustProxy: pick("TRUST_PROXY") || "1",
};

export default config;
