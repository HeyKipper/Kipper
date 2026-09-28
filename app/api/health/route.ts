import { NextResponse } from "next/server";

import { missingSupabaseConfig } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

/**
 * Reports whether the deployment is configured, without exposing any values.
 *
 * Vercel applies environment variables at build time, so adding them to the
 * project settings does nothing until the deployment is rebuilt. This makes
 * that failure mode visible in one request instead of a generic 500.
 */
export async function GET() {
  const missing = missingSupabaseConfig();
  return NextResponse.json(
    {
      ok: missing.length === 0,
      missingEnv: missing,
      hint:
        missing.length > 0
          ? "Set these in the Vercel project settings, then redeploy — env vars only apply to new builds."
          : undefined,
    },
    { status: missing.length === 0 ? 200 : 503 },
  );
}
