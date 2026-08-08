import { escapeHtml } from "../middleware/security";
import { htmlResponse, renderLayout } from "../components/layout";
import {
  renderDataPanel,
  renderLinksPanel,
  renderProfileForm,
  renderSettingsForm,
  renderStats,
} from "./forms";
import type { Analytics, LinkItem, Profile, Settings } from "../types";

export type AdminPage =
  | "overview"
  | "profile"
  | "links"
  | "theme"
  | "data";

export type DashboardData = {
  siteName: string;
  settings: Settings;
  profile: Profile;
  links: LinkItem[];
  analytics: Analytics;
  csrf: string;
  page: AdminPage;
  message?: string;
};

export function renderAdminDashboard(data: DashboardData): Response {
  const nav = renderNav(data.page, data.siteName);
  let body = "";

  switch (data.page) {
    case "profile":
      body = renderProfileForm(data.profile, data.csrf, data.message);
      break;
    case "links":
      body = renderLinksPanel(data.links, data.csrf, data.message);
      break;
    case "theme":
      body = renderSettingsForm(data.settings, data.csrf, data.message);
      break;
    case "data":
      body = renderDataPanel(data.csrf, data.message);
      break;
    default:
      body = `
        ${renderStats(data.analytics)}
        <section class="panel">
          <h2>Quick links</h2>
          <div class="row-actions">
            <a class="btn btn-secondary" href="/admin/profile">Edit profile</a>
            <a class="btn btn-secondary" href="/admin/links">Manage links</a>
            <a class="btn btn-secondary" href="/admin/theme">Theme</a>
            <a class="btn btn-secondary" href="/admin/data">Import / Export</a>
            <a class="btn btn-secondary" href="/" target="_blank" rel="noopener">View public site</a>
          </div>
        </section>
        <section class="panel">
          <h2>Current profile</h2>
          <p style="margin:0;color:var(--text-secondary)">
            <strong>${escapeHtml(data.profile.name)}</strong>
            ${data.profile.username ? ` · @${escapeHtml(data.profile.username)}` : ""}
          </p>
          <p style="margin:8px 0 0;color:var(--text-muted);font-size:0.9rem">${escapeHtml(data.profile.bio)}</p>
          <p style="margin:12px 0 0;color:var(--text-muted);font-size:0.85rem">${data.links.filter((l) => l.enabled).length} enabled link(s)</p>
        </section>`;
  }

  const titles: Record<AdminPage, string> = {
    overview: "Dashboard",
    profile: "Profile",
    links: "Links",
    theme: "Theme",
    data: "Data",
  };

  const html = renderLayout({
    title: `${titles[data.page]} · Admin · ${data.siteName}`,
    siteName: data.siteName,
    settings: data.settings,
    bodyClass: "admin-body",
    children: `
    <div class="admin-shell">
      ${nav}
      <header class="admin-header">
        <h1>${escapeHtml(titles[data.page])}</h1>
        <p>Manage your bio page content and appearance.</p>
      </header>
      ${body}
    </div>`,
  });

  return htmlResponse(html);
}

export function renderLoginPage(opts: {
  siteName: string;
  settings: Settings;
  csrf: string;
  error?: string;
}): Response {
  const html = renderLayout({
    title: `Admin login · ${opts.siteName}`,
    siteName: opts.siteName,
    settings: opts.settings,
    bodyClass: "admin-body",
    children: `
    <div class="login-page">
      <div class="login-card">
        <h1>Admin</h1>
        <p class="sub">Sign in to manage ${escapeHtml(opts.siteName)}</p>
        ${opts.error ? `<div class="alert alert-error">${escapeHtml(opts.error)}</div>` : ""}
        <form method="post" action="/admin/login">
          <input type="hidden" name="_csrf" value="${escapeHtml(opts.csrf)}" />
          <div class="field">
            <label for="password">Password</label>
            <input id="password" name="password" type="password" required autocomplete="current-password" autofocus />
            <div class="hint">Uses the ADMIN_PASSWORD secret — never stored in KV.</div>
          </div>
          <div class="row-actions">
            <button class="btn" type="submit" style="width:100%">Sign in</button>
          </div>
        </form>
      </div>
    </div>`,
  });
  return htmlResponse(html);
}

function renderNav(page: AdminPage, siteName: string): string {
  const items: { id: AdminPage | "logout" | "public"; href: string; label: string; danger?: boolean }[] = [
    { id: "overview", href: "/admin", label: "Overview" },
    { id: "profile", href: "/admin/profile", label: "Profile" },
    { id: "links", href: "/admin/links", label: "Links" },
    { id: "theme", href: "/admin/theme", label: "Theme" },
    { id: "data", href: "/admin/data", label: "Data" },
    { id: "public", href: "/", label: "Public" },
    { id: "logout", href: "/admin/logout", label: "Logout", danger: true },
  ];

  const links = items
    .map((item) => {
      const active = item.id === page ? " active" : "";
      const danger = item.danger ? " danger" : "";
      if (item.id === "logout") {
        // logout is GET for simplicity; session cleared server-side
        return `<a class="nav-link${danger}" href="${item.href}">${item.label}</a>`;
      }
      return `<a class="nav-link${active}${danger}" href="${item.href}">${item.label}</a>`;
    })
    .join("");

  return `
  <nav class="admin-nav">
    <div class="admin-brand">LinkBio<span>${escapeHtml(siteName)}</span></div>
    <div class="admin-nav-links">${links}</div>
  </nav>`;
}
