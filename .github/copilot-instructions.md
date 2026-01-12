# Copilot / AI Agent Instructions for StreamBox

Quick, actionable guidance to help AI coding agents be productive in this repository.

## Big picture (what to know fast) ✅
- Backend-only Node.js app (Express) focused on media streaming and engagement features. Entry: `app.js`.
- Database: PostgreSQL via Knex and Objection. Migrations live in `migrations/` and DB config in `knexfile.js`.
- Media: HTTP range-based streaming (video controller) and RTMP ingestion using `node-media-server` (`src/config/rtmp.js`). RTMP lifecycle updates `livestreams`, `livestream_events`, and `audit_logs`.
- Real-time: Socket.IO (`app.js`) and socket handlers in `src/sockets/` (auth + livestream messaging).
- Uploads: Multer stores files to `uploads/videos` and static files are served at `/uploads`.

## How to run & debug (developer workflows) 🔧
- Start app locally: `npm run dev` (uses `nodemon app.js`).
- DB: expects Postgres env vars (see `knexfile.js` - DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT). Use `npx knex migrate:latest --knexfile knexfile.js` to apply migrations.
- RTMP: node-media-server starts via `src/config/rtmp.js` when app boots (port 1935). To test RTMP, publish with ffmpeg or OBS to `rtmp://<host>:1935/live/<stream_key>`.
- Socket.io: connect with handshake auth token (client must set `handshake.auth.token`) — token verified with `process.env.JWT_SECRET`.
- No test suite is present (package.json's `test` is placeholder). Add tests and scripts when adding features.

## Project-specific conventions & patterns 🧭
- Two DB interaction styles appear: direct Knex queries (`src/services/*`, `src/config/rtmp.js`) and Objection models (`src/models/`). Be consistent when adding code to an existing area (follow the pattern already in use in that folder).
- Audit trail & events: Prefer appending records to `audit_logs` and `livestream_events` for stream lifecycle changes — `src/config/rtmp.js` is the canonical example.
- Upload file handling: `src/config/multer.js` enforces video MIME types and saves to `uploads/videos`. Controllers expect `upload.single('video')` (see `src/routes/video.routes.js`).
- Authentication: JWT via `src/middlewares/auth.middleware.js` and `src/sockets/auth.sockets.js`. There is a default fallback secret `supersecret` in code — update env var instead of changing code.

## Known gotchas & careful checks ⚠️
- Mixed module systems: Project `package.json` sets `type: "module"` (ESM) but some files use CommonJS (`require/module.exports`). When editing, ensure module syntax matches the file's style or convert consistently.
- Inconsistent table names and typos: code uses both `livestream` and `livestreams` in different places and has typos like `onwerId` vs `ownerId`. Double-check table names against migrations in `migrations/` before changing queries.
- Several files contain syntax or logical bugs (examples discovered while auditing):
  - `src/services/stream/core.service.js` has malformed exports/braces and likely incorrect table name usage.
  - `src/models/users.js` references `bcrypt` usage but lacks an import.
  - `src/sockets/livestream.sockets.js` uses `'livestream_${livestreamId}'` (single quotes) instead of a template string (backticks).
  When making changes, run the dev server and smoke-test affected endpoints.
- Security: JWT secret default and lax error handling appear in several places. Don't rely on fallback secrets in production.

## Where to look for relevant code examples 📂
- Entry / wiring: `app.js` (mounts routes, Socket.IO, starts RTMP server)
- RTMP lifecycle & DB writes: `src/config/rtmp.js`
- Uploads: `src/config/multer.js` and `src/routes/video.routes.js`
- Auth: `src/middlewares/auth.middleware.js` and `src/sockets/auth.sockets.js`
- Models: `src/models/` (includes `basemodel.js`, `users.js`, etc.) — follow established JSON schema patterns in models when adding new ones
- Services: `src/services/` for business logic; example: streaming services in `src/services/stream/`

## PR checklist for AI-generated code ✅
- Match the module style of the file you edit (ESM vs CommonJS).
- Run `npm run dev` and verify the server boots; test any modified endpoint manually (Postman or browser for static files).
- Update or add migrations when changing DB schema and run `npx knex migrate:latest --knexfile knexfile.js`.
- Add unit/integration tests when modifying behavior; if adding tests, add a `test` script to `package.json`.
- Fix any template string / string interpolation bugs and run a syntax check (node will log syntax errors on boot).
- Preserve or extend audit/event writes for user-visible lifecycle changes (follow `audit_logs` and `livestream_events` usage).

## Examples (copyable patterns) 📝
- RTMP validation (see `src/config/rtmp.js`): validate stream key and call `session.reject()` to deny publishing, then write `livestream_events` and `audit_logs`.
- Auth middleware (see `src/middlewares/auth.middleware.js`): expects header `Authorization: Bearer <token>`; sets `req.user` to decoded token.
- File uploads (see `src/config/multer.js`): use `upload.single('video')` on the route that accepts a file upload.

---
If anything is unclear or you'd like more detail in a specific section (DB, RTMP, sockets, or tests), tell me which area to expand and I’ll update this file. ✨
