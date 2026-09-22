import { createBrowserClient } from "@supabase/ssr";

import { supabaseConfig } from "./env";

/** Supabase client for Client Components. */
export function createClient() {
  const { url, publishableKey } = supabaseConfig();
  return createBrowserClient(url, publishableKey);
}
