import Link from "next/link";

import { LoginForm } from "./login-form";

export const metadata = {
  title: "Sign in · Kipper",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  const target = typeof next === "string" ? next : "/home";

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6">
      <div
        aria-hidden
        className="animate-drift pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-accent/25 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-drift-slow pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-accent/15 blur-3xl"
      />

      <div className="relative flex w-full max-w-sm flex-col items-center">
        <Link
          href="/"
          className="text-3xl font-black tracking-tight text-foreground"
        >
          Kipper
        </Link>
        <p className="mt-2 mb-8 text-center text-foreground/60">
          One text and you&rsquo;re in.
        </p>

        <LoginForm next={target} />
      </div>
    </main>
  );
}
