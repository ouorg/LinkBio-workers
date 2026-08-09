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

> 主题 = 标准目录 + **构建期**打进 registry/CSS；默认由 **`DEFAULT_THEME`**（Vars）决定；运行时 KV `settings.theme` 切换 `data-theme-id`；深浅色用 `data-theme` 正交控制。

详见 **[src/themes/README.md](src/themes/README.md)**（给 AI/人的完整 checklist）。

| 属性 | 含义 |
|------|------|
| `data-theme` | `system` \| `light` \| `dark` |
| `data-theme-id` | `base` \| `minimal` \| `glass` \| `aurora` \| … |

解析顺序：`settings.theme`（合法 id）→ `env.DEFAULT_THEME` → `base`。

```bash
npm run build:themes   # 校验 + 生成 _registry.ts / _bundle.css（打包全部主题）
```

**新增主题 4 步：** 复制 `base/` → 改 `theme.json` → 改 `tokens.css` → `npm run build:themes`（不要改路由核心逻辑）。

## License

MIT
