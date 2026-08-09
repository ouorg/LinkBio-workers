import { redirect } from "next/navigation";
import { Button } from "@cloudflare/kumo/components/button";
import { Input } from "@cloudflare/kumo/components/input";
import { InputArea } from "@cloudflare/kumo/components/input";
import { Label } from "@cloudflare/kumo/components/label";
import { saveSettingsAction } from "../actions";
import { AdminNav } from "@/components/admin/nav";
import { Flash } from "@/components/admin/flash";
import { AdminPanel } from "@/components/admin/panel";
import { isAdminSession } from "@/lib/auth";
import { getCsrfToken } from "@/lib/csrf";
import { getEnv, getStore } from "@/lib/env";
import { resolveAdminFlash } from "@/lib/flash";
import { createT, themeDescription } from "@/lib/i18n";
import { CSRF_FIELD } from "@/lib/security";
import { listThemes, resolveThemeId } from "@/lib/themes";

export const dynamic = "force-dynamic";

/** Lightweight preview swatches (not loaded from CSS — admin-only hint) */
const PREVIEW: Record<string, { a: string; b: string; c: string }> = {
  base: { a: "hsl(239 84% 67%)", b: "hsl(240 5% 20%)", c: "hsl(240 5% 90%)" },
  minimal: { a: "hsl(240 6% 40%)", b: "hsl(0 0% 20%)", c: "hsl(0 0% 92%)" },
  /* Legacy Hono UI: indigo + near-black card */
  "hono-old": { a: "#6366f1", b: "#0a0a0b", c: "#18181b" },
  /* Anthropic illustration: clay + oat + ivory / near-black */
  anthropic: { a: "#D97757", b: "#E3DACC", c: "#FAF9F5" },
  /* Apple.com marketing (unofficial): blue CTA + cool gray + white */
  apple: { a: "#0071e3", b: "#f5f5f7", c: "#ffffff" },
};

export default async function ThemePage({
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
  const themes = listThemes();
  const currentThemeId = resolveThemeId(settings.theme, env.DEFAULT_THEME);
  const localeZh = settings.locale === "zh-CN";

  return (
    <div className="admin-shell">
      <AdminNav active="theme" siteName={env.SITE_NAME || "LinkBio"} csrf={csrf} t={t} />
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-kumo-strong">
          {t("admin.page.theme")}
        </h1>
        <p className="text-sm text-kumo-subtle">{t("admin.subtitle")}</p>
      </header>
      <AdminPanel title={t("admin.theme.title")}>
          <Flash message={flash} />
          <form action={saveSettingsAction} className="space-y-6">
            <input type="hidden" name={CSRF_FIELD} value={csrf} />

            <div className="space-y-3">
              <Label>{t("admin.theme.theme")}</Label>
              <p className="text-xs text-kumo-subtle">
                DEFAULT_THEME={env.DEFAULT_THEME || "base"} · current={currentThemeId}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {themes.map((th) => {
                  const sw = PREVIEW[th.id] || PREVIEW.base!;
                  const title = localeZh ? th.nameZh : th.name;
                  const desc = themeDescription(t, th.id, th.description);
                  return (
                    <label key={th.id} className="admin-theme-card">
                      <input
                        type="radio"
                        name="theme"
                        value={th.id}
                        defaultChecked={currentThemeId === th.id}
                        className="sr-only"
                      />
                      <div className="mb-2 flex gap-1">
                        <span className="h-6 flex-1 rounded-md" style={{ background: sw.a }} />
                        <span className="h-6 flex-1 rounded-md" style={{ background: sw.b }} />
                        <span className="h-6 flex-1 rounded-md" style={{ background: sw.c }} />
                      </div>
                      <div className="text-sm font-medium text-kumo-default">
                        {title}{" "}
                        <span className="font-mono text-xs text-kumo-subtle">({th.id})</span>
                      </div>
                      {desc ? (
                        <p className="mt-0.5 text-xs text-kumo-subtle">{desc}</p>
                      ) : null}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="accentColor"
                name="accentColor"
                label={t("admin.theme.accent")}
                defaultValue={settings.accentColor}
                pattern="#[0-9a-fA-F]{3,8}"
                required={false}
              />
              <Input
                id="background"
                name="background"
                type="url"
                label={t("admin.theme.background")}
                defaultValue={settings.background}
                required={false}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("admin.theme.colorMode")}</Label>
                <select
                  id="colorMode"
                  name="colorMode"
                  defaultValue={settings.colorMode}
                  className="admin-select"
                >
                  <option value="system">{t("admin.theme.colorMode.system")}</option>
                  <option value="light">{t("admin.theme.colorMode.light")}</option>
                  <option value="dark">{t("admin.theme.colorMode.dark")}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t("admin.theme.locale")}</Label>
                <select
                  id="locale"
                  name="locale"
                  defaultValue={settings.locale}
                  className="admin-select"
                >
                  <option value="zh-CN">{t("admin.theme.locale.zhCN")}</option>
                  <option value="en">{t("admin.theme.locale.en")}</option>
                </select>
              </div>
            </div>
            <div className="space-y-3 rounded-xl border border-kumo-hairline p-4">
              <h2 className="font-medium text-kumo-strong">{t("admin.theme.footerTitle")}</h2>
              <p className="text-xs text-kumo-subtle">{t("admin.theme.footerHint")}</p>
              <label className="flex items-center gap-2 text-sm text-kumo-default">
                <input
                  type="checkbox"
                  name="showFooter"
                  value="1"
                  defaultChecked={settings.showFooter && settings.footerMode !== "off"}
                  className="size-4"
                />
                {t("admin.theme.showFooter")}
              </label>
              <div className="space-y-2">
                <Label>{t("admin.theme.footerMode")}</Label>
                <select
                  id="footerMode"
                  name="footerMode"
                  defaultValue={settings.footerMode}
                  className="admin-select"
                >
                  <option value="default">{t("admin.theme.footerMode.default")}</option>
                  <option value="custom">{t("admin.theme.footerMode.custom")}</option>
                  <option value="auth_only">{t("admin.theme.footerMode.auth_only")}</option>
                  <option value="off">{t("admin.theme.footerMode.off")}</option>
                </select>
              </div>
              <InputArea
                id="footerText"
                name="footerText"
                label={t("admin.theme.footerText")}
                defaultValue={settings.footerText}
                maxLength={500}
                placeholder={t("admin.theme.footerTextPlaceholder")}
                description={t("admin.theme.footerTextHint")}
                rows={3}
                required={false}
              />
            </div>
            <Button type="submit" variant="primary">
              {t("admin.theme.save")}
            </Button>
          </form>
      </AdminPanel>
    </div>
  );
}
