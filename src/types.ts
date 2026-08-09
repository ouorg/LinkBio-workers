/** Shared domain types for LinkBio-workers */

export interface Profile {
  name: string;
  username: string;
  bio: string;
  avatar: string;
  location: string;
  email: string;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: string;
  order: number;
  enabled: boolean;
}

/**
 * Footer behaviour on the public page:
 * - default: site name + /admin link (or footerText if set)
 * - custom: footerText only (falls back to default content if empty)
 * - auth_only: same content as default/custom, but only when admin is logged in
 * - off: never show footer (same as showFooter=false)
 */
export type FooterMode = "default" | "custom" | "auth_only" | "off";

export interface Settings {
  theme: string;
  darkMode: boolean;
  accentColor: string;
  background: string;
  /** Master switch; false hides footer regardless of footerMode */
  showFooter: boolean;
  /** How footer is rendered when showFooter is true */
  footerMode: FooterMode;
  /** Custom footer text (plain text; HTML-escaped). Empty → built-in default lines */
  footerText: string;
}

export interface Analytics {
  pageViews: number;
  linkClicks: Record<string, number>;
  lastUpdated: string;
}

export interface SiteData {
  profile: Profile;
  links: LinkItem[];
  settings: Settings;
  analytics: Analytics;
}

/** KV key names */
export const KV_KEYS = {
  PROFILE: "profile",
  LINKS: "links",
  SETTINGS: "settings",
  /** Legacy single-blob analytics (migrated on read) */
  ANALYTICS: "analytics",
  /** Split counters — fewer lost updates under concurrent writes */
  ANALYTICS_PV: "analytics:pv",
  ANALYTICS_CLICK_PREFIX: "analytics:click:",
  ANALYTICS_UPDATED: "analytics:updated",
  /** Login rate-limit: rate:login:<ip> */
  RATE_LOGIN_PREFIX: "rate:login:",
} as const;

export const DEFAULT_PROFILE: Profile = {
  name: "Your Name",
  username: "username",
  bio: "Write a short bio about yourself.",
  avatar: "",
  location: "",
  email: "",
};

export const DEFAULT_LINKS: LinkItem[] = [
  {
    id: "link-github",
    title: "GitHub",
    url: "https://github.com",
    icon: "github",
    order: 0,
    enabled: true,
  },
  {
    id: "link-website",
    title: "Website",
    url: "https://example.com",
    icon: "globe",
    order: 1,
    enabled: true,
  },
];

export const DEFAULT_SETTINGS: Settings = {
  theme: "default",
  darkMode: true,
  accentColor: "#6366f1",
  background: "",
  showFooter: true,
  footerMode: "default",
  footerText: "",
};

export const DEFAULT_ANALYTICS: Analytics = {
  pageViews: 0,
  linkClicks: {},
  lastUpdated: new Date(0).toISOString(),
};

export type SessionPayload = {
  sub: "admin";
  exp: number;
  iat: number;
};

/** Login rate limit defaults */
export const LOGIN_RATE_LIMIT = {
  /** Max failed attempts inside the window */
  maxFailures: 5,
  /** Window length in seconds */
  windowSeconds: 15 * 60,
} as const;
