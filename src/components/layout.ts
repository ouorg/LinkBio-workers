import { escapeHtml } from "../middleware/security";
import type { Settings } from "../types";
import { appCss as css } from "../styles/app.css.js";

export type LayoutOptions = {
  title: string;
  siteName: string;
  settings: Settings;
  bodyClass?: string;
  headExtra?: string;
  children: string;
};

/**
 * Full HTML document wrapper (SSR). CSS is inlined for zero extra round-trips.
 */
export function renderLayout(opts: LayoutOptions): string {
  const themeAttr = opts.settings.darkMode ? "dark" : "light";
  const accent = escapeHtml(opts.settings.accentColor || "#6366f1");
  const title = escapeHtml(opts.title);
  const bodyClass = escapeHtml(opts.bodyClass || "");

  return `<!DOCTYPE html>
<html lang="en" data-theme="${themeAttr}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="${themeAttr}" />
  <title>${title}</title>
  <meta name="description" content="${escapeHtml(opts.siteName)} — personal bio links" />
  <style>${css}</style>
  <style>:root { --accent: ${accent}; --accent-hover: color-mix(in srgb, ${accent} 80%, white); --accent-soft: color-mix(in srgb, ${accent} 18%, transparent); }</style>
  ${opts.headExtra || ""}
</head>
<body class="${bodyClass}">
${opts.children}
</body>
</html>`;
}

export function htmlResponse(html: string, status = 200, headers?: HeadersInit): Response {
  const h = new Headers(headers);
  h.set("Content-Type", "text/html; charset=utf-8");
  return new Response(html, { status, headers: h });
}
