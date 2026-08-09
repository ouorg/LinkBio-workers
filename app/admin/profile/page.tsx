import { redirect } from "next/navigation";
import { Button } from "@cloudflare/kumo/components/button";
import { Input } from "@cloudflare/kumo/components/input";
import { InputArea } from "@cloudflare/kumo/components/input";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { ensureCsrfCookie, saveProfileAction } from "../actions";
import { AdminNav } from "@/components/admin/nav";
import { Flash } from "@/components/admin/flash";
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
        <h1 className="text-2xl font-semibold tracking-tight text-kumo-strong">
          {t("admin.page.profile")}
        </h1>
      </header>
      <LayerCard>
        <LayerCard.Secondary>{t("admin.profile.title")}</LayerCard.Secondary>
        <LayerCard.Primary>
          <Flash message={sp.msg} />
          <form action={saveProfileAction} className="space-y-4">
            <input type="hidden" name={CSRF_FIELD} value={csrf} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="name"
                name="name"
                label={t("admin.profile.name")}
                defaultValue={profile.name}
                required
                maxLength={80}
              />
              <Input
                id="username"
                name="username"
                label={t("admin.profile.username")}
                defaultValue={profile.username}
                maxLength={40}
                required={false}
              />
            </div>
            <InputArea
              id="bio"
              name="bio"
              label={t("admin.profile.bio")}
              defaultValue={profile.bio}
              maxLength={500}
              rows={4}
              required={false}
            />
            <Input
              id="avatar"
              name="avatar"
              type="url"
              label={t("admin.profile.avatar")}
              defaultValue={profile.avatar}
              maxLength={2000}
              required={false}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="location"
                name="location"
                label={t("admin.profile.location")}
                defaultValue={profile.location}
                maxLength={120}
                required={false}
              />
              <Input
                id="email"
                name="email"
                type="email"
                label={t("admin.profile.email")}
                defaultValue={profile.email}
                maxLength={120}
                required={false}
              />
            </div>
            <Button type="submit" variant="primary">
              {t("admin.profile.save")}
            </Button>
          </form>
        </LayerCard.Primary>
      </LayerCard>
    </div>
  );
}
