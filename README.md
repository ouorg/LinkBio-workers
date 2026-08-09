# LinkBio-workers

Personal **Bio / Digital Card** on **Cloudflare Workers**, rebuilt with:

- **Next.js 15** App Router (Server Components first)
- **Tailwind CSS v4** + **shadcn-style** UI primitives
- **OpenNext Cloudflare** for edge deploy
- **Cloudflare KV** for content & analytics

## Features

- Public bio page (profile, links, footer)
- Admin console (`/admin`) with session auth + CSRF
- Theme: site default + visitor toolbar (`system | light | dark`)
- i18n: `zh-CN` / `en` (+ visitor `auto` via `Accept-Language`)
- Login rate limit, split KV analytics counters
- GitHub Actions deploy

## Performance stance

| Choice | Why |
|--------|-----|
| RSC by default | Minimal client JS on public page |
| Client islands only | Theme toolbar (+ click beacon) |
| `force-dynamic` for `/` & admin | Cookie prefs + auth |
| No i18next / heavy SPA | Smaller surface area |

Worker size is larger than the previous Hono SSR (~150KB) because of Next/OpenNext — trade-off for shadcn DX and React UI.

## Quick start

### Prerequisites

- Node.js **22+**
- Cloudflare account (for deploy / real KV)

```bash
npm install --legacy-peer-deps
cp .dev.vars.example .dev.vars
# edit ADMIN_PASSWORD / SESSION_SECRET
npm run dev
```

- Public: http://localhost:3000  
- Admin: http://localhost:3000/admin  

Local bindings come from Wrangler / OpenNext dev (`initOpenNextCloudflareForDev`).  
If bindings are missing, use:

```bash
npm run preview   # OpenNext + workerd local
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | `next build` |
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
Variable/Secret: `BIO_KV_ID` (real namespace id; CI injects into `wrangler.toml`)

Push to `main` or run **Deploy** workflow.

### 3) CLI

```bash
# Set real BIO_KV ids in wrangler.toml locally (do not commit)
npm run deploy
```

## Data model (KV)

Unchanged: `profile`, `links`, `settings`, `analytics:*`, `rate:login:*`.

Visitor cookies (override site defaults):

- `lb_color` = `system | light | dark`
- `lb_locale` = `auto | zh-CN | en`

## Project layout

```
app/                 # Next.js routes (RSC + route handlers)
components/ui/       # shadcn-style primitives
components/public/   # bio UI + toolbar
components/admin/    # admin chrome
lib/                 # kv, session, i18n, prefs, security, themes
src/themes/          # visual packs (theme.json + tokens.css)
scripts/build-themes.mjs
wrangler.toml        # OpenNext worker + BIO_KV
open-next.config.ts
```

## Visual themes (`src/themes/`)

Each pack is a folder with:

| File | Role |
|------|------|
| `theme.json` | Metadata only (`id`, `name`, `nameZh`, `version`, `features`…) |
| `tokens.css` | CSS variables scoped by `[data-theme-id="…"]` |

Orthogonal to color mode: `data-theme` = `system|light|dark`, `data-theme-id` = pack id.

```bash
npm run build:themes   # validates JSON, writes _registry.ts + _bundle.css
```

Add a theme:

1. Copy `src/themes/base` → `src/themes/my-theme`
2. Edit `theme.json` (`id` must match folder name)
3. Edit `tokens.css`
4. Run `npm run build:themes`
5. Select in Admin → Theme

`DEFAULT_THEME` (Workers var) and KV `settings.theme` store the same id string; unknown ids fall back to `base`.

## License

MIT
