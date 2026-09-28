# Kipper landing page — handoff to Claude Code

This folder (`landing/`) is a finished, working static build of the Kipper landing page,
exported from the Claude design canvas. It was tested in a headless browser at 1440×900
and 390×844: all sections, animations, photos and the phone signup work.

## Goal

heykipper.com live today, with a staging and a production environment on Vercel.

## Two ways to ship it — pick one

**A. Fastest (recommended for today): deploy this folder as its own Vercel project.**

```bash
cd landing
npx vercel            # preview/staging URL
npx vercel --prod     # production
```

No build step; `vercel.json` is included. Then add `heykipper.com` to that project
(Settings → Domains) and keep the preview URL as staging.

**B. Serve it from this Next.js app.** Copy `support.js`, `ds/` and `_img/` into
`public/` (paths inside the HTML are absolute: `/support.js`, `/ds/...`, `/_img/...`),
then either serve `index.html` / `m/index.html` as static routes or port the markup
into `app/page.tsx`. The page mounts a small runtime (`support.js`) into `<x-dc>`;
it is plain client-side JS, so it must run in the browser, not on the server.

## How the page works

- `index.html` — desktop (min-width 1280).
- `m/index.html` — mobile. Each page has a tiny inline script at the top that sends
  viewports under 860px to `/m/` and back to `/` above it. Keep both files, keep the redirect.
- `support.js` — the design runtime (loads React 18 from cdn.jsdelivr.net).
- `ds/kipper/components/bundle.js` — the Kipper character (`Kipper.Kipper`, `Kipper.KipperLive`).
- `_img/` — all photos, avatars and icons (free Unsplash photos, Unsplash License).
- Fonts come from Google Fonts: Instrument Serif, Instrument Sans, Caveat, Reenie Beanie,
  Gochi Hand, Patrick Hand, Homemade Apple, Indie Flower, Permanent Marker, JetBrains Mono.

## The one unfinished piece: the signup

The hero takes a US phone number (`+1` chip, 10 digits, live-formatted as `(415) 555-0123`)
and the Join button currently only shows a success state — nothing is stored.

To capture signups: add a route handler (e.g. `app/api/join/route.ts` or
`api/join.ts` in the standalone project) that accepts `{ phone }`, normalizes to
`+1XXXXXXXXXX`, rejects anything that isn't 10 digits, and inserts
`{ phone_e164, created_at, source }` into a Supabase `waitlist` table
(`SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` as env vars, set for both environments).
Then POST to it from `onJoin` in both `index.html` and `m/index.html` (search for `this.onJoin`),
keeping the existing success and error states.

## Please don't re-style it

The copy, colors, fonts, motion and layout are signed off. If something needs changing,
it should change in the design canvas first (the source of truth) and be re-exported.
The full design brief lives in the Claude project doc `claude/kipper-landing-handoff.md`.
