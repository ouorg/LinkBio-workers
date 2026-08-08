import { Hono } from "hono";
import type { AuthVariables } from "../middleware/auth";
import { requireAdmin } from "../middleware/auth";
import {
  buildCsrfCookie,
  CSRF_FIELD,
  generateCsrfToken,
  isSecureRequest,
  parseCsrfFromCookie,
  validateCsrf,
} from "../middleware/security";
import { renderAdminDashboard, renderLoginPage, type AdminPage } from "../admin/dashboard";
import {
  createStore,
  sanitizeLink,
  sanitizeProfile,
  sanitizeSettings,
} from "../services/kv";
import {
  buildClearSessionCookie,
  buildSessionCookie,
  constantTimeEqual,
  createSessionToken,
} from "../services/session";
import type { LinkItem } from "../types";
import { DEFAULT_SETTINGS } from "../types";

const admin = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

function ensureSecrets(c: { env: Env }): string | null {
  if (!c.env.ADMIN_PASSWORD) return "ADMIN_PASSWORD secret is not configured.";
  if (!c.env.SESSION_SECRET) return "SESSION_SECRET secret is not configured.";
  return null;
}

function siteName(env: Env): string {
  return env.SITE_NAME || "LinkBio";
}

/** Ensure a CSRF token exists; returns token + optional Set-Cookie to attach on Response. */
function withCsrf(c: {
  req: { header: (n: string) => string | undefined; url: string };
}): { token: string; setCookie?: string } {
  const existing = parseCsrfFromCookie(c.req.header("Cookie"));
  if (existing && existing.length >= 16) return { token: existing };
  const token = generateCsrfToken();
  return { token, setCookie: buildCsrfCookie(token, isSecureRequest(c)) };
}

function withSetCookie(res: Response, cookie?: string): Response {
  if (!cookie) return res;
  const out = new Response(res.body, res);
  out.headers.append("Set-Cookie", cookie);
  return out;
}

async function requireCsrf(c: {
  req: { header: (n: string) => string | undefined; parseBody: () => Promise<Record<string, string | File>> };
}): Promise<{ ok: true; body: Record<string, string> } | { ok: false; error: string }> {
  const body = await c.req.parseBody();
  const form: Record<string, string> = {};
  for (const [k, v] of Object.entries(body)) {
    if (typeof v === "string") form[k] = v;
  }
  const cookieToken = parseCsrfFromCookie(c.req.header("Cookie"));
  const formToken = form[CSRF_FIELD];
  if (!validateCsrf(cookieToken, formToken)) {
    return { ok: false, error: "Invalid CSRF token. Refresh and try again." };
  }
  return { ok: true, body: form };
}

// ── Login ─────────────────────────────────────────────────────

admin.get("/login", async (c) => {
  if (c.get("isAdmin")) return c.redirect("/admin");
  const store = createStore(c.env);
  const settings = await store.getSettings().catch(() => ({ ...DEFAULT_SETTINGS }));
  const csrf = withCsrf(c);
  const cfgError = ensureSecrets(c);
  return withSetCookie(
    renderLoginPage({
      siteName: siteName(c.env),
      settings,
      csrf: csrf.token,
      error: cfgError || undefined,
    }),
    csrf.setCookie,
  );
});

