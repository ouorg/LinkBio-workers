/**
 * Built-in link icons under public/icons/.
 * Add an icon: drop SVG as public/icons/{id}.svg and append a row here.
 */
export const BUILTIN_ICONS = [
  { id: "link", label: "Link", file: "/icons/link.svg" },
  { id: "website", label: "Website", file: "/icons/website.svg" },
  { id: "email", label: "Email", file: "/icons/email.svg" },
  { id: "github", label: "GitHub", file: "/icons/github.svg" },
  { id: "x", label: "X", file: "/icons/x.svg" },
  { id: "telegram", label: "Telegram", file: "/icons/telegram.svg" },
  { id: "discord", label: "Discord", file: "/icons/discord.svg" },
  { id: "youtube", label: "YouTube", file: "/icons/youtube.svg" },
  { id: "bilibili", label: "Bilibili", file: "/icons/bilibili.svg" },
  { id: "instagram", label: "Instagram", file: "/icons/instagram.svg" },
  { id: "linkedin", label: "LinkedIn", file: "/icons/linkedin.svg" },
  { id: "facebook", label: "Facebook", file: "/icons/facebook.svg" },
  { id: "reddit", label: "Reddit", file: "/icons/reddit.svg" },
  { id: "twitch", label: "Twitch", file: "/icons/twitch.svg" },
  { id: "tiktok", label: "TikTok", file: "/icons/tiktok.svg" },
  { id: "rss", label: "RSS", file: "/icons/rss.svg" },
  { id: "weibo", label: "Weibo", file: "/icons/weibo.svg" },
  { id: "xiaohongshu", label: "Xiaohongshu", file: "/icons/xiaohongshu.svg" },
] as const;

export type BuiltinIconId = (typeof BUILTIN_ICONS)[number]["id"];

const BY_ID = new Map(BUILTIN_ICONS.map((i) => [i.id, i]));

/** Legacy aliases stored in older data */
const ALIASES: Record<string, BuiltinIconId> = {
  globe: "website",
  mail: "email",
  twitter: "x",
};

export function isBuiltinIcon(id: string): boolean {
  const key = normalizeIconId(id);
  return BY_ID.has(key as BuiltinIconId);
}

export function normalizeIconId(id: string): string {
  const raw = (id || "").trim().toLowerCase();
  if (!raw) return "link";
  return ALIASES[raw] || raw;
}

/** Public URL for a built-in icon, or null if unknown. */
export function resolveIconUrl(id: string): string | null {
  const key = normalizeIconId(id);
  const hit = BY_ID.get(key as BuiltinIconId);
  if (hit) return hit.file;
  return null;
}

/**
 * Resolve display URL for a link icon field.
 * - built-in id → /icons/xxx.svg
 * - http(s) URL → as-is (custom remote)
 * - else → default link icon
 */
export function resolveLinkIconSrc(icon: string): string {
  const raw = (icon || "").trim();
  if (/^https?:\/\//i.test(raw)) return raw;
  return resolveIconUrl(raw) || "/icons/link.svg";
}

export function getBuiltinIcon(id: string) {
  return BY_ID.get(normalizeIconId(id) as BuiltinIconId) ?? null;
}
