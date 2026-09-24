"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { useFormStatus } from "react-dom";

import { resendCode, verifyCode, type VerifyState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        height: 56,
        width: "100%",
        borderRadius: 999,
        border: "none",
        background: "#7466AA",
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: 600,
        cursor: pending ? "default" : "pointer",
        opacity: pending ? 0.65 : 1,
      }}
    >
      {pending ? "Checking…" : "Let me in"}
    </button>
  );
}

export function VerifyForm({ phoneLabel }: { phoneLabel: string }) {
  const [state, formAction] = useActionState<VerifyState, FormData>(
    verifyCode,
    {},
  );
  const [resending, startResend] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <form action={formAction} style={{ width: "100%" }}>
        <input
          ref={inputRef}
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          required
          placeholder="123456"
          aria-label={`Code sent to ${phoneLabel}`}
          style={{
            height: 56,
            width: "100%",
            boxSizing: "border-box",
            borderRadius: 16,
            border: "1px solid rgba(43,33,24,0.18)",
            background: "#FFFFFF",
            padding: "0 18px",
            fontSize: 24,
            letterSpacing: "0.4em",
            textAlign: "center",
            fontFamily: "inherit",
            outline: "none",
          }}
        />
        <div style={{ height: 16 }} />
        <SubmitButton />
      </form>

      <div
        style={{
          marginTop: 18,
          display: "flex",
          gap: 18,
          justifyContent: "center",
          fontSize: 15,
        }}
      >
        <button
          type="button"
          disabled={resending}
          onClick={() => startResend(() => void resendCode())}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            color: "rgba(43,33,24,0.6)",
            textDecoration: "underline",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 15,
          }}
        >
          {resending ? "Sending…" : "Resend code"}
        </button>
        <a
          href="/"
          style={{ color: "rgba(43,33,24,0.6)", textDecoration: "underline" }}
        >
          Use a different number
        </a>
      </div>

      {state.error ? (
        <p role="alert" style={{ marginTop: 18, color: "#C2410C", fontSize: 15 }}>
          {state.error}
        </p>
      ) : null}
    </>
  );
}
