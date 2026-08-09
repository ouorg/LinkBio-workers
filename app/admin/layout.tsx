import { cookies } from "next/headers";
import { COLOR_COOKIE, parseColorMode } from "@/lib/prefs";

/**
 * Map site color preference to Kumo's data-mode (light | dark).
 * "system" follows prefers-color-scheme at runtime via a tiny inline script.
 */
function modeFromPref(pref: string | null | undefined): "light" | "dark" | "system" {
  if (pref === "light" || pref === "dark") return pref;
  return "system";
}

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  // CSRF is issued in middleware — never cookies().set during RSC render (Next 15 → 500).
  const jar = await cookies();
  const pref = parseColorMode(jar.get(COLOR_COOKIE)?.value);
  const mode = modeFromPref(pref);

  return (
    <div className="admin-kumo" data-mode={mode === "system" ? undefined : mode} data-admin-root>
      {mode === "system" ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var r=document.querySelector('[data-admin-root]');if(!r)return;var d=window.matchMedia('(prefers-color-scheme: dark)').matches;r.setAttribute('data-mode',d?'dark':'light');}catch(e){}})();`,
          }}
        />
      ) : null}
      {children}
    </div>
  );
}
