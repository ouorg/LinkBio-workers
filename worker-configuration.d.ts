/**
 * Cloudflare Worker bindings & environment.
 * Keep in sync with wrangler.toml and Dashboard Variables / Secrets.
 */
interface Env {
  /** Cloudflare KV namespace for profile, links, settings, analytics */
  BIO_KV: KVNamespace;

  /** Display name of the site (Variable) */
  SITE_NAME: string;

  /** Canonical public URL (Variable) */
  SITE_URL: string;

  /** Default theme id (Variable) */
  DEFAULT_THEME: string;

  /** Admin login password (Secret) — never store in KV */
  ADMIN_PASSWORD: string;

  /** Secret used to sign session tokens (Secret) */
  SESSION_SECRET: string;
}