admin.post("/login", async (c) => {
  const store = createStore(c.env);
  const settings = await store.getSettings().catch(() => ({ ...DEFAULT_SETTINGS }));
  const csrf = withCsrf(c);
  const cfgError = ensureSecrets(c);
  if (cfgError) {
    return withSetCookie(
      renderLoginPage({ siteName: siteName(c.env), settings, csrf: csrf.token, error: cfgError }),
      csrf.setCookie,
    );
  }

  const checked = await requireCsrf(c);
  if (!checked.ok) {
    return withSetCookie(
      renderLoginPage({ siteName: siteName(c.env), settings, csrf: csrf.token, error: checked.error }),
      csrf.setCookie,
    );
  }

  const password = checked.body.password || "";
  const ok = await constantTimeEqual(password, c.env.ADMIN_PASSWORD);
  if (!ok) {
    return withSetCookie(
      renderLoginPage({
        siteName: siteName(c.env),
        settings,
        csrf: csrf.token,
        error: "Incorrect password.",
      }),
      csrf.setCookie,
    );
  }

  const token = await createSessionToken(c.env.SESSION_SECRET);
  const secure = isSecureRequest(c);
  // Use append so both session + CSRF cookies are set (Set-Cookie is multi-valued)
  const res = c.redirect("/admin", 302);
  res.headers.append("Set-Cookie", buildSessionCookie(token, secure));
  res.headers.append("Set-Cookie", buildCsrfCookie(generateCsrfToken(), secure));
  return res;
});

admin.get("/logout", async (c) => {
  const secure = isSecureRequest(c);
  const res = c.redirect("/admin/login", 302);
  res.headers.append("Set-Cookie", buildClearSessionCookie(secure));
  return res;
});

// ── Authenticated pages ───────────────────────────────────────

const authed = new Hono<{ Bindings: Env; Variables: AuthVariables }>();
authed.use("*", requireAdmin);

async function page(
  c: {
    env: Env;
    req: { header: (n: string) => string | undefined; url: string; query: (k: string) => string | undefined };
  },
  which: AdminPage,
  message?: string,
) {
  const store = createStore(c.env);
  const [profile, links, settings, analytics] = await Promise.all([
    store.getProfile(),
    store.getLinks(),
    store.getSettings(),
    store.getAnalytics(),
  ]);
  const csrf = withCsrf(c);
  const msg = message ?? c.req.query("msg");
  return withSetCookie(
    renderAdminDashboard({
      siteName: siteName(c.env),
      settings,
      profile,
      links,
      analytics,
      csrf: csrf.token,
      page: which,
      message: msg,
    }),
    csrf.setCookie,
  );
}

authed.get("/", (c) => page(c, "overview"));
authed.get("/profile", (c) => page(c, "profile"));
authed.get("/links", (c) => page(c, "links"));
authed.get("/theme", (c) => page(c, "theme"));
authed.get("/data", (c) => page(c, "data"));

authed.get("/export", async (c) => {
  const store = createStore(c.env);
  const data = await store.exportAll();
  return c.json(data, 200, {
    "Content-Disposition": 'attachment; filename="linkbio-backup.json"',
  });
});

// ── Form posts ────────────────────────────────────────────────

authed.post("/profile", async (c) => {
  const checked = await requireCsrf(c);
  if (!checked.ok) return c.redirect(`/admin/profile?msg=${encodeURIComponent("error:" + checked.error)}`);
  const b = checked.body;
  const store = createStore(c.env);
  await store.setProfile(
    sanitizeProfile({
      name: b.name,
      username: b.username,
      bio: b.bio,
      avatar: b.avatar,
      location: b.location,
      email: b.email,
    }),
  );
  return c.redirect("/admin/profile?msg=" + encodeURIComponent("ok:Profile saved."));
});

authed.post("/settings", async (c) => {
  const checked = await requireCsrf(c);
  if (!checked.ok) return c.redirect(`/admin/theme?msg=${encodeURIComponent("error:" + checked.error)}`);
  const b = checked.body;
  const store = createStore(c.env);
  await store.setSettings(
    sanitizeSettings({
      theme: b.theme,
      accentColor: b.accentColor,
      background: b.background,
      darkMode: b.darkMode === "1",
      showFooter: b.showFooter === "1",
    }),
  );
  return c.redirect("/admin/theme?msg=" + encodeURIComponent("ok:Theme saved."));
});

