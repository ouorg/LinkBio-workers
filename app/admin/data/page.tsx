import Link from "next/link";
import { redirect } from "next/navigation";
import { ensureCsrfCookie, importDataAction } from "../actions";
import { AdminNav } from "@/components/admin/nav";
import { Flash } from "@/components/admin/flash";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { isAdminSession } from "@/lib/auth";
import { getEnv, getStore } from "@/lib/env";
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
  const csrf = await ensureCsrfCookie();
  const sp = await searchParams;

  return (
    <div className="admin-shell">
      <AdminNav active="data" siteName={env.SITE_NAME || "LinkBio"} csrf={csrf} t={t} />
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{t("admin.page.data")}</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.data.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Flash message={sp.msg} />
          <p className="text-sm text-muted-foreground">{t("admin.data.hint")}</p>
          <Button asChild variant="secondary">
            <Link href="/api/admin/export">{t("admin.data.export")}</Link>
          </Button>
          <form action={importDataAction} className="space-y-3">
            <input type="hidden" name={CSRF_FIELD} value={csrf} />
            <div className="space-y-2">
              <Label htmlFor="json">{t("admin.data.importLabel")}</Label>
              <Textarea
                id="json"
                name="json"
                required
                className="min-h-[160px] font-mono text-xs"
                placeholder='{"profile":{...},"links":[...],"settings":{...}}'
              />
            </div>
            <Button type="submit">{t("admin.data.import")}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
