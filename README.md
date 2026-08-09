# LinkBio-workers

A lightweight, configurable personal **Bio / Digital Card** platform on **Cloudflare Workers**.

Think of it as a self-hosted Linktree alternative: no traditional servers, KV-backed content, Web Admin, and two first-class deploy paths (GitHub Actions + Cloudflare Dashboard).

## Features

- **Cloudflare Workers** native runtime (edge, global)
- **Cloudflare KV** for profile, links, settings, analytics
- **SSR** public page (Hono + HTML templates — no heavy SPA)
- **Admin console** at `/admin` (session auth, CSRF, form-based UI)
- **GitHub Actions** auto-deploy (`.github/workflows/deploy.yml`) + Dashboard path
- Configurable public **footer** (default / custom / auth-only / off)
- Login **rate limit** (KV) + **POST+CSRF logout**
- Modern SaaS UI (mobile-first, dark/light, accent color)
- Import / export JSON backups
- Designed for **3–5 years** of low-maintenance ownership

## Architecture

```
Browser
  → Cloudflare Worker (Hono router)
    → KV (BIO_KV)
    → HTML SSR / JSON API
```

Admin:

```
Browser → /admin → Auth middleware → KV update
```

## Project structure

```
LinkBio-workers/
├── src/                      # Worker source (committed)
│   ├── index.ts              # Entry (Hono app)
│   ├── types.ts              # Domain types + defaults
│   ├── routes/               # public / admin / api
│   ├── middleware/           # auth + security
│   ├── services/             # KV + session
│   ├── components/           # Public SSR fragments
│   ├── admin/                # Admin UI
│   └── styles/               # app.css (+ generated app.css.ts)
├── scripts/sync-css.mjs      # CSS → TS inliner
├── .github/workflows/        # Deploy CI
├── .gitignore                # Excludes node_modules, dist, secrets
├── .dev.vars.example         # Local secrets template
├── package.json              # Dependency manifest (not node_modules)
├── package-lock.json         # Locked versions for npm ci
├── wrangler.toml
└── README.md
```

### What is NOT in the repo

| Path | Why |
| ---- | --- |
| `node_modules/` | Install with `npm ci` / `npm install` |
| `dist/` | Build output (`npm run build`) |
| `.wrangler/` | Local Wrangler / Miniflare state |
| `.dev.vars` | Local secrets (copy from `.dev.vars.example`) |

## Quick start (local)

### Prerequisites

- Node.js 18+
- npm
- Cloudflare account (for real deploy; local uses miniflare via Wrangler)

### Install & run

```bash
npm install
cp .dev.vars.example .dev.vars
# edit .dev.vars — set ADMIN_PASSWORD and SESSION_SECRET
npm run dev
```

Open:

