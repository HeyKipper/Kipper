import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { supabaseConfig } from "./env";

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 *
 * Create a new one per request — never share it across requests, or one
 * user's session cookies can leak into another user's response.
 */
export async function createClient() {
  // Read cookies first: this marks the route dynamic, so a missing env var
  // surfaces as a request-time error rather than a prerender failure at build.
  const cookieStore = await cookies();
  const { url, publishableKey } = supabaseConfig();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot set cookies. Safe to ignore: proxy.ts
          // refreshes the session on every request, so the cookies are
          // already up to date by the time we get here.
        }
      },
    },
  });
}
