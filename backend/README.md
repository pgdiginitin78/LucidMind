# LucidMind API (Node.js + Express + MySQL)

Replaces the legacy PHP API. Same URLs (`/api/...`), same JSON shapes, same MySQL tables, same
JWT/bcrypt auth, so the existing React (Vite) frontend keeps working.

> The PHP sources (`controllers/`, `index.php`, …) are intentionally still in this folder as a
> rollback path until the Node API is verified in production. See [MIGRATION.md](./MIGRATION.md).

## Structure

```
backend/
├── src/
│   ├── config/        env.js (env loading), database.js (mysql2 pool, transactions)
│   ├── controllers/   thin HTTP layer
│   ├── services/      business logic + SQL (parameterised)
│   ├── routes/        Express routers
│   ├── middleware/    auth (JWT), rate limits, error handler
│   ├── validators/    request validation
│   ├── utils/         logger, PHP-compat helpers, CryptoJS decrypt
│   ├── app.js         app factory (helmet, CORS, routes, optional SPA hosting)
│   └── server.js      entry point (graceful shutdown)
├── scripts/seed-admin.js
├── tests/             node:test + supertest
├── .env.example
└── package.json
```

## Local development

```bash
cd backend
cp .env.example .env        # fill DATABASE_* , JWT_SECRET, SMTP_*
npm install
npm run dev                 # http://localhost:5000/api/health

# frontend (separate terminal) – uses VITE_API_URL=http://localhost:5000/api
cd ../frontend && npm run dev:frontend
```

From the repo root: `npm run dev:api`, `npm run dev`, `npm run test:backend`.

Create the first admin (never overwrites an existing user):
`ADMIN_USERNAME=admin ADMIN_PASSWORD='…' npm run seed:admin`

## Tests

`npm test` (uses a scripted DB fake; **does not touch any real database**).

## Environment variables

| Variable | Notes |
|---|---|
| `NODE_ENV`, `PORT`, `FRONTEND_URL` | `FRONTEND_URL` is added to the CORS allow-list (comma-separated allowed) |
| `DATABASE_HOST/PORT/NAME/USER/PASSWORD` | legacy `DB_*` names also accepted |
| `JWT_SECRET` | **required in production**; must equal the old PHP value to keep existing sessions valid |
| `PAYLOAD_SECRET` | optional; must match `NEXT_PUBLIC_PAYLOAD_SECRET` used when building the frontend |
| `SMTP_HOST/PORT/ENCRYPTION/USER/SMTP_APP_PASSWORD`, `RECEIVER_EMAIL` | contact form mail |
| `UPLOAD_DIR` | persistent writable directory (default `backend/uploads`) |
| `SERVE_FRONTEND`, `FRONTEND_DIST_DIR` | serve built SPA from this Node app |
| `TRUST_PROXY` | proxy hops for rate-limit client IPs (default 1) |
