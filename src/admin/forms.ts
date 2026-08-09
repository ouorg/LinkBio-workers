import { CSRF_FIELD, escapeHtml } from "../middleware/security";
import { ICON_OPTIONS } from "../components/icons";
import type { Analytics, LinkItem, Profile, Settings } from "../types";

export function csrfField(token: string): string {
  return `<input type="hidden" name="${CSRF_FIELD}" value="${escapeHtml(token)}" />`;
}

export function renderProfileForm(profile: Profile, csrf: string, message?: string): string {
  return `
  <section class="panel">
    <h2>Profile</h2>
    ${flash(message)}
    <form method="post" action="/admin/profile">
      ${csrfField(csrf)}
      <div class="grid-2">
        <div class="field">
          <label for="name">Name</label>
          <input id="name" name="name" value="${escapeHtml(profile.name)}" required maxlength="80" />
        </div>
        <div class="field">
          <label for="username">Username</label>
          <input id="username" name="username" value="${escapeHtml(profile.username)}" maxlength="40" pattern="[a-zA-Z0-9._-]*" />
        </div>
      </div>
      <div class="field">
        <label for="bio">Bio</label>
        <textarea id="bio" name="bio" maxlength="500">${escapeHtml(profile.bio)}</textarea>
      </div>
      <div class="field">
        <label for="avatar">Avatar URL</label>
        <input id="avatar" name="avatar" type="url" value="${escapeHtml(profile.avatar)}" maxlength="2000" placeholder="https://..." />
      </div>
      <div class="grid-2">
        <div class="field">
          <label for="location">Location</label>
          <input id="location" name="location" value="${escapeHtml(profile.location)}" maxlength="120" />
        </div>
        <div class="field">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" value="${escapeHtml(profile.email)}" maxlength="120" />
        </div>
      </div>
      <div class="row-actions">
        <button class="btn" type="submit">Save profile</button>
      </div>
    </form>
  </section>`;
}

export function renderSettingsForm(settings: Settings, csrf: string, message?: string): string {
  return `
  <section class="panel">
    <h2>Theme &amp; appearance</h2>
    ${flash(message)}
    <form method="post" action="/admin/settings">
      ${csrfField(csrf)}
      <div class="grid-2">
        <div class="field">
          <label for="theme">Theme</label>
          <select id="theme" name="theme">
            ${option("default", "Default", settings.theme)}
            ${option("minimal", "Minimal", settings.theme)}
            ${option("glass", "Glass", settings.theme)}
          </select>
        </div>
        <div class="field">
          <label for="accentColor">Accent color</label>
          <input id="accentColor" name="accentColor" type="text" value="${escapeHtml(settings.accentColor)}" pattern="#[0-9a-fA-F]{3,8}" placeholder="#6366f1" />
        </div>
      </div>
      <div class="field">
        <label for="background">Background image URL (optional)</label>
        <input id="background" name="background" type="url" value="${escapeHtml(settings.background)}" maxlength="2000" placeholder="https://..." />
      </div>
      <div class="field">
        <label class="check-row">
          <input type="checkbox" name="darkMode" value="1" ${settings.darkMode ? "checked" : ""} />
          Dark mode
        </label>
      </div>
      <hr class="sep" />
      <h2 style="margin-top:0">Public footer</h2>
      <p class="hint" style="color:var(--text-secondary);font-size:0.85rem;margin:0 0 12px">
        Empty custom text falls back to site name + Admin link. Auth-only shows the footer only when you are logged in.
      </p>
      <div class="field">
        <label class="check-row">
          <input type="checkbox" name="showFooter" value="1" ${settings.showFooter && settings.footerMode !== "off" ? "checked" : ""} />
          Show footer
        </label>
      </div>
      <div class="field">
        <label for="footerMode">Footer mode</label>
        <select id="footerMode" name="footerMode">
          ${option("default", "Default (site name + Admin link)", settings.footerMode)}
          ${option("custom", "Custom text only", settings.footerMode)}
          ${option("auth_only", "Only when admin is logged in", settings.footerMode)}
          ${option("off", "Always hidden", settings.footerMode)}
        </select>
      </div>
      <div class="field">
        <label for="footerText">Custom footer text (optional)</label>
        <textarea id="footerText" name="footerText" maxlength="500" placeholder="Leave empty for default: site name + Admin link">${escapeHtml(settings.footerText || "")}</textarea>
        <div class="hint">Plain text; line breaks are preserved. HTML is escaped.</div>
      </div>
      <div class="row-actions">
        <button class="btn" type="submit">Save theme</button>
      </div>
    </form>
  </section>`;
}

