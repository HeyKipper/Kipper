"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { formatForDisplay } from "@/lib/phone";
import { authenticate, type LoginState } from "./actions";

function SubmitButton({
  children,
  intent,
}: {
  children: React.ReactNode;
  intent?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name={intent ? "intent" : undefined}
      value={intent}
      disabled={pending}
      className="w-full rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
    >
      {pending ? "One sec…" : children}
    </button>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(
    authenticate,
    { step: "phone" },
  );
  const codeInputRef = useRef<HTMLInputElement>(null);

  // Jump straight to the code box once it appears, so the flow stays
  // thumb-only on a phone.
  useEffect(() => {
    if (state.step === "code") codeInputRef.current?.focus();
  }, [state.step]);

  return (
    <form action={formAction} className="w-full max-w-sm">
      <input type="hidden" name="next" value={next} />

      {state.step === "phone" ? (
        <>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-foreground/70"
          >
            Your phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            autoFocus
            required
            placeholder="(415) 555-0123"
            className="mt-2 w-full rounded-2xl border border-foreground/15 bg-white/70 px-4 py-3.5 text-lg text-foreground outline-none transition focus:border-accent"
          />
          <p className="mt-2 text-sm text-foreground/55">
            We&rsquo;ll text you a code. No password, ever.
          </p>
          <div className="mt-6">
            <SubmitButton>Text me a code</SubmitButton>
          </div>
        </>
      ) : (
        <>
          <input type="hidden" name="phone" value={state.phone} />
          <label
            htmlFor="code"
            className="block text-sm font-semibold text-foreground/70"
          >
            Enter the code we sent to {formatForDisplay(state.phone)}
          </label>
          <input
            id="code"
            ref={codeInputRef}
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            maxLength={6}
            placeholder="123456"
            className="mt-2 w-full rounded-2xl border border-foreground/15 bg-white/70 px-4 py-3.5 text-center text-2xl tracking-[0.5em] text-foreground outline-none transition focus:border-accent"
          />
          <div className="mt-6">
            <SubmitButton intent="verify">Let me in</SubmitButton>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <button
              type="submit"
              name="intent"
              value="resend"
              className="font-medium text-foreground/60 underline-offset-4 hover:underline"
            >
              Resend code
            </button>
            <button
              type="submit"
              name="intent"
              value="restart"
              className="font-medium text-foreground/60 underline-offset-4 hover:underline"
            >
              Use a different number
            </button>
          </div>
        </>
      )}

      {state.error ? (
        <p role="alert" className="mt-4 text-sm font-medium text-accent">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
