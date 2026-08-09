"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getEnv, getStore } from "@/lib/env";
import { flashErr, flashOk, setFlashCookie } from "@/lib/flash";
import { createT } from "@/lib/i18n";
import {
  clientIpFromHeaders,
  sanitizeLink,
  sanitizeProfile,
  sanitizeSettings,
} from "@/lib/kv";
import {
  constantTimeEqual,
  createSessionToken,
  getSessionCookieName,
} from "@/lib/session";
import {
  CSRF_COOKIE,
  CSRF_FIELD,
  generateCsrfToken,
  isSecureRequestFromHeaders,
  validateCsrf,
} from "@/lib/security";
import type { LinkItem } from "@/lib/types";
import { resolveThemeId } from "@/lib/themes";

async function tSite() {
  const store = await getStore();
  const settings = await store.getSettings();
  return createT(settings.locale);
}

async function requireCsrf(formData: FormData) {
  const jar = await cookies();
  const cookieToken = jar.get(CSRF_COOKIE)?.value || null;
  const formToken = String(formData.get(CSRF_FIELD) || "");
  if (!validateCsrf(cookieToken, formToken)) {
    return false;
  }
  return true;
}

async function isSecure() {
  const h = await headers();
  return isSecureRequestFromHeaders(h);
}

/** Set one-shot flash then redirect (no ?msg= in the URL). */
async function flashRedirect(path: string, message: string): Promise<never> {
  await setFlashCookie(message);
  redirect(path);
}

function revalidatePublic() {
  revalidatePath("/");
}

export async function ensureCsrfCookie() {
  const jar = await cookies();
  const existing = jar.get(CSRF_COOKIE)?.value;
  if (existing && existing.length >= 16) return existing;
  const token = generateCsrfToken();
  jar.set(CSRF_COOKIE, token, {
    path: "/",
    sameSite: "lax",
    maxAge: 86400,
    secure: await isSecure(),
  });
  return token;
}

export async function loginAction(formData: FormData) {
  const store = await getStore();
  const env = await getEnv();
  const settings = await store.getSettings();
  const t = createT(settings.locale);
  const h = await headers();
  const ip = clientIpFromHeaders(h);

  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) {
    await flashRedirect("/admin/login", flashErr(t("admin.login.error.noPassword")));
  }

  const lock = await store.checkLoginRateLimit(ip);
  if (lock !== null) {
    await flashRedirect(
      "/admin/login",
      flashErr(t("admin.login.error.rateLimit", { minutes: lock })),
    );
  }

  if (!(await requireCsrf(formData))) {
    await flashRedirect("/admin/login", flashErr(t("admin.login.error.csrf")));
  }

  const password = String(formData.get("password") || "");
  const ok = await constantTimeEqual(password, env.ADMIN_PASSWORD);
  if (!ok) {
    await store.recordLoginFailure(ip);
    await flashRedirect("/admin/login", flashErr(t("admin.login.error.password")));
  }

  await store.clearLoginRateLimit(ip);
  const token = await createSessionToken(env.SESSION_SECRET);
  const jar = await cookies();
  const sec = await isSecure();
  jar.set(getSessionCookieName(), token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    secure: sec,
  });
  jar.set(CSRF_COOKIE, generateCsrfToken(), {
    path: "/",
    sameSite: "lax",
    maxAge: 86400,
    secure: sec,
  });
  redirect("/admin");
}

export async function logoutAction(formData: FormData) {
  if (!(await requireCsrf(formData))) {
    redirect("/admin");
  }
  const jar = await cookies();
  jar.set(getSessionCookieName(), "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    secure: await isSecure(),
  });
  redirect("/admin/login");
}

export async function saveProfileAction(formData: FormData) {
  const t = await tSite();
  if (!(await requireCsrf(formData))) {
    await flashRedirect("/admin/profile", flashErr(t("admin.error.csrf")));
  }
  const store = await getStore();
  await store.setProfile(
    sanitizeProfile({
      name: String(formData.get("name") || ""),
      username: String(formData.get("username") || ""),
      bio: String(formData.get("bio") || ""),
      avatar: String(formData.get("avatar") || ""),
      location: String(formData.get("location") || ""),
      email: String(formData.get("email") || ""),
    }),
  );
  revalidatePublic();
  await flashRedirect("/admin/profile", flashOk(t("admin.profile.saved")));
}

