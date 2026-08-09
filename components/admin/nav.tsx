import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { CSRF_FIELD } from "@/lib/security";
import type { TranslateFn } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", key: "overview" as const },
  { href: "/admin/profile", key: "profile" as const },
  { href: "/admin/links", key: "links" as const },
  { href: "/admin/theme", key: "theme" as const },
  { href: "/admin/data", key: "data" as const },
];

export function AdminNav({
  active,
  siteName,
  csrf,
  t,
}: {
  active: string;
  siteName: string;
  csrf: string;
  t: TranslateFn;
}) {
  return (
    <nav className="admin-nav">
      <div className="min-w-0 shrink">
        <div className="truncate text-sm font-semibold tracking-tight">
          {t("admin.brand")}
          <span className="ml-2 font-normal text-muted-foreground">{siteName}</span>
        </div>
      </div>
      <div className="admin-nav-links">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex items-center rounded-lg px-3 py-1.5 text-sm transition-colors",
              active === item.key
                ? "bg-primary/15 font-medium text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {t(`admin.nav.${item.key}`)}
          </Link>
        ))}
        <Link
          href="/"
          className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {t("admin.nav.public")}
        </Link>
        <form action={logoutAction} className="inline-flex">
          <input type="hidden" name={CSRF_FIELD} value={csrf} />
          <Button type="submit" variant="ghost" size="sm" className="text-destructive">
            {t("admin.nav.logout")}
          </Button>
        </form>
      </div>
    </nav>
  );
}
