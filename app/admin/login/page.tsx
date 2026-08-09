import { redirect } from "next/navigation";
import { Button } from "@cloudflare/kumo/components/button";
import { Input } from "@cloudflare/kumo/components/input";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { loginAction, ensureCsrfCookie } from "../actions";
import { Flash } from "@/components/admin/flash";
import { isAdminSession } from "@/lib/auth";
import { getEnv, getStore } from "@/lib/env";
import { resolveAdminFlash } from "@/lib/flash";
import { createT } from "@/lib/i18n";
import { CSRF_FIELD } from "@/lib/security";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  if (await isAdminSession()) redirect("/admin");
  const store = await getStore();
  const env = await getEnv();
  const settings = await store.getSettings();
  const t = createT(settings.locale);
  const csrf = await ensureCsrfCookie();
  const sp = await searchParams;
  const flash = await resolveAdminFlash(sp.msg);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <LayerCard className="w-full max-w-md">
        <LayerCard.Secondary>
          <div className="space-y-1">
            <div className="text-base font-semibold text-kumo-strong">{t("admin.login.title")}</div>
            <p className="text-sm text-kumo-subtle">
              {t("admin.login.sub", { siteName: env.SITE_NAME || "LinkBio" })}
            </p>
          </div>
        </LayerCard.Secondary>
        <LayerCard.Primary>
          <Flash message={flash} />
          <form action={loginAction} className="space-y-4">
            <input type="hidden" name={CSRF_FIELD} value={csrf} />
            <Input
              id="password"
              name="password"
              type="password"
              label={t("admin.login.password")}
              description={t("admin.login.hint")}
              required
              autoComplete="current-password"
              autoFocus
            />
            <Button type="submit" variant="primary" className="w-full">
              {t("admin.login.submit")}
            </Button>
          </form>
        </LayerCard.Primary>
      </LayerCard>
    </div>
  );
}
