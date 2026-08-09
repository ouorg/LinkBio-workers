import { redirect } from "next/navigation";
import {
  addLinkAction,
  deleteLinkAction,
  ensureCsrfCookie,
  reorderLinkAction,
  toggleLinkAction,
} from "../actions";
import { AdminNav } from "@/components/admin/nav";
import { Flash } from "@/components/admin/flash";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { isAdminSession } from "@/lib/auth";
import { getEnv, getStore } from "@/lib/env";
import { createT } from "@/lib/i18n";
import { CSRF_FIELD } from "@/lib/security";

export const dynamic = "force-dynamic";

export default async function LinksPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const store = await getStore();
  const env = await getEnv();
  const [links, settings] = await Promise.all([store.getLinks(), store.getSettings()]);
  const t = createT(settings.locale);
  const csrf = await ensureCsrfCookie();
  const sp = await searchParams;
  const sorted = [...links].sort((a, b) => a.order - b.order);

  return (
    <div className="admin-shell">
      <AdminNav active="links" siteName={env.SITE_NAME || "LinkBio"} csrf={csrf} t={t} />
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{t("admin.page.links")}</h1>
      </header>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("admin.links.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Flash message={sp.msg} />
          {sorted.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("admin.links.empty")}</p>
          ) : (
            sorted.map((l) => (
              <div
                key={l.id}
                className="flex flex-col gap-3 rounded-xl border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-medium">
                    <span className="truncate">{l.title}</span>
                    <Badge variant={l.enabled ? "success" : "muted"}>
                      {l.enabled ? t("admin.links.badgeOn") : t("admin.links.badgeOff")}
                    </Badge>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {t("admin.links.meta", { url: l.url, icon: l.icon, order: l.order })}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  <form action={toggleLinkAction}>
                    <input type="hidden" name={CSRF_FIELD} value={csrf} />
                    <input type="hidden" name="id" value={l.id} />
                    <Button type="submit" size="sm" variant="secondary">
                      {l.enabled ? t("admin.links.disable") : t("admin.links.enable")}
                    </Button>
                  </form>
                  <form action={reorderLinkAction}>
                    <input type="hidden" name={CSRF_FIELD} value={csrf} />
                    <input type="hidden" name="id" value={l.id} />
                    <input type="hidden" name="dir" value={-1} />
                    <Button type="submit" size="sm" variant="secondary">
                      ↑
                    </Button>
                  </form>
                  <form action={reorderLinkAction}>
                    <input type="hidden" name={CSRF_FIELD} value={csrf} />
                    <input type="hidden" name="id" value={l.id} />
                    <input type="hidden" name="dir" value={1} />
                    <Button type="submit" size="sm" variant="secondary">
                      ↓
                    </Button>
                  </form>
                  <form action={deleteLinkAction}>
                    <input type="hidden" name={CSRF_FIELD} value={csrf} />
                    <input type="hidden" name="id" value={l.id} />
                    <Button type="submit" size="sm" variant="destructive">
                      {t("admin.links.delete")}
                    </Button>
                  </form>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("admin.links.add")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addLinkAction} className="space-y-4">
            <input type="hidden" name={CSRF_FIELD} value={csrf} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">{t("admin.links.fieldTitle")}</Label>
                <Input id="title" name="title" required maxLength={80} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">{t("admin.links.icon")}</Label>
                <Input id="icon" name="icon" defaultValue="link" maxLength={40} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">{t("admin.links.url")}</Label>
              <Input id="url" name="url" type="url" required maxLength={2000} placeholder="https://" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="enabled" value="1" defaultChecked />
              {t("admin.links.enabled")}
            </label>
            <Separator />
            <Button type="submit">{t("admin.links.submit")}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
