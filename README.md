# LinkBio-workers

A lightweight, configurable personal **Bio / Digital Card** platform on **Cloudflare Workers**.

Think of it as a self-hosted Linktree alternative: no traditional servers, KV-backed content, Web Admin, and two first-class deploy paths (GitHub Actions + Cloudflare Dashboard).

## Features

- **Cloudflare Workers** native runtime (edge, global)
- **Cloudflare KV** for profile, links, settings, analytics
- **SSR** public page (Hono + HTML templates — no heavy SPA)
- **Admin console** at `/admin` (session auth, CSRF, form-based UI)
- **GitHub Actions** auto-deploy with Wrangler
- **Cloudflare Dashboard** manual deploy (upload / connect repo)
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
├── src/
│   ├── index.ts              # Worker entry (Hono app)
│   ├── types.ts              # Domain types + defaults
│   ├── routes/
│   │   ├── public.ts         # Public bio page, health
│   │   ├── admin.ts          # Admin pages + form posts
│   │   └── api.ts            # JSON API + click beacon
│   ├── middleware/
│   │   ├── auth.ts           # Session gate
│   │   └── security.ts       # CSP, CSRF, HTML escape
│   ├── services/
│   │   ├── kv.ts             # BIO_KV typed store
│   │   └── session.ts        # HMAC signed cookies
│   ├── components/           # Public SSR fragments
│   ├── admin/                # Admin dashboard + forms
│   └── styles/
├── .github/workflows/deploy.yml
├── wrangler.toml
├── package.json
└── README.md
```

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

The project supports **two** deployment modes.

### Mode 1 — GitHub Actions (recommended for developers)

Flow:

```
GitHub Repository
  → GitHub Actions (.github/workflows/deploy.yml)
    → npm ci → typecheck → build
      → wrangler deploy
        → Cloudflare Workers
```

#### 1) Create a KV namespace

```bash
npx wrangler login
npx wrangler kv namespace create BIO_KV
npx wrangler kv namespace create BIO_KV --preview
```

Copy the returned IDs into `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "BIO_KV"
id = "<your-namespace-id>"
preview_id = "<your-preview-namespace-id>"
```

#### 2) Set Worker secrets (runtime)

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
```

Generate a strong `SESSION_SECRET` (e.g. 32+ random bytes).

#### 3) GitHub Secrets & Variables

In the repo: **Settings → Secrets and variables → Actions**

**Secrets** (required for deploy):

| Name | Purpose |
| ---- | ------- |
| `CF_API_TOKEN` | Cloudflare API token with Workers edit permission |
| `CF_ACCOUNT_ID` | Cloudflare account ID |

> Aliases `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` are also accepted by the workflow.

**Variables** (optional):

| Name | Purpose |
| ---- | ------- |
| `PROJECT_NAME` | Logical project label |
| `ENVIRONMENT` | e.g. `production` |

#### 4) API token permissions

Create a token at Cloudflare → **My Profile → API Tokens** with at least:

- Account → Workers Scripts → Edit
- Account → Workers KV Storage → Edit (if managing KV via API)
- Account → Account Settings → Read (often needed for account id resolution)

#### 5) Push to deploy

```bash
git push origin main
```

Or run the workflow manually: **Actions → Deploy → Run workflow**.

Worker runtime secrets (`ADMIN_PASSWORD`, `SESSION_SECRET`) are **not** set by CI — configure them once in Cloudflare (CLI or Dashboard).

---

### Mode 2 — Cloudflare Dashboard (no GitHub required)

You can deploy without GitHub:

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages**
2. **Create** application → **Worker**
3. Either:
   - Connect this Git repository, or
   - Use Wrangler from your machine: `npm run deploy`, or
   - Paste / upload the project and bind the entry `src/index.ts` via Wrangler config
4. Under the Worker → **Settings**:
   - **Variables and Secrets** — add variables + secrets (table below)
   - **Bindings** → **KV namespace** → bind name `BIO_KV` to a namespace
5. Deploy

Dashboard Variables are injected as `env.*` the same way as `wrangler.toml` `[vars]`.

---

## Environment variables

### Secrets (sensitive)

| Variable | Type | Where | Purpose |
| -------- | ---- | ----- | ------- |
| `ADMIN_PASSWORD` | Secret | Worker Secrets / `.dev.vars` | Admin login password |
| `SESSION_SECRET` | Secret | Worker Secrets / `.dev.vars` | HMAC key for session cookies |
| `CF_API_TOKEN` | Secret | **GitHub only** | Actions → Wrangler deploy |
| `CF_ACCOUNT_ID` | Secret | **GitHub only** | Cloudflare account for Actions |

**Rules:**

- Never commit secrets
- Never put secrets in `wrangler.toml`
- Never store `ADMIN_PASSWORD` in KV
- Never expose secrets to the frontend

Set Worker secrets:

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
```

Or: **Workers → your worker → Settings → Variables and Secrets**.

### Variables (non-secret)

| Variable | Type | Purpose | Default |
| -------- | ---- | ------- | ------- |
| `SITE_NAME` | Variable | Display / title name | `LinkBio` |
| `SITE_URL` | Variable | Canonical URL | `http://localhost:8787` |
| `DEFAULT_THEME` | Variable | Default theme id | `default` |

Configured in `wrangler.toml` `[vars]` and overridable in Dashboard / CI.

---

## KV configuration

**Binding name:** `BIO_KV` (must match code + `wrangler.toml`)

### Keys

| Key | Content |
| --- | ------- |
| `profile` | Name, username, bio, avatar, location, email |
| `links` | Array of link objects |
| `settings` | Theme, dark mode, accent, background, footer |
| `analytics` | Page views + per-link click counts |

### Example values

**profile**

```json
{
  "name": "Example",
  "username": "example",
  "bio": "Developer",
  "avatar": "",
  "location": "",
  "email": ""
}
```

**links**

```json
[
  {
    "id": "link-github",
    "title": "GitHub",
    "url": "https://github.com",
    "icon": "github",
    "order": 0,
    "enabled": true
  }
]
```

**settings**

```json
{
  "theme": "default",
  "darkMode": true,
  "accentColor": "#6366f1",
  "background": "",
  "showFooter": true
}
```

Empty keys automatically fall back to safe defaults so a fresh namespace works immediately.

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
| Theme | `/admin/theme` | Dark/light, accent color, background image |
| Data | `/admin/data` | Export JSON backup / import JSON |

### Security model

- Password checked against `ADMIN_PASSWORD` secret only (not stored in KV)
- Session = HMAC-SHA256 signed cookie (`HttpOnly`, `SameSite=Lax`, `Secure` on HTTPS)
- CSRF double-submit on all state-changing form posts
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
- [x] CSRF on admin forms
- [x] Input sanitization on writes / import

Forbidden:

- Frontend exposure of admin password
- Public raw KV access
- Plaintext session storage in KV

---

## Customization

- **Theme accent / mode** — Admin → Theme, or edit `settings` in KV
- **Icons** — built-in: `link`, `github`, `globe`, `twitter`, `x`, `linkedin`, `youtube`, `instagram`, `mail` (`src/components/icons.ts`)
- **CSS** — `src/styles/app.css` (inlined via `app.css.ts` at build time for SSR)
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
