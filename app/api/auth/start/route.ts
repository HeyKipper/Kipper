import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  PENDING_PHONE_COOKIE,
  pendingPhoneCookieOptions,
} from "@/lib/auth-pending";
import { toE164 } from "@/lib/phone";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Texts a one-time code to the number typed on the landing page.
 *
 * Called by `onJoin` in the landing export. On success the caller sends the
 * visitor to /verify, which reads the pending number from the cookie set here.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { phone } = (body ?? {}) as { phone?: unknown };
  const e164 = toE164(String(phone ?? ""));
  if (!e164) {
    return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ phone: e164 });

  if (error) {
    // Supabase returns 429 here when its own SMS rate limit trips.
    const status = error.status === 429 ? 429 : 502;
    console.error("auth/start: signInWithOtp failed", error.status, error.message);
    return NextResponse.json({ error: "sms_failed" }, { status });
  }

  const response = NextResponse.json({ ok: true });
  const cookieStore = await cookies();
  cookieStore.set(PENDING_PHONE_COOKIE, e164, pendingPhoneCookieOptions);
  return response;
}
