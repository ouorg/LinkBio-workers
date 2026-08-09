import { redirect } from "next/navigation";
import { loginAction, ensureCsrfCookie } from "../actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAdminSession } from "@/lib/auth";
import { getEnv, getStore } from "@/lib/env";
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
  const raw = sp.msg || "";
  const msg = raw.startsWith("error:") ? raw.slice(6) : raw.startsWith("ok:") ? raw.slice(3) : raw;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("admin.login.title")}</CardTitle>
          <CardDescription>
            {t("admin.login.sub", { siteName: env.SITE_NAME || "LinkBio" })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {msg ? <Alert variant="destructive" className="mb-4">{msg}</Alert> : null}
          <form action={loginAction} className="space-y-4">
            <input type="hidden" name={CSRF_FIELD} value={csrf} />
            <div className="space-y-2">
              <Label htmlFor="password">{t("admin.login.password")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">{t("admin.login.hint")}</p>
            </div>
            <Button type="submit" className="w-full">
              {t("admin.login.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
