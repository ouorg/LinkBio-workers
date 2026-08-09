import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { COLOR_COOKIE, parseColorMode } from "@/lib/prefs";

export const metadata: Metadata = {
  title: "LinkBio",
  description: "Personal bio / digital card on Cloudflare Workers",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const colorFromCookie = parseColorMode(jar.get(COLOR_COOKIE)?.value);
  const dataTheme = colorFromCookie || "system";
  const colorScheme =
    dataTheme === "system" ? "light dark" : dataTheme === "light" ? "light" : "dark";

  return (
    <html lang="zh-CN" data-theme={dataTheme} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content={colorScheme} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('lb_color');if(m==='light'||m==='dark'||m==='system'){document.documentElement.setAttribute('data-theme',m);var meta=document.querySelector('meta[name="color-scheme"]');if(meta)meta.setAttribute('content',m==='system'?'light dark':m);}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
