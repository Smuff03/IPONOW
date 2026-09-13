# Greenshoe — IPO tracking portal

A full-stack IPO information portal: live grey market premium (GMP), subscription
data, price bands, allotment status, articles, and aggregated review sentiment
for mainboard and SME IPOs.

```
ipo-tracker/
├── client/   React + TypeScript + Vite + Tailwind frontend
└── server/   Node.js + Express + Prisma (PostgreSQL) backend
```

The frontend runs standalone against realistic mock data (great for UI work,
demos, and design review) or against the real backend once it's running.

---

## 1. Prerequisites

- Node.js 20+ and npm 10+
- PostgreSQL 14+ (local install, Docker, or a managed instance e.g. Supabase/Neon/RDS)

## 2. Installation

```bash
git clone <this-repo> ipo-tracker
cd ipo-tracker

# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

## 3. Environment variables

Copy the example env file and fill in real values:

```bash
cd server
cp .env.example .env
```

| Variable | Purpose |
|---|---|
| `PORT` | Port the Express API listens on (default `4000`) |
| `CLIENT_URL` | Origin allowed by CORS — your frontend's URL |
| `DATABASE_URL` | Postgres connection string, e.g. `postgresql://user:pass@localhost:5432/ipo_tracker` |
| `JWT_SECRET` | Long random string used to sign admin session tokens |
| `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` | Credentials created by `npm run seed` |
| `ENABLE_CRON` | Set `false` to disable scheduled ingestion (e.g. in a dev shell) |
| `*_CRON_SCHEDULE` | Standard 5-field cron expressions controlling ingestion cadence |
| `RATE_LIMIT_*` | Basic API rate limiting |

The client reads one optional variable at build time — create `client/.env`:

```bash
VITE_API_URL=http://localhost:4000/api
```

(If you leave `client/src/services/ipoApi.ts`'s `USE_LIVE_API` flag set to
`false`, the public pages keep using bundled mock data regardless of this
variable — see step 6.)

## 4. Database setup & Prisma migration

```bash
cd server
npx prisma generate        # generates the typed Prisma Client from prisma/schema.prisma
npx prisma migrate dev --name init   # creates tables in your Postgres database
npm run seed                # creates the admin user + seed allotment links
```

`npx prisma studio` opens a local GUI to browse/edit the database directly.

## 5. Development

Run both apps in separate terminals:

```bash
# Terminal 1 — backend (http://localhost:4000)
cd server
npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd client
npm run dev
```

Vite is pre-configured to proxy `/api/*` requests to `http://localhost:4000`
in dev (see `client/vite.config.ts`), so the client can call relative `/api/...`
paths either way.

## 6. Switching the client from mock data to the live API

By default the client ships with realistic **mock data** (`client/src/data/*`)
so the UI works instantly with zero backend setup. Once your backend and
database are running and seeded:

1. Open `client/src/services/ipoApi.ts`.
2. Set `const USE_LIVE_API = true;`.
3. Restart `npm run dev`.

Every function in that file already has a live-fetch branch shaped exactly
like the mock branch, so no component code changes are required.

The **admin dashboard** (`/admin` route) always talks to the real
`/api/admin/*` endpoints — it has no mock mode, since it manages real data.

## 7. Production build

```bash
# Frontend — outputs static files to client/dist
cd client
npm run build

# Backend — compiles TypeScript to server/dist
cd ../server
npm run build
npm start
```

Serve `client/dist` from any static host (Vercel, Netlify, S3+CloudFront,
Nginx) and point it at your deployed API via `VITE_API_URL` at build time.
For SSR/pre-rendered meta tags (better SEO than the client-side `<Seo>`
component alone provides), consider adding a prerendering step or serving
pre-rendered HTML per route from the Express server before going live.

## 8. Cron jobs

`server/src/jobs/scheduler.ts` registers all scheduled ingestion jobs on
server boot (when `ENABLE_CRON=true`). Default cadence:

| Job | Schedule | What it does |
|---|---|---|
| GMP | every 30 min | Refreshes grey market premium + trend, appends to `GMPHistory` |
| Status | every 30 min | Recomputes `UPCOMING/OPEN/CLOSING_TODAY/CLOSED/LISTED` from dates |
| Subscriptions | every 30 min | Refreshes day-wise subscription figures (only for open IPOs) |
| Upcoming IPOs | hourly | Ingests newly announced/updated IPO listings |
| Articles | hourly | Ingests new articles into `DRAFT` status for editor review |
| Reviews | every 3 hours | Refreshes aggregated sentiment counts |

Every job writes a row to `UpdateLog` (visible in the admin dashboard) so
failures are visible instead of silent. On a source failure, the previous
good value is kept and the record is flagged `isStale: true` rather than
being overwritten with null or fabricated data.

