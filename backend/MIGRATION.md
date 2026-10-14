# PHP → Node.js/Express migration

Branch: `migrate-node-backend` (roll back with `git checkout main`; PHP sources are untouched).

## 1. Original architecture (audited)

* **Frontend is a Vite + React SPA** (`frontend/`, react-router) – *not* Next.js. Stray `frontend/app/*`
  files (e.g. `app/api/upload/route.js`) are not served by Vite; nothing calls them.
* **Backend**: PHP 8 front controller `backend/index.php` → controllers, PDO/MySQL, hand-rolled HS256 JWT
  (30 days), `password_verify` bcrypt, PHPMailer SMTP, uploads to `public_html/uploads`.
  Deployed on cPanel as `public_html/api/` (`build-for-cpanel.ps1`).
* **Frontend ↔ API**: every call goes through `API_BASE_URL` (`frontend/src/config/api.js`), token in
  `localStorage["lucidmind_token"]`, sent as `Authorization: Bearer`. Login payload is CryptoJS-AES encrypted.
* **No logout endpoint**: logout = client deletes the token (stateless JWT). Kept as is.
* **Schema** (`backend/database/schema.sql`): `users`, `blogs`, `podcasts`, `services`. No FKs.
  `podcasts.media_type` is added lazily by the PHP code; Node keeps that (once per process, idempotent).

## 2. Endpoint inventory

Status legend: **T** = covered by automated test (mocked DB). *Not run against a live MySQL.*

| PHP route | Express route | Auth | Status |
|---|---|---|---|
| `GET /api/health` | `GET /api/health` (+ new `GET /api/health/db`) | – | T |
| `POST /api/auth/login` | same | – (rate limited) | T |
| `GET /api/auth/me` | same | JWT | T |
| `GET /api/blogs` | same | – | T |
| `GET /api/blogs/:idOrSlug` | same | – | T |
| `POST /api/blogs` | same | JWT | T |
| `PUT /api/blogs/reorder` | same | JWT | T |
| `PUT /api/blogs/:id` | same | JWT | T |
| `DELETE /api/blogs/:id` | same | JWT | T |
| `PATCH /api/blogs/:id/publish` | same | JWT | T |
| `GET /api/podcasts` | same | – | T |
| `GET /api/podcasts/:id` | same | – | T |
| `POST /api/podcasts` | same | JWT | T |
| `PUT /api/podcasts/reorder` | same | JWT | T |
| `PUT /api/podcasts/:id` | same | JWT | T |
| `DELETE /api/podcasts/:id` | same | JWT | T |
| `PATCH /api/podcasts/:id/publish` | same | JWT | T |
| `GET /api/services` | same | – | T |
| `POST /api/services` | same | JWT | T |
| `PUT /api/services/reorder` | same | JWT | T |
| `PUT /api/services/:id` | same | JWT | T |
| `DELETE /api/services/:id` | same | JWT | T |
| `POST /api/contact` | same | – (rate limited) | T (mailer mocked) |
| `POST /api/upload` | same | **JWT (was open)** | T |
| static `/uploads/*` (Apache) | Express static `/uploads/*` | – | T |
| `seed-admin.php` | `npm run seed:admin` | CLI | not run |
| `test-db.php`, `test-mail.php`, `database/migrate-json-to-mysql.php` | not migrated (dev utilities) | | – |

## 3. Deliberate behaviour changes (all security/bug fixes)

1. **`POST /api/upload` now requires the admin JWT.** It was unauthenticated (anyone could upload).
   `ImageUploadField.jsx` now sends the token. Also validates MIME vs extension; uploads are served with a sandboxing CSP.
2. **Unchanged-save no longer 404s.** PHP reported "not found or no changes" when `rowCount()==0`; Node uses matched rows, so saving identical data succeeds. Real misses still 404.
3. **DB error text is no longer returned** to clients (PHP echoed `PDOException` messages with 400). Duplicate slug → 400 with a generic message.
4. **JWT `exp` is enforced** (PHP issued it but never checked it); `alg` pinned to HS256.
5. **`seed-admin.php` reset the admin password to a hardcoded value** on every run. The Node seed never overwrites and takes credentials from env. Delete `seed-admin.php` from any server it was uploaded to.
6. Rate limiting on login/contact/API, Helmet headers, CORS allow-list preserved.

