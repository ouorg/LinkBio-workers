/**
 * Optional remote backup (WebDAV + GitHub Gist).
 * Credentials live in KV as plain user config — never env ADMIN_PASSWORD / SESSION_SECRET.
 */
import type { BioStore } from "./kv";
import { sanitizeBackupConfig, stripForbiddenSecrets } from "./kv";
import type {
  BackupConfig,
  BackupPayload,
  BackupState,
  GistBackupConfig,
  SiteData,
  WebDavBackupConfig,
} from "./types";
import { DEFAULT_BACKUP_STATE } from "./types";

export type BackupTargetResult = {
  target: "webdav" | "gist";
  ok: boolean;
  error?: string;
  /** New gist id when created */
  gistId?: string;
};

export type BackupRunResult = {
  ok: boolean;
  results: BackupTargetResult[];
  error: string;
  exportedAt: string;
};

function basicAuth(user: string, pass: string): string {
  const raw = `${user}:${pass}`;
  const bytes = new TextEncoder().encode(raw);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  return `Basic ${btoa(bin)}`;
}

async function pushWebDav(
  cfg: WebDavBackupConfig,
  body: string,
): Promise<BackupTargetResult> {
  if (!cfg.url) return { target: "webdav", ok: false, error: "WebDAV URL is empty" };
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json; charset=utf-8",
    };
    if (cfg.username || cfg.password) {
      headers.Authorization = basicAuth(cfg.username, cfg.password);
    }
    const res = await fetch(cfg.url, {
      method: "PUT",
      headers,
      body,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        target: "webdav",
        ok: false,
        error: `WebDAV HTTP ${res.status}${text ? `: ${text.slice(0, 120)}` : ""}`,
      };
    }
    return { target: "webdav", ok: true };
  } catch (e) {
    return {
      target: "webdav",
      ok: false,
      error: e instanceof Error ? e.message : "WebDAV request failed",
    };
  }
}

async function pullWebDav(cfg: WebDavBackupConfig): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  if (!cfg.url) return { ok: false, error: "WebDAV URL is empty" };
  try {
    const headers: Record<string, string> = { Accept: "application/json, text/plain, */*" };
    if (cfg.username || cfg.password) {
      headers.Authorization = basicAuth(cfg.username, cfg.password);
    }
    const res = await fetch(cfg.url, { method: "GET", headers });
    if (!res.ok) {
      return { ok: false, error: `WebDAV HTTP ${res.status}` };
    }
    return { ok: true, text: await res.text() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "WebDAV fetch failed" };
  }
}

async function pushGist(
  cfg: GistBackupConfig,
  body: string,
): Promise<BackupTargetResult> {
  if (!cfg.token) return { target: "gist", ok: false, error: "Gist token is empty" };
  const filename = cfg.filename || "linkbio-backup.json";
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${cfg.token}`,
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "LinkBio-workers-backup",
  };

  try {
    if (cfg.gistId) {
      const res = await fetch(`https://api.github.com/gists/${cfg.gistId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          files: { [filename]: { content: body } },
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        return {
          target: "gist",
          ok: false,
          error: `Gist HTTP ${res.status}${text ? `: ${text.slice(0, 120)}` : ""}`,
        };
      }
      return { target: "gist", ok: true, gistId: cfg.gistId };
    }

    const res = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers,
      body: JSON.stringify({
        description: "LinkBio-workers backup",
        public: false,
        files: { [filename]: { content: body } },
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        target: "gist",
        ok: false,
        error: `Gist create HTTP ${res.status}${text ? `: ${text.slice(0, 120)}` : ""}`,
      };
    }
    const json = (await res.json()) as { id?: string };
    if (!json.id) return { target: "gist", ok: false, error: "Gist create: missing id" };
    return { target: "gist", ok: true, gistId: json.id };
  } catch (e) {
    return {
      target: "gist",
      ok: false,
      error: e instanceof Error ? e.message : "Gist request failed",
    };
  }
}

async function pullGist(
  cfg: GistBackupConfig,
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  if (!cfg.token) return { ok: false, error: "Gist token is empty" };
  if (!cfg.gistId) return { ok: false, error: "Gist id is empty" };
  const filename = cfg.filename || "linkbio-backup.json";
  try {
    const res = await fetch(`https://api.github.com/gists/${cfg.gistId}`, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${cfg.token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "LinkBio-workers-backup",
      },
    });
    if (!res.ok) return { ok: false, error: `Gist HTTP ${res.status}` };
    const json = (await res.json()) as {
      files?: Record<string, { content?: string; truncated?: boolean; raw_url?: string }>;
    };
    const file = json.files?.[filename] || Object.values(json.files || {})[0];
    if (!file) return { ok: false, error: "Gist has no files" };
    if (file.content && !file.truncated) return { ok: true, text: file.content };
    if (file.raw_url) {
      const raw = await fetch(file.raw_url, {
        headers: {
          Authorization: `Bearer ${cfg.token}`,
          "User-Agent": "LinkBio-workers-backup",
        },
      });
      if (!raw.ok) return { ok: false, error: `Gist raw HTTP ${raw.status}` };
      return { ok: true, text: await raw.text() };
    }
    return { ok: false, error: "Gist file content unavailable" };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gist fetch failed" };
  }
}

export async function buildBackupPayload(
  store: BioStore,
  config: BackupConfig,
): Promise<BackupPayload> {
  return store.exportBackup({
    includeAnalytics: config.includeAnalytics,
    includeBackupConfig: true,
  });
}

/**
 * Push to all enabled targets in parallel.
 * Failures are recorded; does not throw for partial failure.
 */
