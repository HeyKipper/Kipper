import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { PENDING_PHONE_COOKIE } from "@/lib/auth-pending";
import { formatForDisplay } from "@/lib/phone";
import { VerifyForm } from "./verify-form";

export const metadata = { title: "Enter your code · Kipper" };

export default async function VerifyPage() {
  const cookieStore = await cookies();
  const phone = cookieStore.get(PENDING_PHONE_COOKIE)?.value;

  // No pending number means the visitor landed here directly or the code
  // expired. Send them back to the front door to start again.
  if (!phone) redirect("/");

  return (
    <main
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
        background: "#F5EFE3",
        color: "#2B2118",
        fontFamily:
          "'Instrument Sans', ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 380, textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 44,
            lineHeight: 1.1,
            margin: 0,
            fontWeight: 400,
          }}
        >
          Check your texts
        </h1>
        <p style={{ margin: "14px 0 28px", color: "rgba(43,33,24,0.65)", fontSize: 17 }}>
          We sent a code to {formatForDisplay(phone)}.
        </p>
        <VerifyForm phoneLabel={formatForDisplay(phone)} />
      </div>
    </main>
  );
}
