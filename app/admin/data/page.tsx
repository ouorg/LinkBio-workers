import { redirect } from "next/navigation";
import { Button, LinkButton } from "@cloudflare/kumo/components/button";
import { InputArea } from "@cloudflare/kumo/components/input";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { importDataAction } from "../actions";
import { AdminNav } from "@/components/admin/nav";
import { Flash } from "@/components/admin/flash";
import { isAdminSession } from "@/lib/auth";
import { getCsrfToken } from "@/lib/csrf";
import { getEnv, getStore } from "@/lib/env";
import { resolveAdminFlash } from "@/lib/flash";
import { createT } from "@/lib/i18n";
import { CSRF_FIELD } from "@/lib/security";

export const dynamic = "force-dynamic";

export default async function DataPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const store = await getStore();
  const env = await getEnv();
  const settings = await store.getSettings();
  const t = createT(settings.locale);
  const csrf = await getCsrfToken();
  const sp = await searchParams;
  const flash = await resolveAdminFlash(sp.msg);

  return (
    <div className="admin-shell">
      <AdminNav active="data" siteName={env.SITE_NAME || "LinkBio"} csrf={csrf} t={t} />
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-kumo-strong">
          {t("admin.page.data")}
        </h1>
      </header>
      <LayerCard>
        <LayerCard.Secondary>{t("admin.data.title")}</LayerCard.Secondary>
        <LayerCard.Primary>
          <div className="space-y-4">
            <Flash message={flash} />
            <p className="text-sm text-kumo-subtle">{t("admin.data.hint")}</p>
            <LinkButton href="/api/admin/export" variant="secondary">
              {t("admin.data.export")}
            </LinkButton>
            <form action={importDataAction} className="space-y-3">
              <input type="hidden" name={CSRF_FIELD} value={csrf} />
              <InputArea
                id="json"
                name="json"
                label={t("admin.data.importLabel")}
                required
                rows={8}
                className="font-mono text-xs"
                placeholder='{"profile":{...},"links":[...],"settings":{...}}'
              />
              <Button type="submit" variant="primary">
                {t("admin.data.import")}
              </Button>
            </form>
          </div>
        </LayerCard.Primary>
      </LayerCard>
    </div>
  );
}
