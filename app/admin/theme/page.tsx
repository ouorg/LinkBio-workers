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

export const dynamic = "force-dynamic";

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

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <AdminNav active="theme" siteName={env.SITE_NAME || "LinkBio"} csrf={csrf} t={t} />
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{t("admin.page.theme")}</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.theme.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Flash message={sp.msg} />
          <form action={saveSettingsAction} className="space-y-4">
            <input type="hidden" name={CSRF_FIELD} value={csrf} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="theme">{t("admin.theme.theme")}</Label>
                <select
                  id="theme"
                  name="theme"
                  defaultValue={settings.theme}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                >
                  <option value="default">{t("admin.theme.themeDefault")}</option>
                  <option value="minimal">{t("admin.theme.themeMinimal")}</option>
                  <option value="glass">{t("admin.theme.themeGlass")}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accentColor">{t("admin.theme.accent")}</Label>
                <Input
                  id="accentColor"
                  name="accentColor"
                  defaultValue={settings.accentColor}
                  pattern="#[0-9a-fA-F]{3,8}"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="background">{t("admin.theme.background")}</Label>
              <Input id="background" name="background" type="url" defaultValue={settings.background} />
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