- Public site: [http://localhost:8787](http://localhost:8787)
- Admin: [http://localhost:8787/admin](http://localhost:8787/admin)

Local KV is simulated by Wrangler; defaults seed profile/links when keys are empty.

### Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Local Worker with hot reload |
| `npm run build` | Bundle dry-run (CI check) |
| `npm run typecheck` | TypeScript `tsc --noEmit` |
| `npm run deploy` | Deploy with Wrangler (needs auth) |

---

## Deployment

Two supported paths. **Real KV namespace IDs are never committed** — `wrangler.toml` only has placeholders (`REPLACE_WITH_YOUR_KV_*`).

### Shared: create KV + runtime secrets

```bash
npx wrangler login
npx wrangler kv namespace create BIO_KV
npx wrangler kv namespace create BIO_KV --preview
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
```

Save the returned namespace IDs for the steps below (do not commit them).

### Mode 1 — GitHub Actions (workflow in-repo)

Workflow file: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

```
push main
  → checkout → npm ci → typecheck
  → inject BIO_KV_ID into wrangler.toml
  → build dry-run → wrangler deploy
```

#### GitHub Secrets (required)

| Name | Purpose |
| ---- | ------- |
| `CF_API_TOKEN` | Cloudflare API token (Workers Edit). Alias: `CLOUDFLARE_API_TOKEN` |
| `CF_ACCOUNT_ID` | Cloudflare account ID. Alias: `CLOUDFLARE_ACCOUNT_ID` |

#### GitHub Variables / Secrets (KV + optional vars)

| Name | Required | Purpose |
| ---- | -------- | ------- |
| `BIO_KV_ID` | **Yes** | Real production KV namespace id (Variable or Secret) |
| `BIO_KV_PREVIEW_ID` | No | Preview KV id (defaults to `BIO_KV_ID`) |
| `SITE_NAME` | No | Overrides Worker var at deploy (also settable in Dashboard) |
| `SITE_URL` | No | Canonical public URL, e.g. `https://linkbio-workers.<account>.workers.dev` |
| `DEFAULT_THEME` | No | Default theme id |

API token permissions (minimum):

- Account → Workers Scripts → Edit
- Account → Account Settings → Read

Then:

```bash
git push origin main
```

Or **Actions → Deploy → Run workflow**.  
`ADMIN_PASSWORD` / `SESSION_SECRET` are **not** set by CI — configure them once on the Worker.

### Mode 2 — Cloudflare Dashboard / Workers Builds

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages**
2. Create or open the Worker; connect this Git repo **or** deploy with Wrangler from your machine
3. **Settings → Bindings → KV** → bind name **`BIO_KV`** to your namespace  
   (Dashboard binding supplies the real id; placeholders in git stay placeholders)
4. **Variables and Secrets** → set `SITE_NAME`, `SITE_URL`, secrets `ADMIN_PASSWORD`, `SESSION_SECRET`
5. Deploy

### Mode 3 — Local Wrangler deploy

Either:

- Temporarily put real ids into local `wrangler.toml` (never commit), or
- Use remote bindings after Dashboard has `BIO_KV` bound

```bash
# After ids are available locally:
npm run deploy
```

### How real KV IDs are obtained (summary)

| Deploy path | Where the real `BIO_KV` id comes from |
| ----------- | ------------------------------------- |
| GitHub Actions | Repo **Variable/Secret** `BIO_KV_ID` injected into `wrangler.toml` before deploy |
| Dashboard / Workers Builds | **Worker binding** `BIO_KV` configured in the UI |
| Local Wrangler | Local `wrangler.toml` (gitignored change) or remote binding |

---

## Environment variables

### Secrets (sensitive)

| Variable | Type | Where | Purpose |
| -------- | ---- | ----- | ------- |
| `ADMIN_PASSWORD` | Secret | Worker Secrets / `.dev.vars` | Admin login password |
| `SESSION_SECRET` | Secret | Worker Secrets / `.dev.vars` | HMAC key for session cookies |
| `CF_API_TOKEN` | Secret | **GitHub only** | Actions → Wrangler deploy |
| `CF_ACCOUNT_ID` | Secret | **GitHub only** | Cloudflare account for Actions |
| `BIO_KV_ID` | Variable or Secret | **GitHub only** | KV namespace id for CI deploy |

**Rules:** never commit secrets; never put secrets or real KV ids in git; never store `ADMIN_PASSWORD` in KV.

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
```

### Variables (non-secret)

| Variable | Purpose | Repo default |
| -------- | ------- | ------------ |
| `SITE_NAME` | Display / title name | `LinkBio` |
| `SITE_URL` | Canonical public URL | `https://YOUR_SUBDOMAIN.workers.dev` (placeholder — set real URL after deploy) |
| `DEFAULT_THEME` | Default theme id | `default` |

Override in Dashboard, `wrangler.toml` `[vars]` (non-secret only), or GitHub Variables.

---

## KV configuration

**Binding name:** `BIO_KV` (must match code + `wrangler.toml`)

### Content keys

| Key | Content |
| --- | ------- |
| `profile` | Name, username, bio, avatar, location, email |
| `links` | Array of link objects |
| `settings` | Theme, footer, accent, background |
| `analytics` | Legacy blob (kept for export/import compatibility) |
| `analytics:pv` | Page-view counter (split key) |
| `analytics:click:<id>` | Per-link click counters |
| `analytics:updated` | Last counter update ISO timestamp |
| `rate:login:<ip>` | Failed login attempts (TTL window) |

### Settings / footer example

```json
{
  "theme": "default",
  "colorMode": "system",
  "locale": "zh-CN",
  "accentColor": "#6366f1",
  "background": "",
  "showFooter": true,
  "footerMode": "default",
  "footerText": ""
}
```

| Field | Values | Notes |
| ----- | ------ | ----- |
| `colorMode` | `system` / `light` / `dark` | Default `system` follows OS via CSS `prefers-color-scheme` (no JS). Legacy `darkMode` migrates on read. |
| `locale` | `zh-CN` / `en` | UI chrome only; profile/links content is not translated. |

| `footerMode` | Behaviour |
| ------------ | --------- |
| `default` | Site name (or `footerText` if set) — no public Admin link |
| `custom` | `footerText` only (empty → site name) |
| `auth_only` | Footer only when admin session is present |
| `off` | Hidden (also when `showFooter` is false) |

Empty content keys fall back to safe defaults.

### Analytics consistency

Counters use **split KV keys** + short read/verify retries so page views and clicks do not overwrite each other.

Cloudflare KV is still **eventually consistent**: under concurrent traffic, counts may slightly under-count. That is acceptable for a personal bio page. For strict accuracy, move counters to a **Durable Object** (not required by this project).

---

## Admin guide

1. Open `/admin` (redirects to `/admin/login` if not signed in)
2. Enter the password from `ADMIN_PASSWORD`
3. Use the dashboard:

| Section | Path | What you can do |
| ------- | ---- | --------------- |
| Overview | `/admin` | Stats + shortcuts |
| Profile | `/admin/profile` | Name, username, bio, avatar, location, email |
| Links | `/admin/links` | Add / delete / reorder / enable-disable |
| Theme | `/admin/theme` | Appearance + **footer** settings |
| Data | `/admin/data` | Export JSON backup / import JSON |

### Security model

- Password checked against `ADMIN_PASSWORD` secret only (not stored in KV)
- Session = HMAC-SHA256 signed cookie (`HttpOnly`, `SameSite=Lax`, `Secure` on HTTPS)
- CSRF double-submit on all state-changing form posts (including **Logout**)
- Logout is **POST + CSRF** only; `GET /admin/logout` does not clear the session
- Login rate limit: **5 failures / 15 minutes / IP** (stored in KV)
- HTML output escaped; CSP headers enabled
- Public API never returns secrets

---

## API (optional)

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| `GET` | `/health` | No | Health check |
| `GET` | `/api/site` | No | Public site JSON (enabled links only) |
| `POST` | `/api/click` | No | Record link click `{ "id": "..." }` |
| `GET` | `/api/admin/export` | Session | Full export |
| `PUT` | `/api/admin/profile` | Session | Update profile JSON |
| `PUT` | `/api/admin/links` | Session | Replace links array |
| `PUT` | `/api/admin/settings` | Session | Update settings |
| `POST` | `/api/admin/import` | Session | Import partial/full JSON |

Admin JSON endpoints use the same session cookie as the HTML admin.

---

## Security checklist

Must:

- [x] HttpOnly session cookie
- [x] Secure cookie on HTTPS
- [x] CSP header
- [x] XSS escaping on SSR
- [x] CSRF on admin forms **and logout**
- [x] Login rate limiting (KV)
- [x] Input sanitization on writes / import
- [x] No real KV ids or secrets in git

Forbidden:

- Frontend exposure of admin password
- Public raw KV access
- Plaintext session storage in KV
- GET-based logout (CSRF risk)

---

## Customization

- **Theme / color / language / footer** — Admin → Theme (`colorMode`, `locale`, `footerMode`, …)
- **i18n** — lightweight `src/i18n` (zh-CN / en), no extra packages
- **Icons** — built-in: `link`, `github`, `globe`, `twitter`, `x`, `linkedin`, `youtube`, `instagram`, `mail`
- **CSS** — `src/styles/app.css` (inlined via `app.css.ts` for SSR)
- **Defaults** — `src/types.ts`

## Tech stack

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Hono](https://hono.dev/)
- TypeScript
- Cloudflare KV
- Wrangler + GitHub Actions

**Avoided on purpose:** heavy SPA frameworks, external databases, unnecessary dependencies — keep the surface area small for long-term maintenance.

## License

MIT
