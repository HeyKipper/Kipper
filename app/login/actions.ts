"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { toE164 } from "@/lib/phone";
import { createClient } from "@/lib/supabase/server";

export type LoginState =
  | { step: "phone"; error?: string }
  | { step: "code"; phone: string; error?: string };

/** Safe landing paths only — never redirect to an attacker-supplied origin. */
function safeNext(next: FormDataEntryValue | null): string {
  const value = typeof next === "string" ? next : "";
  return value.startsWith("/") && !value.startsWith("//") ? value : "/home";
}

/** Step 1: text a one-time code to the number the user typed. */
export async function requestCode(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const phone = toE164(String(formData.get("phone") ?? ""));
  if (!phone) {
    return {
      step: "phone",
      error: "Enter a valid phone number, including the country code.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ phone });

  if (error) {
    return { step: "phone", error: error.message };
  }
  return { step: "code", phone };
}

/** Step 2: exchange the code for a session. */
export async function verifyCode(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const phone = String(formData.get("phone") ?? "");
  const token = String(formData.get("code") ?? "").replace(/\D/g, "");

  if (!phone) {
    return { step: "phone", error: "Something went wrong. Start again." };
  }
  if (token.length < 4) {
    return { step: "code", phone, error: "Enter the code we texted you." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  if (error) {
    return { step: "code", phone, error: "That code didn't work. Try again." };
  }

  revalidatePath("/", "layout");
  redirect(safeNext(formData.get("next")));
}

/**
 * Single entry point for the login form.
 *
 * The form drives a two-step flow from one `useActionState` hook, so the
 * intent travels with the submission rather than the client swapping which
 * action it calls midway.
 */
export async function authenticate(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  switch (formData.get("intent")) {
    case "verify":
      return verifyCode(prevState, formData);
    case "resend":
      return requestCode(prevState, formData);
    case "restart":
      return { step: "phone" };
    default:
      return requestCode(prevState, formData);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
