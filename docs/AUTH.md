# Auth

Kipper uses **phone-only authentication**: you enter a number, you get a text,
you're in. No passwords, no email required at signup.

- **Identity** — Supabase Auth, phone OTP
- **SMS delivery** — Twilio Verify, called by Supabase server-side
- **Authorization** — Postgres Row Level Security

Email and Google/Microsoft OAuth come later, when a user connects a calendar.
Both are optional and neither is part of getting in.

## The front door

The landing page **is** the app's home page. `landing/` is the export from the
design canvas and stays the single source of truth; `scripts/sync-landing.mjs`
copies it into `public/` before `dev` and `build`, and `next.config.ts` rewrites
`/` and `/m` to it. The copies under `public/` are gitignored build output.

**Re-exporting is unchanged:** replace `landing/`, and the next build picks it
up. The only hand-edit that must survive a re-export is `onJoin` in
`index.html` and `m/index.html` — see "After a re-export" below.

## How a login works

1. The landing page's hero takes a US phone number. `onJoin` POSTs it to
   `/api/auth/start`.
2. That route normalizes to E.164 (`lib/phone.ts`) and calls
   `signInWithOtp({ phone })`. Supabase asks Twilio Verify to send the code.
   **We never see or store the code.** It stores the number in a short-lived
   httpOnly cookie and the page redirects to `/verify`.
3. `/verify` reads that cookie and collects the code. `verifyCode` calls
   `verifyOtp()`, which sets the session cookies, then redirects to `/home`.

`/login` is a standalone version of the same two steps, useful for linking a
returning user straight to sign-in without the landing page.
4. A Postgres trigger (`handle_new_user`) creates the matching
   `public.profiles` row the first time a number signs in. Signup and login
   are therefore the same flow — there is no separate "register" step.
5. `proxy.ts` refreshes the session on every request and bounces signed-out
   users away from `/home` and `/onboarding`.

### Where the security actually lives

`proxy.ts` is an **optimistic check for redirect UX only**. The real boundary
is Row Level Security: `profiles` rows are readable and writable only by the
user they belong to, enforced by Postgres regardless of what the app does.
Server Components re-verify with `getUser()` rather than trusting the cookie.

Use `supabase.auth.getUser()`, never `getSession()`, anywhere server-side.
`getSession()` trusts the cookie without revalidating it.

## One-time setup you need to do

The Twilio connection is configured in the Supabase dashboard, not in code —
Supabase calls Twilio on our behalf, so the credentials live there and never
touch this repo.

1. **Twilio Console → Verify → Services → Create new.** Name it `Kipper`.
   Copy the **Service SID** (starts with `VA`).
2. **Supabase Dashboard → Authentication → Sign In / Providers → Phone.**
   - Enable phone sign-in
   - SMS provider: **Twilio Verify**
   - Paste Account SID, Auth Token, and the Verify Service SID
3. **Authentication → Rate Limits.** Lower the SMS limit to something sane
   (e.g. 10/hour) while testing so a bug can't burn your balance.

### While Twilio is in trial

A trial account can **only text numbers you've verified** in the Twilio
Console (Phone Numbers → Verified Caller IDs). Add your own number there
first, or the code will never arrive and Supabase will return a Twilio error.
Messages also arrive with a "Sent from your Twilio trial account" prefix.

## Rotating the Twilio auth token

Twilio Console → **API keys & auth tokens** → create a secondary token,
promote it to primary, revoke the old one. Then update it in the Supabase
dashboard (step 2 above). Nothing in this repo changes.

## Environment variables

Only two, both safe to expose to the browser — the publishable key grants
nothing that RLS doesn't allow:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Copy `.env.example` to `.env.local` for local dev, and set the same two in
Vercel for deploys.

## After a re-export

The design canvas doesn't know about auth, so a fresh export ships the original
`onJoin`, which POSTs to `/api/join` and shows a success state. Re-apply the
edit in both `landing/index.html` and `landing/m/index.html`: POST to
`/api/auth/start` instead, and on success `window.location.href = '/verify'`.
Search for `onJoin` in each file; it is about ten lines.

The `waitlist` table and `landing/api/join.js` are left from the pre-auth
signup. Nothing writes to the table now.

## Known issue: the hero can swallow a click

Clicking the phone field scrolls the page (the field sits low in the viewport,
and CSS scroll-snap animates it into view). A click on **Join** that lands
while that scroll is still settling registers mousedown and mouseup on
different elements, so it does nothing and the visitor has to click again.

Measured at 1440x900: the button is stable when idle, but focusing the field
moves the page 394px. This predates auth — it affected the waitlist button too.
The fix belongs in the design canvas, since `landing/` is generated.

## Recovering a locked-out user

Phone-only means a user who loses their number can't get back in on their own.
That's a deliberate tradeoff for speed. To move an account to a new number,
edit the user's phone in **Supabase Dashboard → Authentication → Users**, then
update the `phone` column on their `profiles` row to match.
