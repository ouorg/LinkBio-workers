# Themes — 可扩展视觉包

> **主题 = 仓库内标准目录 + 构建期打进 registry/CSS；默认主题由 `DEFAULT_THEME` 变量决定；运行时用 KV `settings.theme` 切换 `data-theme-id`；深浅色仍由 `data-theme` 正交控制。**

Workers **没有**可读仓库文件系统。所有主题必须在 **build 时** 打进 bundle（`npm run build:themes`）。

---

## 目录约定

```text
src/themes/
  _types.ts           # ThemeManifest schema（唯一标准）
  _registry.ts        # 构建生成 — 勿手改
  _bundle.css         # 构建生成 — 勿手改
  _default.css        # 布局/组件结构（与皮肤无关）
  base/               # 内置兜底，必须存在
    theme.json
    tokens.css
  minimal/
  glass/
  aurora/
```

**一个主题 = 一个目录 = `theme.json` + `tokens.css`。**  
禁止：主题目录里写业务逻辑 / Hono / 路由；禁止 JSON 里塞大段 CSS；禁止运行时远程拉主题。

---

## 新增主题（4 步）

1. **复制** `base/` → `my-theme/`（文件夹名 = kebab-case id）
2. **改** `theme.json`：`id`（必须等于文件夹名）、`name`、`nameZh`、`description`
3. **改** `tokens.css`：只覆盖下方约定的 CSS 变量（挂在 `[data-theme-id="my-theme"]`）
4. **构建**：`npm run build:themes`（`dev` / `build` / `typecheck` 会自动跑）

无需改 `app/page.tsx`、路由或核心业务。后台下拉会自动出现新主题。

---

## `theme.json` 字段

| 字段 | 要求 |
|------|------|
| `id` | 与文件夹名一致，kebab-case |
| `name` / `nameZh` | 后台展示 |
| `version` | schema 版本，从 `1` 起 |
| `tokensFile` | 默认 `"tokens.css"` |
| `features` | 可选：`blur`、`gradientBg`、`customFonts` 等；核心可忽略未知键 |

类型定义见 `_types.ts` 的 `ThemeManifest`。

---

## `tokens.css` 约定

与 **深浅色正交**：

| HTML 属性 | 含义 |
|-----------|------|
| `data-theme` | `system` \| `light` \| `dark`（亮度） |
| `data-theme-id` | 皮肤 id（圆角、品牌色、质感） |

主题主要覆写 **品牌 / 质感** 变量（全局中性色由 `app/globals.css` 的 light/dark 处理）：

```css
[data-theme-id="my-theme"] {
  /* 必选倾向 */
  --primary: 239 84% 67%;       /* HSL 通道，无 hsl() */
  --ring: 239 84% 67%;
  --theme-radius: 0.9rem;
  --theme-card-radius: 1rem;
  --theme-link-radius: 1rem;
  --theme-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
  --theme-font: Inter, ui-sans-serif, system-ui, sans-serif;

  /* 可选：链接 / 卡片质感 */
  --theme-blur: 12px;
}
```

需要按明暗区分时：

```css
[data-theme-id="my-theme"][data-theme="light"] { ... }
[data-theme-id="my-theme"][data-theme="dark"] { ... }
```

结构 class 用 `_default.css` 中的：`.theme-page`、`.theme-link`、`.theme-avatar`、`.theme-card`、`.theme-footer`。

用户在后台设置的 **accentColor** 仍可在运行时覆盖 `--primary`（若以后接上 inline 覆盖）；主题提供默认品牌色即可。

---

## 默认主题与解析顺序

| 变量 | 类型 | 含义 |
|------|------|------|
| `DEFAULT_THEME` | Workers **Vars**（非 Secret） | 无有效 KV 主题时的默认 id |
| `DEFAULT_COLOR_MODE` | 可选 Vars | 预留；当前深浅仍以 settings/cookie 为准 |

解析：

1. KV `settings.theme` 若为已注册 id → 用它  
2. 否则 `env.DEFAULT_THEME` 若合法 → 用它  
3. 否则 `base`  

非法 id **永不白屏**，强制 `base`。

---

## 构建

```bash
npm run build:themes
# 扫描 src/themes/*/theme.json
# 校验 id === 目录名、必填字段、tokens 文件存在
# 生成 _registry.ts + _bundle.css（含全部主题）
```

**构建 = 打包全部主题 tokens**；`DEFAULT_THEME` 只影响首屏默认选中，不是「只编译一个主题」。

---

## AI / 人 checklist

- [ ] 目录名 kebab-case，与 `theme.json` → `id` 一致  
- [ ] 有 `name`、`nameZh`、`version: 1`、`tokensFile`  
- [ ] 只有 `theme.json` + `tokens.css`（无业务 TS）  
- [ ] 未改路由 / KV schema / 核心逻辑  
- [ ] `npm run build:themes` 成功并打印主题列表  
- [ ] 后台主题页能看到新项并保存  
- [ ] 前台 `data-theme-id` 与深浅色可同时生效  
