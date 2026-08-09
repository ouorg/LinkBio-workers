# LinkBio-workers

运行在 **Cloudflare Workers** 上的个人 **Bio / 数字名片** 平台。

**文档语言：** [简体中文](./README.md)（默认）· [English](./README.en.md)

## 技术栈

- **Next.js 15** App Router（默认 Server Components）
- **Tailwind CSS v4** + shadcn 风格 UI 组件
- **OpenNext Cloudflare** 边缘部署
- **Cloudflare KV** 存储内容与统计

## 功能

- 前台个人主页（资料、链接、页脚）
- 管理后台（`/admin`）：会话登录 + CSRF
- 深浅色：站点默认 + 访客工具条（`system | light | dark`）
- **界面默认语言：简体中文（`zh-CN`）**；另支持英文 `en`，访客可选 `auto`（跟随 `Accept-Language`）
- 可扩展视觉主题（`src/themes/`，构建期打包）
- 登录限流、拆分 KV 分析计数
- GitHub Actions 自动部署

## 性能取向

| 选择 | 原因 |
|------|------|
| 默认 RSC | 前台客户端 JS 尽量少 |
| 仅少量 Client 岛屿 | 主题工具条、链接点击上报 |
| `/` 与后台 `force-dynamic` | Cookie 偏好与登录态 |
| 轻量自研 i18n | 不引入 i18next 等重库 |

相对早期纯 Hono SSR（Worker 约 150KB），引入 Next/OpenNext 后包体更大，换取 React/shadcn 开发体验与组件化 UI。

## 快速开始

### 环境要求

- Node.js **22+**
- Cloudflare 账号（部署 / 真实 KV）

```bash
npm install --legacy-peer-deps
cp .dev.vars.example .dev.vars
# 编辑 ADMIN_PASSWORD、SESSION_SECRET
npm run dev
```

- 前台：http://localhost:3000  
- 后台：http://localhost:3000/admin  

本地 Bindings 依赖 Wrangler / OpenNext 开发初始化。若缺少绑定，可使用：

```bash
npm run preview   # OpenNext + workerd 本地运行
```

### 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | Next.js 开发服务器（会先构建主题） |
| `npm run build` | `next build` |
| `npm run build:themes` | 校验并生成主题 registry / CSS |
| `npm run build:worker` | OpenNext Worker 产物 |
| `npm run preview` | 构建并在本地 Workers 运行时预览 |
| `npm run deploy` | 构建并部署到 Cloudflare |
| `npm run typecheck` | `tsc --noEmit` |

## 部署

### 1）创建 KV 与密钥

```bash
npx wrangler kv namespace create BIO_KV
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
```

### 2）GitHub Actions

- Secrets：`CF_API_TOKEN`、`CF_ACCOUNT_ID`
- Variable/Secret：`BIO_KV_ID`（真实 KV namespace id，CI 会写入 `wrangler.toml`）

推送到 `main` 或手动运行 **Deploy** 工作流。

### 3）命令行部署

```bash
# 本地 wrangler.toml 填入真实 BIO_KV id（勿提交真实 id）
npm run deploy
```

### 环境变量（Vars，非 Secret）

| 变量 | 说明 |
|------|------|
| `SITE_NAME` | 站点显示名 |
| `SITE_URL` | 公网 canonical URL（勿用 localhost 作为生产值） |
| `DEFAULT_THEME` | 默认视觉主题 id（如 `base`、`old`） |

运行时密钥（Secret）：`ADMIN_PASSWORD`、`SESSION_SECRET`。

## 数据模型（KV）

内容键：`profile`、`links`、`settings`、`analytics:*`、`rate:login:*`。

访客 Cookie（覆盖站点默认）：

- `lb_color` = `system | light | dark`
- `lb_locale` = `auto | zh-CN | en`（**产品默认界面语言为 zh-CN**）

## 目录结构

```
app/                 # Next.js 路由（RSC + Route Handlers）
components/ui/       # shadcn 风格基础组件
components/public/   # 前台名片、工具条
components/admin/    # 后台导航等
lib/                 # kv、session、i18n、prefs、security、themes
src/themes/          # 视觉包（theme.json + tokens.css）
scripts/build-themes.mjs
wrangler.toml        # OpenNext Worker + BIO_KV
open-next.config.ts
README.md            # 简体中文（默认）
README.en.md         # English
```

## 视觉主题（`src/themes/`）

> 主题 = 标准目录 + **构建期**打进 registry/CSS；默认由 **`DEFAULT_THEME`**（Vars）决定；运行时用 KV `settings.theme` 切换 `data-theme-id`；深浅色用 `data-theme` 正交控制。

完整说明与「新增主题 4 步」见 **[src/themes/README.md](./src/themes/README.md)**。

| HTML 属性 | 含义 |
|-----------|------|
| `data-theme` | `system` \| `light` \| `dark` |
| `data-theme-id` | `base` \| `minimal` \| `glass` \| `aurora` \| `old` \| `anthropic` \| … |

解析顺序：`settings.theme`（合法 id）→ `env.DEFAULT_THEME` → `base`。

```bash
npm run build:themes   # 校验并生成 _registry.ts / _bundle.css（打包全部主题）
```

内置示例：`base`、`minimal`、`glass`、`aurora`、旧版 Hono **`old`**，以及 **`anthropic`（Anthropic 插画风）**。

## 多语言文档

| 文件 | 语言 |
|------|------|
| [README.md](./README.md) | **简体中文（默认）** |
| [README.en.md](./README.en.md) | English |

应用内 UI 文案默认 **`zh-CN`**，可在后台主题页切换为 English，或由访客工具条选择自动/中文/英文。

## 许可证

MIT
