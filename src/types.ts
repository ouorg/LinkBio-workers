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

export interface Settings {
  theme: string;
  darkMode: boolean;
  accentColor: string;
  background: string;
  showFooter: boolean;
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
  ANALYTICS: "analytics",
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
