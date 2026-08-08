import { Hono } from "hono";
import { htmlResponse, renderLayout } from "../components/layout";
import { renderLinks } from "../components/links";
import { renderProfileBlock } from "../components/profile";
import { escapeHtml } from "../middleware/security";
import { createStore } from "../services/kv";
import type { AuthVariables } from "../middleware/auth";

const publicRoutes = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

/** Public bio page */
publicRoutes.get("/", async (c) => {
  const store = createStore(c.env);
  const siteName = c.env.SITE_NAME || "LinkBio";
  const [profile, links, settings] = await Promise.all([
    store.getProfile(),
    store.getLinks(),
    store.getSettings(),
  ]);

  // Fire-and-forget analytics (do not block TTFB on KV write)
  c.executionCtx.waitUntil(store.incrementPageViews());

  const bgStyle =
    settings.background && /^https?:\/\//i.test(settings.background)
      ? ` style="background-image:linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.75)),url('${escapeHtml(settings.background)}')"`
      : "";

  const pageClass = settings.background ? "page page--bg" : "page";

  const footer = settings.showFooter
    ? `<footer class="footer">
        <div>${escapeHtml(siteName)}</div>
        <div style="margin-top:4px"><a href="/admin">Admin</a></div>
      </footer>`
    : "";

  const html = renderLayout({
    title: `${profile.name || siteName} · ${siteName}`,
    siteName,
    settings,
    children: `
    <main class="${pageClass}"${bgStyle}>
      <div class="card">
        ${renderProfileBlock(profile)}
        ${renderLinks(links)}
      </div>
      ${footer}
    </main>
    <script>
      document.querySelectorAll('a[data-link-id]').forEach(function(a){
        a.addEventListener('click', function(){
          var id = a.getAttribute('data-link-id');
          if (!id) return;
          try {
            navigator.sendBeacon('/api/click', JSON.stringify({ id: id }));
          } catch (e) {
            fetch('/api/click', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id }), keepalive: true });
          }
        });
      });
    </script>`,
  });

  return htmlResponse(html);
});

/** Health check for deploys / uptime */
publicRoutes.get("/health", (c) =>
  c.json({
    ok: true,
    service: "linkbio-workers",
    site: c.env.SITE_NAME || "LinkBio",
  }),
);

/** robots.txt */
publicRoutes.get("/robots.txt", (c) => {
  return c.text("User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n", 200, {
    "Content-Type": "text/plain; charset=utf-8",
  });
});

export { publicRoutes };