export function renderLinksPanel(links: LinkItem[], csrf: string, message?: string): string {
  const rows =
    links.length === 0
      ? `<div class="empty">No links yet. Add one below.</div>`
      : `<div class="links-list">${links
          .map((l) => {
            const badge = l.enabled
              ? `<span class="badge badge-on">On</span>`
              : `<span class="badge badge-off">Off</span>`;
            return `
          <div class="link-row">
            <div>
              <div class="title">${escapeHtml(l.title)}${badge}</div>
              <div class="meta-line">${escapeHtml(l.url)} · icon: ${escapeHtml(l.icon)} · order: ${l.order}</div>
            </div>
            <div class="row-actions" style="margin:0">
              <form method="post" action="/admin/links/${escapeHtml(l.id)}/toggle">
                ${csrfField(csrf)}
                <button class="btn btn-secondary btn-sm" type="submit">${l.enabled ? "Disable" : "Enable"}</button>
              </form>
              <form method="post" action="/admin/links/${escapeHtml(l.id)}/up">
                ${csrfField(csrf)}
                <button class="btn btn-secondary btn-sm" type="submit">↑</button>
              </form>
              <form method="post" action="/admin/links/${escapeHtml(l.id)}/down">
                ${csrfField(csrf)}
                <button class="btn btn-secondary btn-sm" type="submit">↓</button>
              </form>
              <form method="post" action="/admin/links/${escapeHtml(l.id)}/delete" onsubmit="return confirm('Delete this link?')">
                ${csrfField(csrf)}
                <button class="btn btn-danger btn-sm" type="submit">Delete</button>
              </form>
            </div>
          </div>`;
          })
          .join("")}</div>`;

  const iconOptions = ICON_OPTIONS.map((i) => option(i, i, "link")).join("");

  return `
  <section class="panel">
    <h2>Links</h2>
    ${flash(message)}
    ${rows}
    <hr class="sep" />
    <h2>Add link</h2>
    <form method="post" action="/admin/links">
      ${csrfField(csrf)}
      <div class="grid-2">
        <div class="field">
          <label for="title">Title</label>
          <input id="title" name="title" required maxlength="80" />
        </div>
        <div class="field">
          <label for="icon">Icon</label>
          <select id="icon" name="icon">${iconOptions}</select>
        </div>
      </div>
      <div class="field">
        <label for="url">URL</label>
        <input id="url" name="url" type="url" required maxlength="2000" placeholder="https://" />
      </div>
      <div class="field">
        <label class="check-row">
          <input type="checkbox" name="enabled" value="1" checked />
          Enabled
        </label>
      </div>
      <div class="row-actions">
        <button class="btn" type="submit">Add link</button>
      </div>
    </form>
  </section>`;
}

export function renderDataPanel(csrf: string, message?: string): string {
  return `
  <section class="panel">
    <h2>Data · Import / Export</h2>
    ${flash(message)}
    <p class="hint" style="color:var(--text-secondary);font-size:0.9rem;margin:0 0 14px">
      Export a full JSON backup of profile, links, settings, and analytics. Import overwrites existing keys.
    </p>
    <div class="row-actions">
      <a class="btn btn-secondary" href="/admin/export">Export JSON</a>
    </div>
    <hr class="sep" />
    <form method="post" action="/admin/import">
      ${csrfField(csrf)}
      <div class="field">
        <label for="json">Import JSON</label>
        <textarea id="json" name="json" required placeholder='{"profile":{...},"links":[...],"settings":{...}}'></textarea>
      </div>
      <div class="row-actions">
        <button class="btn" type="submit">Import</button>
      </div>
    </form>
  </section>`;
}

export function renderStats(analytics: Analytics): string {
  const clickTotal = Object.values(analytics.linkClicks).reduce((a, b) => a + b, 0);
  return `
  <section class="panel">
    <h2>Analytics</h2>
    <p class="hint" style="color:var(--text-muted);font-size:0.8rem;margin:0 0 12px">
      Counters use split KV keys with short retries. Under concurrent traffic, counts are
      <strong>eventually consistent</strong> and may slightly under-count. For strict accuracy, migrate to a Durable Object.
    </p>
    <div class="stats">
      <div class="stat">
        <div class="label">Page views</div>
        <div class="value">${analytics.pageViews}</div>
      </div>
      <div class="stat">
        <div class="label">Link clicks</div>
        <div class="value">${clickTotal}</div>
      </div>
      <div class="stat">
        <div class="label">Last updated</div>
        <div class="value" style="font-size:0.95rem;margin-top:10px">${escapeHtml(analytics.lastUpdated || "—")}</div>
      </div>
    </div>
  </section>`;
}

function option(value: string, label: string, selected: string): string {
  const sel = value === selected ? " selected" : "";
  return `<option value="${escapeHtml(value)}"${sel}>${escapeHtml(label)}</option>`;
}

function flash(message?: string): string {
  if (!message) return "";
  const isError = message.startsWith("error:");
  const text = isError ? message.slice(6) : message.startsWith("ok:") ? message.slice(3) : message;
  const cls = isError ? "alert alert-error" : "alert alert-success";
  return `<div class="${cls}">${escapeHtml(text)}</div>`;
}
