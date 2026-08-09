import { redirect } from "next/navigation";
import { LinkButton } from "@cloudflare/kumo/components/button";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { ensureCsrfCookie } from "./actions";
import { AdminNav } from "@/components/admin/nav";
import { isAdminSession } from "@/lib/auth";
import { getEnv, getStore } from "@/lib/env";
import { createT } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  if (!(await isAdminSession())) redirect("/admin/login");
  const store = await getStore();
  const env = await getEnv();
  const siteName = env.SITE_NAME || "LinkBio";
  const [profile, links, settings, analytics] = await Promise.all([
    store.getProfile(),
    store.getLinks(),
    store.getSettings(),
    store.getAnalytics(),
  ]);
  const t = createT(settings.locale);
  const csrf = await ensureCsrfCookie();
  const clicks = Object.values(analytics.linkClicks).reduce((a, b) => a + b, 0);

  return (
    <div className="admin-shell">
      <AdminNav active="overview" siteName={siteName} csrf={csrf} t={t} />
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-kumo-strong">
          {t("admin.page.overview")}
        </h1>
        <p className="text-sm text-kumo-subtle">{t("admin.subtitle")}</p>
      </header>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <LayerCard className="p-4">
          <p className="text-sm font-medium text-kumo-subtle">{t("admin.stats.pageViews")}</p>
          <p className="mt-1 text-3xl font-semibold text-kumo-strong">{analytics.pageViews}</p>
        </LayerCard>
        <LayerCard className="p-4">
          <p className="text-sm font-medium text-kumo-subtle">{t("admin.stats.linkClicks")}</p>
          <p className="mt-1 text-3xl font-semibold text-kumo-strong">{clicks}</p>
        </LayerCard>
        <LayerCard className="p-4">
          <p className="text-sm font-medium text-kumo-subtle">{t("admin.stats.lastUpdated")}</p>
          <p className="mt-1 text-sm font-medium text-kumo-default">
            {analytics.lastUpdated || "—"}
          </p>
        </LayerCard>
      </div>

      <LayerCard className="mb-6">
        <LayerCard.Secondary>{t("admin.overview.quickLinks")}</LayerCard.Secondary>
        <LayerCard.Primary>
          <div className="flex flex-wrap gap-2">
            <LinkButton href="/admin/profile" variant="secondary" size="sm">
              {t("admin.overview.editProfile")}
            </LinkButton>
            <LinkButton href="/admin/links" variant="secondary" size="sm">
              {t("admin.overview.manageLinks")}
            </LinkButton>
            <LinkButton href="/admin/theme" variant="secondary" size="sm">
              {t("admin.overview.theme")}
            </LinkButton>
            <LinkButton href="/admin/data" variant="secondary" size="sm">
              {t("admin.overview.data")}
            </LinkButton>
            <LinkButton href="/" target="_blank" rel="noopener noreferrer" variant="secondary" size="sm">
              {t("admin.overview.viewPublic")}
            </LinkButton>
          </div>
        </LayerCard.Primary>
      </LayerCard>

      <LayerCard>
        <LayerCard.Secondary>{t("admin.overview.currentProfile")}</LayerCard.Secondary>
        <LayerCard.Primary>
          <div className="space-y-2 text-sm">
            <p className="text-kumo-default">
              <strong className="text-kumo-strong">{profile.name}</strong>
              {profile.username ? ` · @${profile.username}` : ""}
            </p>
            <p className="text-kumo-subtle">{profile.bio}</p>
            <p className="text-kumo-subtle">
              {t("admin.overview.enabledLinks", {
                count: links.filter((l) => l.enabled).length,
              })}
            </p>
          </div>
        </LayerCard.Primary>
      </LayerCard>
    </div>
  );
}
