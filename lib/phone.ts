/**
 * Normalizes user-typed phone input to E.164, which is the only format
 * Twilio and Supabase Auth accept.
 *
 * Bare 10-digit input is assumed to be North American (+1). Anything else
 * must be typed with its country code.
 */
export function toE164(input: string): string | null {
  const trimmed = input.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");

  if (!digits) return null;

  if (!hasPlus) {
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
    return null;
  }

  // E.164 allows at most 15 digits, and no country code starts with 0.
  if (digits.length < 8 || digits.length > 15 || digits.startsWith("0")) {
    return null;
  }
  return `+${digits}`;
}

/** Formats an E.164 number for display, e.g. +14155550123 -> (415) 555-0123. */
export function formatForDisplay(e164: string): string {
  const match = /^\+1(\d{3})(\d{3})(\d{4})$/.exec(e164);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : e164;
}
