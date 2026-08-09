import { redirect } from "next/navigation";
import { ensureCsrfCookie, saveSettingsAction } from "../actions";
import { AdminNav } from "@/components/admin/nav";
import { Flash } from "@/components/admin/flash";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { isAdminSession } from "@/lib/auth";
import { getEnv, getStore } from "@/lib/env";
import { createT } from "@/lib/i18n";
import { CSRF_FIELD } from "@/lib/security";
import { listThemes, resolveThemeId } from "@/lib/themes";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** Lightweight preview swatches (not loaded from CSS — admin-only hint) */
const PREVIEW: Record<string, { a: string; b: string; c: string }> = {
  base: { a: "hsl(239 84% 67%)", b: "hsl(240 5% 20%)", c: "hsl(240 5% 90%)" },
  minimal: { a: "hsl(240 6% 40%)", b: "hsl(0 0% 20%)", c: "hsl(0 0% 92%)" },
  /* Legacy Hono UI: indigo + near-black card */
  "hono-old": { a: "#6366f1", b: "#0a0a0b", c: "#18181b" },
  /* Anthropic illustration: clay + oat + ivory / near-black */
  anthropic: { a: "#D97757", b: "#E3DACC", c: "#FAF9F5" },
  /* Apple.com marketing (unofficial) */
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
  const csrf = await ensureCsrfCookie();
  const sp = await searchParams;
  const themes = listThemes();
  const currentThemeId = resolveThemeId(settings.theme, env.DEFAULT_THEME);
  const localeZh = settings.locale === "zh-CN";

  return (
    <div className="admin-shell" data-theme-id={currentThemeId}>
      <AdminNav active="theme" siteName={env.SITE_NAME || "LinkBio"} csrf={csrf} t={t} />
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{t("admin.page.theme")}</h1>
        <p className="text-sm text-muted-foreground">{t("admin.subtitle")}</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.theme.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Flash message={sp.msg} />
          <form action={saveSettingsAction} className="space-y-6">
            <input type="hidden" name={CSRF_FIELD} value={csrf} />

            <div className="space-y-3">
              <Label>{t("admin.theme.theme")}</Label>
              <p className="text-xs text-muted-foreground">
                DEFAULT_THEME={env.DEFAULT_THEME || "base"} · current={currentThemeId}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {themes.map((th) => {
                  const sw = PREVIEW[th.id] || PREVIEW.base!;
                  const title = localeZh ? th.nameZh : th.name;
                  return (
                    <label
                      key={th.id}
                      className={cn(
                        "cursor-pointer rounded-xl border p-3 transition",
                        "hover:border-primary/50",
                        currentThemeId === th.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                          : "border-border",
                      )}
                    >
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
                      <div className="text-sm font-medium">
                        {title}{" "}
                        <span className="font-mono text-xs text-muted-foreground">({th.id})</span>
                      </div>
                      {th.description ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">{th.description}</p>
                      ) : null}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="accentColor">{t("admin.theme.accent")}</Label>
                <Input
                  id="accentColor"
                  name="accentColor"
                  defaultValue={settings.accentColor}
                  pattern="#[0-9a-fA-F]{3,8}"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="background">{t("admin.theme.background")}</Label>
                <Input
                  id="background"
                  name="background"
                  type="url"
                  defaultValue={settings.background}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="colorMode">{t("admin.theme.colorMode")}</Label>
                <select
                  id="colorMode"
                  name="colorMode"
                  defaultValue={settings.colorMode}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                >
                  <option value="system">{t("admin.theme.colorMode.system")}</option>
                  <option value="light">{t("admin.theme.colorMode.light")}</option>
                  <option value="dark">{t("admin.theme.colorMode.dark")}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="locale">{t("admin.theme.locale")}</Label>
                <select
                  id="locale"
                  name="locale"
                  defaultValue={settings.locale}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                >
                  <option value="zh-CN">{t("admin.theme.locale.zhCN")}</option>
                  <option value="en">{t("admin.theme.locale.en")}</option>
                </select>
              </div>
            </div>
            <div className="space-y-3 rounded-xl border border-border p-4">
              <h2 className="font-medium">{t("admin.theme.footerTitle")}</h2>
              <p className="text-xs text-muted-foreground">{t("admin.theme.footerHint")}</p>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="showFooter"
                  value="1"
                  defaultChecked={settings.showFooter && settings.footerMode !== "off"}
                />
                {t("admin.theme.showFooter")}
              </label>
              <div className="space-y-2">
                <Label htmlFor="footerMode">{t("admin.theme.footerMode")}</Label>
                <select
                  id="footerMode"
                  name="footerMode"
                  defaultValue={settings.footerMode}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                >
                  <option value="default">{t("admin.theme.footerMode.default")}</option>
                  <option value="custom">{t("admin.theme.footerMode.custom")}</option>
                  <option value="auth_only">{t("admin.theme.footerMode.auth_only")}</option>
                  <option value="off">{t("admin.theme.footerMode.off")}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="footerText">{t("admin.theme.footerText")}</Label>
                <Textarea
                  id="footerText"
                  name="footerText"
                  defaultValue={settings.footerText}
                  maxLength={500}
                  placeholder={t("admin.theme.footerTextPlaceholder")}
                />
                <p className="text-xs text-muted-foreground">{t("admin.theme.footerTextHint")}</p>
              </div>
            </div>
            <Button type="submit">{t("admin.theme.save")}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
