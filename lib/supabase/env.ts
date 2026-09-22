/**
 * Supabase connection settings.
 *
 * These must be referenced as literal `process.env.NEXT_PUBLIC_*` expressions:
 * Next inlines them into the browser bundle by static string replacement, and
 * a dynamic `process.env[name]` lookup is left untouched, so the value would
 * silently be undefined in the browser.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** Names of any settings that are missing, empty when everything is present. */
export function missingSupabaseConfig(): string[] {
  return [
    !url && "NEXT_PUBLIC_SUPABASE_URL",
    !publishableKey && "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  ].filter((name): name is string => Boolean(name));
}

/**
 * Validated at call time rather than on import, so a missing value surfaces
 * as a clear error on the routes that need Supabase instead of failing the
 * whole build — the marketing page doesn't depend on it.
 */
export function supabaseConfig(): { url: string; publishableKey: string } {
  const missing = missingSupabaseConfig();
  if (!url || !publishableKey) {
    throw new Error(
      `Missing ${missing.join(" and ")}. Copy .env.example to .env.local for ` +
        `local dev, or set them in the Vercel project settings — note that ` +
        `Vercel applies env vars at build time, so an existing deployment ` +
        `must be redeployed after adding them.`,
    );
  }
  return { url, publishableKey };
}