## 4. Auth compatibility

* Hashes: PHP `password_hash` (`$2y$`) verified by `bcryptjs` – tested.
* Tokens: same HS256 format/claims (`id`, `username`, `iat`, `exp`). Existing sessions survive if `JWT_SECRET` is identical; otherwise users simply log in again.
* Login payload: CryptoJS AES decrypted server-side (tested with the real `crypto-js`), plaintext fallback kept.

## 5. Database notes

No schema changes, no drops/truncates. All queries are parameterised; reorder uses a transaction with guaranteed
release. Existing tables/data are used as-is. `DATABASE_*` env names are preferred; `DB_*` still work.

## 6. Hostinger deployment

> **Not verified:** I cannot see your Hostinger plan or hPanel. Confirm you have a **Node.js (Web Apps / Business or Cloud)**
> plan — shared "Premium" PHP-only plans do not run Node. Menu names below can differ slightly.

### Recommended: one Node app serving both SPA and `/api` (same domain, no proxy needed)

Hostinger's Node.js app runs a single process behind its own proxy, so the least fragile way to get
`https://lucidmind.co.in/api/*` is to let Express serve the built frontend too (`SERVE_FRONTEND=true`).

1. Push the branch to GitHub; in hPanel → **Websites → Add website → Node.js Apps** → import the GitHub repo
   (or upload a ZIP), select branch.
2. **Node version**: 20 or 22 (`engines >= 20`).
3. **Root directory**: repo root. **Build command**: `npm run install:backend && npm run build`
   (root `build` installs/builds the frontend into `frontend/dist`).
4. **Start command / entry file**: `npm start` / `backend/src/server.js`. Use the `PORT` Hostinger injects — the app already reads `process.env.PORT`.
5. **Environment variables** (hPanel → Environment): everything in `backend/.env.example`, with
   `NODE_ENV=production`, `SERVE_FRONTEND=true`, `FRONTEND_DIST_DIR=../frontend/dist`, a strong `JWT_SECRET`
   (reuse the old one to keep sessions), and `UPLOAD_DIR` pointing at a **persistent** directory outside the
   deployed/rebuilt folder (e.g. `/home/<user>/lucidmind-uploads`) so redeploys don't delete uploads.
6. **Database**: hPanel → Databases → MySQL: use that panel's host (often `localhost` or the host shown there),
   DB name, user, password. Point to the **existing** database; do not run schema scripts against production.
7. Frontend build var: `VITE_API_URL=/api` (already in `frontend/.env.production`; it's gitignored, so set it as a build env var on Hostinger too).
8. Copy existing files from `public_html/uploads` to `UPLOAD_DIR` so old image URLs keep working.
9. Domain: attach `lucidmind.co.in` (+ `www`) to the Node app and enable SSL.
10. Verify: `https://lucidmind.co.in/api/health`, `/api/health/db`, site loads, admin login, create/edit/delete a blog, upload an image, send a contact message.

### Alternative: keep frontend on static hosting, API on Node
Only if you can route `/api/*` to the Node app (reverse proxy / Apache `ProxyPass`/ `.htaccess` on a plan that allows it).
If the plan cannot route paths, you'd need an `api.` subdomain — **not done here; your call**. In that case set
`VITE_API_URL=https://api.lucidmind.co.in/api` and `FRONTEND_URL=https://lucidmind.co.in`.

## 7. Remaining manual steps / limitations

* Verify against the real MySQL (my tests use a DB fake; no MySQL was available locally). Run the smoke list in §6.10 on staging first.
* Set production `JWT_SECRET`, SMTP creds, DB creds in hPanel (never committed).
* Hostinger routing/plan capability must be confirmed by you (see note above).
* PHP files remain for rollback. Once production is verified, remove `backend/{controllers,config,middleware,utils,vendor,database/*.php}`, `index.php`, `router.php`, `.htaccess`, `seed-admin.php`, `test-*.php`, and `build-for-cpanel.ps1`, in a follow-up commit.
* `frontend/package.json` still lists server packages (express, mongoose, …) from earlier scaffolding; unused by the SPA — not touched.
* Pre-existing lint error in `ImageUploadField.jsx` (`React` imported but unused) left as is.
