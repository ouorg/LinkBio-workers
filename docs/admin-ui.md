# Admin UI 重构说明

Admin 已从 `@cloudflare/kumo` 切到 **`@base-ui/react` + Tailwind v4**。

## 分层

- `components/base/`：Base UI 原语封装（Button、Field、Select、Dialog、Menu、Checkbox、Alert）
- `components/admin/`：业务组件（Nav、Panel、Flash、IconSelect、PrefsToolbar）
- `app/admin/`：路由与 Server Actions（业务逻辑未改）

前台仍用 `components/ui`（shadcn / Radix），不强行合并。颜色/间距通过 `app/globals.css` 里的 `--admin-*` 与公共 token 对齐。

## 硬性约定

1. Admin 只引入 `@base-ui/react` 与 `components/base`，不要再加 Radix / Kumo。
2. 链接看起来像按钮时，用 `LinkButton`（`<a>`），不要把 `Button` 渲染成链接。
3. `Button` 必须显式写 `type="submit"` 或 `type="button"`。
4. 所有 POST 表单保留 CSRF hidden field。
5. 危险操作（删链接、导入、远端恢复）走 `ConfirmSubmitButton`（Dialog，不是 `window.confirm`）。
6. 图标只用 `lucide-react`。

## 深浅色

- 站点：`html[data-theme]`
- Admin 壳：`[data-admin-root][data-mode]`
- `--admin-*` 定义在 `:root`，保证 Base UI Portal 也能继承。
