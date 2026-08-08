import {
  DEFAULT_ANALYTICS,
  DEFAULT_LINKS,
  DEFAULT_PROFILE,
  DEFAULT_SETTINGS,
  KV_KEYS,
  type Analytics,
  type LinkItem,
  type Profile,
  type Settings,
  type SiteData,
} from "../types";

/**
 * Typed KV helpers for BIO_KV.
 * All reads fall back to safe defaults so a fresh namespace works immediately.
 */
export class BioStore {
  constructor(private readonly kv: KVNamespace) {}

  async getProfile(): Promise<Profile> {
    return (await this.getJson<Profile>(KV_KEYS.PROFILE)) ?? { ...DEFAULT_PROFILE };
  }

  async setProfile(profile: Profile): Promise<void> {
    await this.kv.put(KV_KEYS.PROFILE, JSON.stringify(profile));
  }

  async getLinks(): Promise<LinkItem[]> {
    const links = await this.getJson<LinkItem[]>(KV_KEYS.LINKS);
    if (!links) return DEFAULT_LINKS.map((l) => ({ ...l }));
    return links.sort((a, b) => a.order - b.order);
  }

  async setLinks(links: LinkItem[]): Promise<void> {
    const normalized = links
      .map((l, i) => ({ ...l, order: typeof l.order === "number" ? l.order : i }))
      .sort((a, b) => a.order - b.order);
    await this.kv.put(KV_KEYS.LINKS, JSON.stringify(normalized));
  }

  async getSettings(): Promise<Settings> {
    return (await this.getJson<Settings>(KV_KEYS.SETTINGS)) ?? { ...DEFAULT_SETTINGS };
  }

  async setSettings(settings: Settings): Promise<void> {
    await this.kv.put(KV_KEYS.SETTINGS, JSON.stringify(settings));
  }

  async getAnalytics(): Promise<Analytics> {
    return (await this.getJson<Analytics>(KV_KEYS.ANALYTICS)) ?? { ...DEFAULT_ANALYTICS };
  }

  async setAnalytics(analytics: Analytics): Promise<void> {
    await this.kv.put(KV_KEYS.ANALYTICS, JSON.stringify(analytics));
  }

  async getAll(): Promise<SiteData> {
    const [profile, links, settings, analytics] = await Promise.all([
      this.getProfile(),
      this.getLinks(),
      this.getSettings(),
      this.getAnalytics(),
    ]);
    return { profile, links, settings, analytics };
  }

  async exportAll(): Promise<SiteData> {
    return this.getAll();
  }

  async importAll(data: Partial<SiteData>): Promise<void> {
    const ops: Promise<void>[] = [];
    if (data.profile) ops.push(this.setProfile(sanitizeProfile(data.profile)));
    if (data.links) ops.push(this.setLinks(data.links.map(sanitizeLink)));
    if (data.settings) ops.push(this.setSettings(sanitizeSettings(data.settings)));
    if (data.analytics) ops.push(this.setAnalytics(sanitizeAnalytics(data.analytics)));
    await Promise.all(ops);
  }

  async incrementPageViews(): Promise<void> {
    const analytics = await this.getAnalytics();
    analytics.pageViews += 1;
    analytics.lastUpdated = new Date().toISOString();
    await this.setAnalytics(analytics);
  }

  async incrementLinkClick(linkId: string): Promise<void> {
    const analytics = await this.getAnalytics();
    analytics.linkClicks[linkId] = (analytics.linkClicks[linkId] ?? 0) + 1;
    analytics.lastUpdated = new Date().toISOString();
    await this.setAnalytics(analytics);
  }

  private async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.kv.get(key, "text");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }
}

export function createStore(env: Env): BioStore {
  return new BioStore(env.BIO_KV);
}

// ── Sanitizers (defense in depth for imports / API) ─────────────

function str(v: unknown, max = 500): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

export function sanitizeProfile(input: Partial<Profile>): Profile {
  return {
    name: str(input.name, 80) || DEFAULT_PROFILE.name,
    username: str(input.username, 40).replace(/[^a-zA-Z0-9._-]/g, "") || DEFAULT_PROFILE.username,
    bio: str(input.bio, 500) || "",
    avatar: str(input.avatar, 2000),
    location: str(input.location, 120),
    email: str(input.email, 120),
  };
}

export function sanitizeLink(input: Partial<LinkItem>, index = 0): LinkItem {
  const id = str(input.id, 64) || crypto.randomUUID();
  return {
    id,
    title: str(input.title, 80) || "Link",
    url: sanitizeUrl(str(input.url, 2000)),
    icon: str(input.icon, 40) || "link",
    order: typeof input.order === "number" && Number.isFinite(input.order) ? input.order : index,
    enabled: input.enabled !== false,
  };
}

export function sanitizeSettings(input: Partial<Settings>): Settings {
  const accent = str(input.accentColor, 20);
  return {
    theme: str(input.theme, 40) || DEFAULT_SETTINGS.theme,
    darkMode: input.darkMode !== false,
    accentColor: /^#[0-9a-fA-F]{3,8}$/.test(accent) ? accent : DEFAULT_SETTINGS.accentColor,
    background: str(input.background, 2000),
    showFooter: input.showFooter !== false,
  };
}

export function sanitizeAnalytics(input: Partial<Analytics>): Analytics {
  const clicks: Record<string, number> = {};
  if (input.linkClicks && typeof input.linkClicks === "object") {
    for (const [k, v] of Object.entries(input.linkClicks)) {
      if (typeof v === "number" && Number.isFinite(v) && v >= 0) {
        clicks[str(k, 64)] = Math.floor(v);
      }
    }
  }
  return {
    pageViews:
      typeof input.pageViews === "number" && Number.isFinite(input.pageViews)
        ? Math.max(0, Math.floor(input.pageViews))
        : 0,
    linkClicks: clicks,
    lastUpdated:
      typeof input.lastUpdated === "string" && input.lastUpdated
        ? input.lastUpdated
        : new Date().toISOString(),
  };
}

export function sanitizeUrl(url: string): string {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return "";
    return u.toString();
  } catch {
    return "";
  }
}
