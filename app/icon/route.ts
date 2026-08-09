import { getStore } from "@/lib/env";

export const dynamic = "force-dynamic";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function firstLetter(name: string): string {
  const t = name.trim();
  if (!t) return "L";
  // Prefer first Unicode letter/number grapheme-ish: first code point
  return Array.from(t)[0]!.toUpperCase();
}

function svgCircleLetter(letter: string): string {
  const L = escapeXml(letter.slice(0, 2));
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="32" fill="#6366f1"/>
  <text x="32" y="33" dominant-baseline="middle" text-anchor="middle" fill="#ffffff"
    font-family="system-ui,-apple-system,Segoe UI,sans-serif" font-size="28" font-weight="600">${L}</text>
</svg>`;
}

function svgCircleAvatar(url: string): string {
  const href = escapeXml(url);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 64 64">
  <defs>
    <clipPath id="c"><circle cx="32" cy="32" r="32"/></clipPath>
  </defs>
  <circle cx="32" cy="32" r="32" fill="#6366f1"/>
  <image href="${href}" xlink:href="${href}" width="64" height="64" clip-path="url(#c)" preserveAspectRatio="xMidYMid slice"/>
</svg>`;
}

export async function GET() {
  let svg = svgCircleLetter("L");
  try {
    const store = await getStore();
    const profile = await store.getProfile();
    const avatar = (profile.avatar || "").trim();
    // Prefer https for favicon safety; allow http for local/dev avatars
    if (/^https?:\/\//i.test(avatar)) {
      svg = svgCircleAvatar(avatar);
    } else {
      svg = svgCircleLetter(firstLetter(profile.name || ""));
    }
  } catch {
    /* fallback letter L */
  }

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
