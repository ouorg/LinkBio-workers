# LinkBio-workers

A personal **Bio / Digital Card** platform on **Cloudflare Workers**.

**Documentation:** [简体中文](./README.md) (default) · [English](./README.en.md)

## Stack

- **Next.js 15** App Router (Server Components first)
- **Tailwind CSS v4** + shadcn-style UI primitives
- **OpenNext Cloudflare** for edge deploy
- **Cloudflare KV** for content and analytics

## Features

- Public bio page (profile, links, footer)
- Admin console (`/admin`) with session auth + CSRF
- Color mode: site default + visitor toolbar (`system | light | dark`)
- **Default UI locale: Simplified Chinese (`zh-CN`)**; also supports English (`en`), plus visitor `auto` via `Accept-Language`
- Extensible visual themes (`src/themes/`, bundled at build time)
- Login rate limiting, split KV analytics counters
- GitHub Actions deploy

## Performance stance

| Choice | Why |
|--------|-----|
| RSC by default | Minimal client JS on the public page |
| Client islands only | Theme toolbar (+ click beacon) |
| `force-dynamic` for `/` and admin | Cookie prefs + auth |
| Lightweight custom i18n | No i18next or heavy SPA i18n stack |

Worker size is larger than the previous Hono SSR (~150KB) because of Next/OpenNext — trade-off for React/shadcn DX and componentized UI.

## Quick start

### Prerequisites

- Node.js **22+**
- Cloudflare account (for deploy / real KV)

```bash
npm install --legacy-peer-deps
cp .dev.vars.example .dev.vars
# edit ADMIN_PASSWORD and SESSION_SECRET
npm run dev
```

- Public site: http://localhost:3000  
- Admin: http://localhost:3000/admin  

Local bindings come from Wrangler / OpenNext dev (`initOpenNextCloudflareForDev`).  
If bindings are missing:

```bash
npm run preview   # OpenNext + workerd locally
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server (builds themes first) |
| `npm run build` | `next build` |
| `npm run build:themes` | Validate themes and generate registry / CSS |
| `npm run build:worker` | OpenNext worker bundle |
| `npm run preview` | Build + local Workers runtime |
| `npm run deploy` | Build + deploy to Cloudflare |
| `npm run typecheck` | `tsc --noEmit` |

## Deploy

### 1) KV + secrets

```bash
npx wrangler kv namespace create BIO_KV
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
```

### 2) GitHub Actions

Secrets: `CF_API_TOKEN`, `CF_ACCOUNT_ID`  
Variable/Secret: `BIO_KV_ID` (real KV namespace id; CI injects into `wrangler.toml`)

Push to `main` or run the **Deploy** workflow manually.

### 3) CLI

```bash
# Put real BIO_KV ids in local wrangler.toml (do not commit real ids)
npm run deploy
```

### Environment variables (Vars, not Secrets)

| Variable | Purpose |
|----------|---------|
| `SITE_NAME` | Site display name |
| `SITE_URL` | Canonical public URL (do not leave as localhost in production) |
| `DEFAULT_THEME` | Default visual theme id (e.g. `base`, `hono-old`) |

Runtime secrets: `ADMIN_PASSWORD`, `SESSION_SECRET`.

## Data model (KV)

Keys: `profile`, `links`, `settings`, `analytics:*`, `rate:login:*`.

Visitor cookies (override site defaults):

- `lb_color` = `system | light | dark`
- `lb_locale` = `auto | zh-CN | en` (**product default UI language is `zh-CN`**)

## Project layout

```
app/                 # Next.js routes (RSC + route handlers)
components/ui/       # shadcn-style primitives
components/public/   # public bio UI + toolbar
components/admin/    # admin chrome
lib/                 # kv, session, i18n, prefs, security, themes
src/themes/          # visual packs (theme.json + tokens.css)
scripts/build-themes.mjs
wrangler.toml        # OpenNext worker + BIO_KV
open-next.config.ts
README.md            # Simplified Chinese (default)
README.en.md         # English
```

## Visual themes (`src/themes/`)

> Theme = standard folder + **build-time** registry/CSS; default from **`DEFAULT_THEME`** (Vars); runtime KV `settings.theme` switches `data-theme-id`; color mode uses orthogonal `data-theme`.

Full guide and “add a theme in 4 steps”: **[src/themes/README.md](./src/themes/README.md)** (Chinese checklist; schema is language-neutral).

| Attribute | Meaning |
|-----------|---------|
| `data-theme` | `system` \| `light` \| `dark` |
| `data-theme-id` | `base` \| `minimal` \| `glass` \| `aurora` \| `hono-old` \| `anthropic` \| `apple` \| … |

Resolution order: valid `settings.theme` → `env.DEFAULT_THEME` → `base`.

```bash
npm run build:themes   # validate + generate _registry.ts / _bundle.css (all themes)
```

Built-in packs: `base`, `minimal`, `glass`, `aurora`, **`hono-old`**, **`anthropic`**, and **`apple`** (Apple-inspired marketing UI, unofficial).

### Add a theme (4 steps)

1. Copy `src/themes/base` → `src/themes/my-theme`
2. Edit `theme.json` (`id` must match folder name)
3. Edit `tokens.css`
4. Run `npm run build:themes` (do not change core routes)

## Multilingual documentation

| File | Language |
|------|----------|
| [README.md](./README.md) | **Simplified Chinese (default)** |
| [README.en.md](./README.en.md) | English |

In-app UI defaults to **`zh-CN`**. Switch to English in Admin → Theme, or use the public toolbar (Auto / 中文 / English).

## License

MIT
