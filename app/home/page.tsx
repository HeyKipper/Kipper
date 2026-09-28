import { redirect } from "next/navigation";

import { signOut } from "@/app/login/actions";
import { formatForDisplay } from "@/lib/phone";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Kipper",
};

export default async function HomePage() {
  const supabase = await createClient();

  // proxy.ts already redirected signed-out users, but verify again here:
  // that check is for UX, this one is the one we trust.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, phone, onboarding_completed_at")
    .eq("id", user.id)
    .single();

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-black tracking-tight">
        Hey{profile?.display_name ? `, ${profile.display_name}` : ""} 👋
      </h1>
      <p className="mt-3 text-foreground/60">
        Signed in as {formatForDisplay(profile?.phone ?? user.phone ?? "")}
      </p>
      <p className="mt-6 max-w-sm text-foreground/60">
        Onboarding is next — this is where Kipper starts getting to know you.
      </p>

      <form action={signOut} className="mt-10">
        <button
          type="submit"
          className="rounded-full border border-foreground/15 px-6 py-2.5 text-sm font-semibold text-foreground/70 transition hover:border-foreground/30"
        >
          Sign out
        </button>
      </form>
    </main>
  );
}
