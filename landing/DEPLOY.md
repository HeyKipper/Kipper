# Kipper landing page — deploy to Vercel

This folder is the finished static site (desktop + mobile), ready to ship as-is.

## Deploy (about a minute)

```bash
cd ~/Downloads/kipper-site
npx vercel            # preview URL; log in with your Vercel account when prompted
npx vercel --prod     # production
```

No build step, no framework — Vercel serves it as static files.

## Point heykipper.com at it

In the Vercel dashboard: Project → Settings → Domains → add `heykipper.com`, then follow the DNS records it shows you.

## What's in here

- `index.html` — desktop page
- `m/index.html` — mobile page (phones are redirected here automatically below 860px wide, and back to desktop above it)
- `support.js` — the design runtime (React is loaded from jsdelivr, fonts from Google Fonts)
- `ds/kipper/components/bundle.js` — the Kipper character components
- `_img/` — all photos, avatars and icons
- `vercel.json` — long cache headers on images

## Still to wire up

The phone signup is front-end only right now: it validates a 10-digit US number and shows the success state, but nothing is stored. To capture signups, add a `/api/join` route that writes `{ phone: "+1XXXXXXXXXX", created_at, source }` to Supabase, and POST to it from the Join button in both `index.html` and `m/index.html` (search for `onJoin`).

Photos are free Unsplash photos (Unsplash License).