export async function runBackup(
  store: BioStore,
  options?: { source?: "auto" | "manual"; force?: boolean },
): Promise<BackupRunResult> {
  const source = options?.source || "manual";
  const config = await store.getBackupConfig();
  const enabled: Array<"webdav" | "gist"> = [];
  if (config.webdav.enabled) enabled.push("webdav");
  if (config.gist.enabled) enabled.push("gist");

  const now = new Date().toISOString();

  if (!enabled.length) {
    const state: BackupState = {
      ...DEFAULT_BACKUP_STATE,
      lastAttemptAt: now,
      lastOk: false,
      lastError: "No backup target enabled",
      lastSource: source,
      lastTargets: [],
    };
    await store.setBackupState(state).catch(() => {});
    return { ok: false, results: [], error: state.lastError, exportedAt: now };
  }

  const payload = await buildBackupPayload(store, config);
  const body = JSON.stringify(payload, null, 2);

  const tasks: Promise<BackupTargetResult>[] = [];
  if (config.webdav.enabled) tasks.push(pushWebDav(config.webdav, body));
  if (config.gist.enabled) tasks.push(pushGist(config.gist, body));

  const results = await Promise.all(tasks);

  // Persist new gist id if created
  const gistHit = results.find((r) => r.target === "gist" && r.ok && r.gistId);
  if (gistHit?.gistId && gistHit.gistId !== config.gist.gistId) {
    const next = sanitizeBackupConfig({
      ...config,
      gist: { ...config.gist, gistId: gistHit.gistId },
    });
    await store.setBackupConfig(next).catch(() => {});
  }

  const okTargets = results.filter((r) => r.ok).map((r) => r.target);
  const errors = results.filter((r) => !r.ok).map((r) => r.error || r.target);
  const ok = okTargets.length > 0;
  const state: BackupState = {
    lastAttemptAt: now,
    lastSuccessAt: ok ? now : (await store.getBackupState()).lastSuccessAt,
    lastOk: ok,
    lastError: ok ? (errors.length ? `Partial: ${errors.join("; ")}` : "") : errors.join("; ") || "Backup failed",
    lastTargets: okTargets,
    lastSource: source,
  };
  await store.setBackupState(state).catch(() => {});

  return {
    ok,
    results,
    error: state.lastError,
    exportedAt: payload.exportedAt,
  };
}

/**
 * After content writes: if autoBackup on, schedule remote push via waitUntil.
 * Never blocks the request on network I/O when waitUntil is available.
 * Analytics increments must not call this.
 */
export async function scheduleBackup(store: BioStore): Promise<void> {
  try {
    const config = await store.getBackupConfig();
    if (!config.autoBackup) return;
    if (!config.webdav.enabled && !config.gist.enabled) return;

    const state = await store.getBackupState();
    const minSec = Math.max(60, config.minIntervalSec || 300);
    if (state.lastAttemptAt) {
      const elapsed = (Date.now() - Date.parse(state.lastAttemptAt)) / 1000;
      if (Number.isFinite(elapsed) && elapsed < minSec) return;
    }

    const task = runBackup(store, { source: "auto" }).catch(() => {
      /* status already written inside runBackup when possible */
    });

    try {
      const { getCloudflareContext } = await import("@opennextjs/cloudflare");
      const cf = await getCloudflareContext({ async: true });
      const waitUntil = cf?.ctx?.waitUntil?.bind(cf.ctx);
      if (typeof waitUntil === "function") {
        waitUntil(task);
        return;
      }
    } catch {
      /* local/dev without CF ctx */
    }
    // Fallback: do not await long I/O on the critical path
    void task;
  } catch {
    /* never fail the primary write */
  }
}

export async function restoreFromWebDav(store: BioStore): Promise<{ ok: boolean; error: string }> {
  const config = await store.getBackupConfig();
  const pulled = await pullWebDav(config.webdav);
  if (!pulled.ok) return { ok: false, error: pulled.error };
  return applyBackupJson(store, pulled.text);
}

export async function restoreFromGist(store: BioStore): Promise<{ ok: boolean; error: string }> {
  const config = await store.getBackupConfig();
  const pulled = await pullGist(config.gist);
  if (!pulled.ok) return { ok: false, error: pulled.error };
  return applyBackupJson(store, pulled.text);
}

export async function applyBackupJson(
  store: BioStore,
  raw: string,
): Promise<{ ok: boolean; error: string }> {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") {
      return { ok: false, error: "Invalid backup JSON" };
    }
    const clean = stripForbiddenSecrets(parsed);
    await store.importAll({
      profile: clean.profile as never,
      links: clean.links as never,
      settings: clean.settings as never,
      analytics: clean.analytics as never,
      backup: clean.backup as never,
    });
    return { ok: true, error: "" };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to apply backup",
    };
  }
}

/** FormData → BackupConfig (admin data page). */
export function backupConfigFromForm(formData: FormData): BackupConfig {
  return sanitizeBackupConfig({
    autoBackup: formData.get("autoBackup") === "1",
    minIntervalSec: Number(formData.get("minIntervalSec") || 300),
    includeAnalytics: formData.get("includeAnalytics") === "1",
    webdav: {
      enabled: formData.get("webdavEnabled") === "1",
      url: String(formData.get("webdavUrl") || ""),
      username: String(formData.get("webdavUsername") || ""),
      password: String(formData.get("webdavPassword") || ""),
    },
    gist: {
      enabled: formData.get("gistEnabled") === "1",
      token: String(formData.get("gistToken") || ""),
      gistId: String(formData.get("gistId") || ""),
      filename: String(formData.get("gistFilename") || "linkbio-backup.json"),
    },
  });
}

export type { SiteData };
