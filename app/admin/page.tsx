import Link from "next/link";
import { redirect } from "next/navigation";
import { ensureCsrfCookie } from "./actions";
import { AdminNav } from "@/components/admin/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <h1 className="text-2xl font-semibold tracking-tight">{t("admin.page.overview")}</h1>
        <p className="text-sm text-muted-foreground">{t("admin.subtitle")}</p>
      </header>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin.stats.pageViews")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{analytics.pageViews}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin.stats.linkClicks")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{clicks}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin.stats.lastUpdated")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm font-medium">{analytics.lastUpdated || "—"}</CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("admin.overview.quickLinks")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link href="/admin/profile">{t("admin.overview.editProfile")}</Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/admin/links">{t("admin.overview.manageLinks")}</Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/admin/theme">{t("admin.overview.theme")}</Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/admin/data">{t("admin.overview.data")}</Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/" target="_blank">
              {t("admin.overview.viewPublic")}
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("admin.overview.currentProfile")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>{profile.name}</strong>
            {profile.username ? ` · @${profile.username}` : ""}
          </p>
          <p className="text-muted-foreground">{profile.bio}</p>
          <p className="text-muted-foreground">
            {t("admin.overview.enabledLinks", {
              count: links.filter((l) => l.enabled).length,
            })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
