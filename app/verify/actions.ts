"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { PENDING_PHONE_COOKIE, pendingPhoneCookieOptions } from "@/lib/auth-pending";
import { createClient } from "@/lib/supabase/server";

export type VerifyState = { error?: string; resent?: boolean };

async function pendingPhone(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(PENDING_PHONE_COOKIE)?.value ?? null;
}

/** Exchanges the texted code for a session. */
export async function verifyCode(
  _prev: VerifyState,
  formData: FormData,
): Promise<VerifyState> {
  const phone = await pendingPhone();
  if (!phone) redirect("/");

  const token = String(formData.get("code") ?? "").replace(/\D/g, "");
  if (token.length < 4) {
    return { error: "Enter the code we texted you." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  if (error) {
    return { error: "That code didn't work. Check it and try again." };
  }

  const cookieStore = await cookies();
  cookieStore.delete(PENDING_PHONE_COOKIE);
  revalidatePath("/", "layout");
  redirect("/home");
}

/** Sends a fresh code to the same number. */
export async function resendCode(): Promise<VerifyState> {
  const phone = await pendingPhone();
  if (!phone) redirect("/");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) {
    return { error: "Couldn't send another code just yet. Wait a moment." };
  }

  // Refresh the window so the visitor keeps the full ten minutes.
  const cookieStore = await cookies();
  cookieStore.set(PENDING_PHONE_COOKIE, phone, pendingPhoneCookieOptions);
  return { resent: true };
}
