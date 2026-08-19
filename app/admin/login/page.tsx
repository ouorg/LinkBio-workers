import { redirect } from "next/navigation";
import { Input } from "@/components/base/field";
import { SubmitButton } from "@/components/base/submit-button";
import { loginAction } from "../actions";
import { Flash } from "@/components/admin/flash";
import { AdminPanel } from "@/components/admin/panel";
import { isAdminSession } from "@/lib/auth";
import { getAdminUi } from "@/lib/admin-ui";
import { getCsrfToken } from "@/lib/csrf";
import { resolveAdminFlash } from "@/lib/flash";
import { CSRF_FIELD } from "@/lib/security";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  if (await isAdminSession()) redirect("/admin");
  const { t, siteName } = await getAdminUi();
  const csrf = await getCsrfToken();
  const sp = await searchParams;
  const flash = await resolveAdminFlash(sp.msg);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 pt-16">
      <AdminPanel
        className="w-full max-w-md"
        title={
          <div className="space-y-1">
            <div className="text-base font-semibold text-admin-strong">{t("admin.login.title")}</div>
            <p className="text-sm font-normal text-admin-muted">
              {t("admin.login.sub", { siteName })}
            </p>
          </div>
        }
      >
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
          <SubmitButton type="submit" variant="primary" className="w-full" pendingLabel={t("admin.common.saving")}>
            {t("admin.login.submit")}
          </SubmitButton>
        </form>
      </AdminPanel>
    </div>
  );
}
