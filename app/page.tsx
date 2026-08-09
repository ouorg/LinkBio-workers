import { cookies, headers } from "next/headers";
import { ProfileCard } from "@/components/public/profile-card";
import { LinkList } from "@/components/public/link-list";
import { SiteFooter } from "@/components/public/site-footer";
import { ThemeToolbar } from "@/components/public/theme-toolbar";
import { isAdminSession } from "@/lib/auth";
import { getEnv, getStore } from "@/lib/env";
import { createT, htmlLang } from "@/lib/i18n";
import { resolveColorMode, resolveLocale } from "@/lib/prefs";
import { getTheme, resolveThemeId } from "@/lib/themes";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PublicPage() {
  const store = await getStore();
  const env = await getEnv();
  const siteName = env.SITE_NAME || "LinkBio";
  const [profile, links, settings] = await Promise.all([
    store.getProfile(),
    store.getLinks(),
    store.getSettings(),
  ]);

  void store.incrementPageViews();

  const jar = await cookies();
  const hdrs = await headers();
  const cookieHeader = jar
    .getAll()
    .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
    .join("; ");
  const colorMode = resolveColorMode(cookieHeader, settings.colorMode);
  const { pref: localePref, locale } = resolveLocale(
    cookieHeader,
    hdrs.get("accept-language") || undefined,
    settings.locale,
  );
  const themeId = resolveThemeId(settings.theme, env.DEFAULT_THEME);
  const theme = getTheme(themeId);
  const t = createT(locale);
  const isAdmin = await isAdminSession();

  const hasBg = Boolean(settings.background && /^https?:\/\//i.test(settings.background));
  const useGradient = Boolean(theme.features?.gradientBg) && !hasBg;

  return (
    <>
      {/*
        Use a real box (not display:contents) so [data-theme-id] descendant
        selectors in theme tokens.css apply reliably.
      */}
      <div
        lang={htmlLang(locale)}
        data-theme={colorMode}
        data-theme-id={themeId}
        className="min-h-screen bg-background text-foreground"
      >
        <ThemeToolbar
          colorMode={colorMode}
          localePref={localePref}
          labels={{
            color: t("public.toolbar.color"),
            system: t("public.toolbar.color.system"),
            light: t("public.toolbar.color.light"),
            dark: t("public.toolbar.color.dark"),
            locale: t("public.toolbar.locale"),
            auto: t("public.toolbar.locale.auto"),
            zh: t("public.toolbar.locale.zh"),
            en: t("public.toolbar.locale.en"),
          }}
        />
        <main
          className={cn("theme-page", useGradient && "theme-page--gradient")}
          style={
            hasBg
              ? {
                  backgroundImage: `linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.75)),url(${settings.background})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          <div className="theme-stack theme-card">
            <ProfileCard profile={profile} />
            <LinkList links={links} emptyLabel={t("public.emptyLinks")} />
            <SiteFooter
              settings={settings}
              siteName={siteName}
              isAdmin={isAdmin}
              defaultText={t("public.footer.site", { siteName })}
            />
          </div>
        </main>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.setAttribute('data-theme',${JSON.stringify(colorMode)});document.documentElement.setAttribute('data-theme-id',${JSON.stringify(themeId)});document.documentElement.lang=${JSON.stringify(htmlLang(locale))};`,
        }}
      />
    </>
  );
}
