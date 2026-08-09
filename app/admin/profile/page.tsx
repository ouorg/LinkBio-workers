import { redirect } from "next/navigation";
import { ensureCsrfCookie, saveProfileAction } from "../actions";
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

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const store = await getStore();
  const env = await getEnv();
  const [profile, settings] = await Promise.all([store.getProfile(), store.getSettings()]);
  const t = createT(settings.locale);
  const csrf = await ensureCsrfCookie();
  const sp = await searchParams;

  return (
    <div className="admin-shell">
      <AdminNav active="profile" siteName={env.SITE_NAME || "LinkBio"} csrf={csrf} t={t} />
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{t("admin.page.profile")}</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.profile.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Flash message={sp.msg} />
          <form action={saveProfileAction} className="space-y-4">
            <input type="hidden" name={CSRF_FIELD} value={csrf} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t("admin.profile.name")}</Label>
                <Input id="name" name="name" defaultValue={profile.name} required maxLength={80} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">{t("admin.profile.username")}</Label>
                <Input id="username" name="username" defaultValue={profile.username} maxLength={40} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">{t("admin.profile.bio")}</Label>
              <Textarea id="bio" name="bio" defaultValue={profile.bio} maxLength={500} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">{t("admin.profile.avatar")}</Label>
              <Input id="avatar" name="avatar" type="url" defaultValue={profile.avatar} maxLength={2000} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">{t("admin.profile.location")}</Label>
                <Input id="location" name="location" defaultValue={profile.location} maxLength={120} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("admin.profile.email")}</Label>
                <Input id="email" name="email" type="email" defaultValue={profile.email} maxLength={120} />
              </div>
            </div>
            <Button type="submit">{t("admin.profile.save")}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
