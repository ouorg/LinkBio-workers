/**
 * Dynamic color palette generator for LinkBio themes.
 *
 * Generates Material-You-style color schemes from a single seed hex,
 * and produces CSS variable strings that can be injected at runtime
 * to override theme tokens without modifying the theme CSS files.
 */

export type ColorScheme = {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
};

/** Convert hex to HSL object. */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const sanitized = hex.replace("#", "");
  let full = sanitized;
  if (sanitized.length === 3) {
    full = sanitized
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/** Convert HSL to HSL channel string (no hsl() wrapper). */
export function hslChannel(h: number, s: number, l: number): string {
  return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
}

/** Generate a full color scheme from a seed hex. */
export function generateColorScheme(seedHex: string): ColorScheme {
  const base = hexToHsl(seedHex);

  const primary = { ...base };
  const primaryForeground = { h: base.h, s: 0, l: 100 };

  const secondary = { h: base.h, s: Math.max(10, base.s - 20), l: Math.max(5, base.l - 5) };
  const secondaryForeground = { h: base.h, s: Math.min(40, base.s), l: 12 };

  const muted = { h: base.h, s: 10, l: 92 };
  const mutedForeground = { h: base.h, s: 10, l: 45 };

  const accent = { h: base.h, s: Math.min(40, base.s + 10), l: 94 };
  const accentForeground = { h: base.h, s: Math.min(60, base.s), l: 28 };

  const background = { h: base.h, s: 10, l: 98 };
  const foreground = { h: base.h, s: 20, l: 6 };

  const card = { h: base.h, s: 0, l: 100 };
  const cardForeground = { h: base.h, s: 20, l: 6 };

  const popover = { h: base.h, s: 0, l: 100 };
  const popoverForeground = { h: base.h, s: 20, l: 6 };

  const border = { h: base.h, s: 15, l: 90 };
  const input = { h: base.h, s: 15, l: 90 };

  const ring = { ...base };
  const destructive = { h: 0, s: 84, l: 60 };

  return {
    primary: hslChannel(primary.h, primary.s, primary.l),
    primaryForeground: hslChannel(primaryForeground.h, primaryForeground.s, primaryForeground.l),
    secondary: hslChannel(secondary.h, secondary.s, secondary.l),
    secondaryForeground: hslChannel(secondaryForeground.h, secondaryForeground.s, secondaryForeground.l),
    muted: hslChannel(muted.h, muted.s, muted.l),
    mutedForeground: hslChannel(mutedForeground.h, mutedForeground.s, mutedForeground.l),
    accent: hslChannel(accent.h, accent.s, accent.l),
    accentForeground: hslChannel(accentForeground.h, accentForeground.s, accentForeground.l),
    background: hslChannel(background.h, background.s, background.l),
    foreground: hslChannel(foreground.h, foreground.s, foreground.l),
    card: hslChannel(card.h, card.s, card.l),
    cardForeground: hslChannel(cardForeground.h, cardForeground.s, cardForeground.l),
    popover: hslChannel(popover.h, popover.s, popover.l),
    popoverForeground: hslChannel(popoverForeground.h, popoverForeground.s, popoverForeground.l),
    border: hslChannel(border.h, border.s, border.l),
    input: hslChannel(input.h, input.s, input.l),
    ring: hslChannel(ring.h, ring.s, ring.l),
    destructive: hslChannel(destructive.h, destructive.s, destructive.l),
  };
}

/** Generate a dark variant of the color scheme. */
export function generateDarkColorScheme(seedHex: string): ColorScheme {
  const base = hexToHsl(seedHex);

  const primary = { h: base.h, s: Math.min(80, base.s + 10), l: 70 };
  const primaryForeground = { h: base.h, s: 0, l: 100 };

  const secondary = { h: base.h, s: 10, l: 14 };
  const secondaryForeground = { h: base.h, s: 0, l: 98 };

  const muted = { h: base.h, s: 10, l: 12 };
  const mutedForeground = { h: base.h, s: 10, l: 60 };

  const accent = { h: base.h, s: 20, l: 14 };
  const accentForeground = { h: base.h, s: Math.min(60, base.s), l: 80 };

  const background = { h: base.h, s: 15, l: 4 };
  const foreground = { h: base.h, s: 10, l: 96 };

  const card = { h: base.h, s: 10, l: 6 };
  const cardForeground = { h: base.h, s: 0, l: 96 };

  const popover = { h: base.h, s: 10, l: 8 };
  const popoverForeground = { h: base.h, s: 0, l: 96 };

  const border = { h: base.h, s: 10, l: 14 };
  const input = { h: base.h, s: 10, l: 14 };

  const ring = { ...primary };
  const destructive = { h: 0, s: 72, l: 51 };

  return {
    primary: hslChannel(primary.h, primary.s, primary.l),
    primaryForeground: hslChannel(primaryForeground.h, primaryForeground.s, primaryForeground.l),
    secondary: hslChannel(secondary.h, secondary.s, secondary.l),
    secondaryForeground: hslChannel(secondaryForeground.h, secondaryForeground.s, secondaryForeground.l),
    muted: hslChannel(muted.h, muted.s, muted.l),
    mutedForeground: hslChannel(mutedForeground.h, mutedForeground.s, mutedForeground.l),
    accent: hslChannel(accent.h, accent.s, accent.l),
    accentForeground: hslChannel(accentForeground.h, accentForeground.s, accentForeground.l),
    background: hslChannel(background.h, background.s, background.l),
    foreground: hslChannel(foreground.h, foreground.s, foreground.l),
    card: hslChannel(card.h, card.s, card.l),
    cardForeground: hslChannel(cardForeground.h, cardForeground.s, cardForeground.l),
    popover: hslChannel(popover.h, popover.s, popover.l),
    popoverForeground: hslChannel(popoverForeground.h, popoverForeground.s, popoverForeground.l),
    border: hslChannel(border.h, border.s, border.l),
    input: hslChannel(input.h, input.s, input.l),
    ring: hslChannel(ring.h, ring.s, ring.l),
    destructive: hslChannel(destructive.h, destructive.s, destructive.l),
  };
}

/** Default "system accent" seed used when themeColorMode is "system". */
export const SYSTEM_ACCENT_SEED = "#6366f1";

/** Resolve the seed hex from settings and the resolved luminance mode. */
export function resolveColorSeed(
  themeColorMode: "default" | "system" | "custom",
  customColor: string,
): string | null {
  if (themeColorMode === "default") return null;
  if (themeColorMode === "custom") return /^#[0-9a-fA-F]{3,8}$/.test(customColor) ? customColor : SYSTEM_ACCENT_SEED;
  return SYSTEM_ACCENT_SEED;
}

function schemeToCss(scheme: ColorScheme, selector: string): string {
  return `${selector} {
  --primary: ${scheme.primary};
  --primary-foreground: ${scheme.primaryForeground};
  --secondary: ${scheme.secondary};
  --secondary-foreground: ${scheme.secondaryForeground};
  --muted: ${scheme.muted};
  --muted-foreground: ${scheme.mutedForeground};
  --accent: ${scheme.accent};
  --accent-foreground: ${scheme.accentForeground};
  --background: ${scheme.background};
  --foreground: ${scheme.foreground};
  --card: ${scheme.card};
  --card-foreground: ${scheme.cardForeground};
  --popover: ${scheme.popover};
  --popover-foreground: ${scheme.popoverForeground};
  --border: ${scheme.border};
  --input: ${scheme.input};
  --ring: ${scheme.ring};
  --destructive: ${scheme.destructive};
}`;
}

/** Build CSS that overrides theme tokens for a given seed and theme id. */
export function buildThemeColorOverrideCss(seedHex: string, themeId: string): string {
  const light = generateColorScheme(seedHex);
  const dark = generateDarkColorScheme(seedHex);
  const base = '[data-theme-id="' + themeId + '"]';
  const systemLight = schemeToCss(light, base + '[data-theme="system"]');
  const systemDark = schemeToCss(dark, base + '[data-theme="system"]');
  const parts = [
    '/* dynamic theme color override for ' + themeId + ' */',
    schemeToCss(light, base + '[data-theme="light"]'),
    schemeToCss(dark, base + '[data-theme="dark"]'),
    '@media (prefers-color-scheme: light) {',
    systemLight,
    '}',
    '@media (prefers-color-scheme: dark) {',
    systemDark,
    '}',
  ];
  return parts.join('\n');
}

/** Build CSS that overrides theme tokens for a given seed and color mode. */
export function buildDynamicColorCss(
  seedHex: string,
  options: { lightSelector?: string; darkSelector?: string } = {},
): string {
  const { lightSelector = ':root[data-dynamic-color="light"]', darkSelector = ':root[data-dynamic-color="dark"]' } = options;
  const light = generateColorScheme(seedHex);
  const dark = generateDarkColorScheme(seedHex);
  return `${schemeToCss(light, lightSelector)}
${schemeToCss(dark, darkSelector)}`;
}