You can also trigger any job on demand from the admin dashboard ("Manual job
triggers" card), which calls `POST /api/admin/trigger/:job`.

## 9. Data source configuration

No third-party data source is hardcoded. `server/src/adapters/mockSourceAdapter.ts`
is the only adapter wired up by default — it returns clearly-labelled
placeholder data (`source: "Mock Data Source"`) so the whole pipeline (API →
cron → admin dashboard) works end-to-end without requiring API keys.

To connect a real provider:

1. Read `server/src/adapters/README.md`.
2. Implement the `SourceAdapter` interface (`server/src/types/ingestion.ts`)
   in a new file under `server/src/adapters/`.
3. Register it in `server/src/adapters/index.ts`.
4. Add a corresponding row to the `DataSource` table (via Prisma Studio or
   the admin API) so it can be toggled on/off without a redeploy.

Only use APIs, or scraping that is explicitly permitted by the target site's
terms of service and `robots.txt`. Respect rate limits.

Similarly, registrar/allotment links are **never hardcoded** in the frontend
— they're served from the `AllotmentSource` table and can be edited via
`POST /api/admin/allotment-sources`, so a registrar changing its URL doesn't
require a code change or redeploy.

## 10. Admin dashboard

Visit `/admin` on the frontend. Sign in with the credentials created by
`npm run seed` (`ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` from `server/.env`).
From there you can:

- Trigger any ingestion job manually and see the resulting log
- Enable/disable configured data sources
- Edit an IPO's GMP inline
- Delete an IPO
- View recent update logs (success/partial/failure, records touched)

The full CRUD surface (add/edit IPO, manage articles, manage allotment
sources) is implemented server-side in `server/src/routes/adminRoutes.ts` —
extend the `Admin.tsx` page with more forms/tables as needed; the API is
already there.

**Never** expose `/api/admin/*` routes without the `requireAuth` +
`requireAdmin` middleware (already applied in `adminRoutes.ts`) — do not
remove that line.

## 11. AdSense setup

1. Get your site approved for Google AdSense.
2. In `client/index.html`, uncomment/add the AdSense loader `<script>` tag
   with your `ca-pub-XXXXXXXXXXXXXXXX` client ID (see the comment already
   left in that file).
3. Replace the placeholder `<div>` inside `client/src/components/AdBanner.tsx`
   with the real `<ins class="adsbygoogle">` unit, keeping the same `slot`
   prop values so existing placements (header, in-feed, sidebar, in-article,
   mobile) keep working without touching page layouts.
4. Never place ads in a way that obscures navigation or content, and don't
   auto-refresh ads faster than AdSense policy allows.

## 12. SEO setup

- `client/src/components/Seo.tsx` sets title/meta/canonical/OG/Twitter tags
  and JSON-LD per route on the client. For stronger SEO, add a prerendering
  step (e.g. `vite-plugin-ssr`, or a small Express route that serves
  pre-rendered HTML per slug) since crawlers that don't execute JS won't see
  client-injected tags.
- `client/public/robots.txt` and `client/public/sitemap.xml` are seeded
  manually. In production, replace the static sitemap with a dynamic route
  (`GET /sitemap.xml` on the Express server, querying published IPO/Article
  slugs) so new pages are included automatically.
- Update `SITE_URL` in `Seo.tsx` to your real production domain before launch.

## 13. Security notes already implemented

- `helmet` + CORS locked to `CLIENT_URL` + `express-rate-limit` on all routes
  (tighter limiter on `/api/auth/login`)
- All admin routes require a valid JWT with `role: ADMIN`
- All admin request bodies are validated with `zod` before touching the DB
- Ingested article HTML is passed through `sanitizeHtml.ts` (swap for
  `sanitize-html`/DOMPurify for production-grade sanitization of untrusted
  rich HTML)
- Database credentials and JWT secret only ever live in `.env` (gitignored)
- Centralized error handler avoids leaking stack traces to API responses

## 14. Known follow-ups before a real production launch

- This sandbox environment could not reach `binaries.prisma.sh`, so
  `prisma generate`/`migrate` were never executed here — run them yourself
  (step 4) and fix any type mismatches `tsc` surfaces once real Prisma types
  are generated (the code was written against the schema by hand and
  believed correct, but hasn't been compiler-verified against the real
  generated client).
- Add automated tests (Vitest/Jest + Supertest) around the ingestion services
  and admin auth before relying on this in production.
- The admin dashboard UI covers the highest-value actions (job triggers,
  source toggles, GMP edit, IPO delete); add the remaining CRUD forms
  (create/edit IPO, manage articles, manage allotment sources) using the
  already-built API endpoints in `adminRoutes.ts`.
- Consider a queue (BullMQ) instead of `node-cron` in-process scheduling once
  you run more than one server instance, to avoid duplicate job runs.

## Disclaimer

GMP, expected listing price and subscription estimates are unofficial market
indicators and should not be considered investment advice.