export async function saveSettingsAction(formData: FormData) {
  const store = await getStore();
  const current = await store.getSettings();
  const t = createT(current.locale);
  if (!(await requireCsrf(formData))) {
    await flashRedirect("/admin/theme", flashErr(t("admin.error.csrf")));
  }
  const env = await getEnv();
  const next = sanitizeSettings({
    theme: resolveThemeId(String(formData.get("theme") || ""), env.DEFAULT_THEME),
    accentColor: String(formData.get("accentColor") || ""),
    background: String(formData.get("background") || ""),
    colorMode: String(formData.get("colorMode") || "") as never,
    locale: String(formData.get("locale") || "") as never,
    showFooter: formData.get("showFooter") === "1",
    footerMode: String(formData.get("footerMode") || "") as never,
    footerText: String(formData.get("footerText") || ""),
  });
  await store.setSettings(next);
  revalidatePublic();
  const tNext = createT(next.locale);
  await flashRedirect("/admin/theme", flashOk(tNext("admin.theme.saved")));
}

export async function addLinkAction(formData: FormData) {
  const t = await tSite();
  if (!(await requireCsrf(formData))) {
    await flashRedirect("/admin/links", flashErr(t("admin.error.csrf")));
  }
  const store = await getStore();
  const links = await store.getLinks();
  const maxOrder = links.reduce((m, l) => Math.max(m, l.order), -1);
  const item = sanitizeLink(
    {
      id: crypto.randomUUID(),
      title: String(formData.get("title") || ""),
      url: String(formData.get("url") || ""),
      icon: String(formData.get("icon") || "link"),
      order: maxOrder + 1,
      enabled: formData.get("enabled") === "1",
    },
    maxOrder + 1,
  );
  if (!item.url) {
    await flashRedirect("/admin/links", flashErr(t("admin.links.invalidUrl")));
  }
  links.push(item);
  await store.setLinks(links);
  revalidatePublic();
  await flashRedirect("/admin/links", flashOk(t("admin.links.added")));
}

export async function deleteLinkAction(formData: FormData) {
  const t = await tSite();
  if (!(await requireCsrf(formData))) {
    await flashRedirect("/admin/links", flashErr(t("admin.error.csrf")));
  }
  const id = String(formData.get("id") || "");
  const store = await getStore();
  const links = (await store.getLinks()).filter((l) => l.id !== id);
  await store.setLinks(links.map((l, i) => ({ ...l, order: i })));
  revalidatePublic();
  await flashRedirect("/admin/links", flashOk(t("admin.links.deleted")));
}

export async function toggleLinkAction(formData: FormData) {
  const t = await tSite();
  if (!(await requireCsrf(formData))) {
    await flashRedirect("/admin/links", flashErr(t("admin.error.csrf")));
  }
  const id = String(formData.get("id") || "");
  const store = await getStore();
  const links = await store.getLinks();
  await store.setLinks(links.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)));
  revalidatePublic();
  await flashRedirect("/admin/links", flashOk(t("admin.links.updated")));
}

export async function reorderLinkAction(formData: FormData) {
  const t = await tSite();
  if (!(await requireCsrf(formData))) {
    await flashRedirect("/admin/links", flashErr(t("admin.error.csrf")));
  }
  const id = String(formData.get("id") || "");
  const dir = Number(formData.get("dir") || 0) as -1 | 1;
  const store = await getStore();
  const links = (await store.getLinks()).sort((a, b) => a.order - b.order);
  const idx = links.findIndex((l) => l.id === id);
  if (idx < 0) redirect("/admin/links");
  const swap = idx + dir;
  if (swap < 0 || swap >= links.length) redirect("/admin/links");
  const tmp = links[idx]!;
  links[idx] = links[swap]!;
  links[swap] = tmp;
  const normalized: LinkItem[] = links.map((l, i) => ({ ...l, order: i }));
  await store.setLinks(normalized);
  revalidatePublic();
  await flashRedirect("/admin/links", flashOk(t("admin.links.reordered")));
}

export async function importDataAction(formData: FormData) {
  const t = await tSite();
  if (!(await requireCsrf(formData))) {
    await flashRedirect("/admin/data", flashErr(t("admin.error.csrf")));
  }
  const raw = String(formData.get("json") || "");
  try {
    const data = JSON.parse(raw) as Record<string, unknown>;
    const store = await getStore();
    await store.importAll({
      profile: data.profile as never,
      links: data.links as never,
      settings: data.settings as never,
      analytics: data.analytics as never,
    });
    revalidatePublic();
    const after = await store.getSettings();
    const tAfter = createT(after.locale);
    await flashRedirect("/admin/data", flashOk(tAfter("admin.data.imported")));
  } catch {
    await flashRedirect("/admin/data", flashErr(t("admin.data.invalidJson")));
  }
}

export { flashOk, flashErr };
