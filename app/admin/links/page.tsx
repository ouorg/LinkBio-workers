import { redirect } from "next/navigation";
import { Badge } from "@cloudflare/kumo/components/badge";
import { Button } from "@cloudflare/kumo/components/button";
import { Input } from "@cloudflare/kumo/components/input";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import {
  addLinkAction,
  deleteLinkAction,
  ensureCsrfCookie,
  reorderLinkAction,
  toggleLinkAction,
} from "../actions";
import { AdminNav } from "@/components/admin/nav";
import { Flash } from "@/components/admin/flash";
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
        <h1 className="text-2xl font-semibold tracking-tight text-kumo-strong">
          {t("admin.page.links")}
        </h1>
      </header>
      <LayerCard className="mb-6">
        <LayerCard.Secondary>{t("admin.links.title")}</LayerCard.Secondary>
        <LayerCard.Primary>
          <div className="space-y-3">
            <Flash message={sp.msg} />
            {sorted.length === 0 ? (
              <p className="text-sm text-kumo-subtle">{t("admin.links.empty")}</p>
            ) : (
              sorted.map((l) => (
                <div
                  key={l.id}
                  className="flex flex-col gap-3 rounded-xl border border-kumo-hairline bg-kumo-base p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-medium text-kumo-default">
                      <span className="truncate">{l.title}</span>
                      <Badge variant={l.enabled ? "success" : "neutral"}>
                        {l.enabled ? t("admin.links.badgeOn") : t("admin.links.badgeOff")}
                      </Badge>
                    </div>
                    <p className="truncate text-xs text-kumo-subtle">
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
          </div>
        </LayerCard.Primary>
      </LayerCard>

      <LayerCard>
        <LayerCard.Secondary>{t("admin.links.add")}</LayerCard.Secondary>
        <LayerCard.Primary>
          <form action={addLinkAction} className="space-y-4">
            <input type="hidden" name={CSRF_FIELD} value={csrf} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="title"
                name="title"
                label={t("admin.links.fieldTitle")}
                required
                maxLength={80}
              />
              <Input
                id="icon"
                name="icon"
                label={t("admin.links.icon")}
                defaultValue="link"
                maxLength={40}
                required={false}
              />
            </div>
            <Input
              id="url"
              name="url"
              type="url"
              label={t("admin.links.url")}
              required
              maxLength={2000}
              placeholder="https://"
            />
            <label className="flex items-center gap-2 text-sm text-kumo-default">
              <input type="checkbox" name="enabled" value="1" defaultChecked className="size-4" />
              {t("admin.links.enabled")}
            </label>
            <div className="border-t border-kumo-hairline pt-4">
              <Button type="submit" variant="primary">
                {t("admin.links.submit")}
              </Button>
            </div>
          </form>
        </LayerCard.Primary>
      </LayerCard>
    </div>
  );
}