authed.post("/links", async (c) => {
  const checked = await requireCsrf(c);
  if (!checked.ok) return c.redirect(`/admin/links?msg=${encodeURIComponent("error:" + checked.error)}`);
  const b = checked.body;
  const store = createStore(c.env);
  const links = await store.getLinks();
  const maxOrder = links.reduce((m, l) => Math.max(m, l.order), -1);
  const item = sanitizeLink(
    {
      id: crypto.randomUUID(),
      title: b.title,
      url: b.url,
      icon: b.icon,
      order: maxOrder + 1,
      enabled: b.enabled === "1",
    },
    maxOrder + 1,
  );
  if (!item.url) {
    return c.redirect("/admin/links?msg=" + encodeURIComponent("error:Invalid URL. Use http(s) only."));
  }
  links.push(item);
  await store.setLinks(links);
  return c.redirect("/admin/links?msg=" + encodeURIComponent("ok:Link added."));
});

authed.post("/links/:id/delete", async (c) => {
  const checked = await requireCsrf(c);
  if (!checked.ok) return c.redirect(`/admin/links?msg=${encodeURIComponent("error:" + checked.error)}`);
  const id = c.req.param("id");
  const store = createStore(c.env);
  const links = (await store.getLinks()).filter((l) => l.id !== id);
  await store.setLinks(links.map((l, i) => ({ ...l, order: i })));
  return c.redirect("/admin/links?msg=" + encodeURIComponent("ok:Link deleted."));
});

authed.post("/links/:id/toggle", async (c) => {
  const checked = await requireCsrf(c);
  if (!checked.ok) return c.redirect(`/admin/links?msg=${encodeURIComponent("error:" + checked.error)}`);
  const id = c.req.param("id");
  const store = createStore(c.env);
  const links = await store.getLinks();
  const next = links.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l));
  await store.setLinks(next);
  return c.redirect("/admin/links?msg=" + encodeURIComponent("ok:Link updated."));
});

authed.post("/links/:id/up", async (c) => {
  const checked = await requireCsrf(c);
  if (!checked.ok) return c.redirect(`/admin/links?msg=${encodeURIComponent("error:" + checked.error)}`);
  return reorder(c, c.req.param("id"), -1);
});

authed.post("/links/:id/down", async (c) => {
  const checked = await requireCsrf(c);
  if (!checked.ok) return c.redirect(`/admin/links?msg=${encodeURIComponent("error:" + checked.error)}`);
  return reorder(c, c.req.param("id"), 1);
});

async function reorder(
  c: { env: Env; redirect: (u: string) => Response },
  id: string,
  dir: -1 | 1,
): Promise<Response> {
  const store = createStore(c.env);
  const links = (await store.getLinks()).sort((a, b) => a.order - b.order);
  const idx = links.findIndex((l) => l.id === id);
  if (idx < 0) return c.redirect("/admin/links");
  const swap = idx + dir;
  if (swap < 0 || swap >= links.length) return c.redirect("/admin/links");
  const tmp = links[idx]!;
  links[idx] = links[swap]!;
  links[swap] = tmp;
  const normalized: LinkItem[] = links.map((l, i) => ({ ...l, order: i }));
  await store.setLinks(normalized);
  return c.redirect("/admin/links?msg=" + encodeURIComponent("ok:Order updated."));
}

authed.post("/import", async (c) => {
  const checked = await requireCsrf(c);
  if (!checked.ok) return c.redirect(`/admin/data?msg=${encodeURIComponent("error:" + checked.error)}`);
  const raw = checked.body.json || "";
  try {
    const data = JSON.parse(raw) as Record<string, unknown>;
    const store = createStore(c.env);
    await store.importAll({
      profile: data.profile as never,
      links: data.links as never,
      settings: data.settings as never,
      analytics: data.analytics as never,
    });
    return c.redirect("/admin/data?msg=" + encodeURIComponent("ok:Import successful."));
  } catch {
    return c.redirect("/admin/data?msg=" + encodeURIComponent("error:Invalid JSON."));
  }
});

admin.route("/", authed);

export { admin };
