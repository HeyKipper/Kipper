/**
 * The phone number awaiting code entry, held in a short-lived httpOnly cookie
 * between the landing page and /verify.
 *
 * A cookie rather than a query parameter: the number stays out of browser
 * history, referrer headers and server logs, and /verify cannot be pointed at
 * someone else's number.
 */
export const PENDING_PHONE_COOKIE = "kipper_pending_phone";

/** Long enough to read a text and type six digits, short enough to be harmless. */
export const PENDING_PHONE_MAX_AGE = 10 * 60;

export const pendingPhoneCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: PENDING_PHONE_MAX_AGE,
} as const;
