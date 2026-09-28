# Kipper site — deploy

The site is the `kipper` Vercel project, built from the **repo root** and
deployed on every push to `main`.

## Layout

The landing page is a static site (no build step) served out of `public/`, so
Vercel/Next serve it straight from the domain root:

- `public/index.html` — desktop page
- `public/m/index.html` — mobile page (phones are redirected here automatically
  below 860px wide, and back to desktop above it)
- `public/support.js` — the design runtime (React from jsdelivr, fonts from
  Google Fonts)
- `public/ds/kipper/components/bundle.js` — the Kipper character components
- `public/_img/` — all photos, avatars and icons
- `public/icon-*.png`, `public/apple-touch-icon.png` — favicons;
  `/favicon.ico` comes from `app/favicon.ico`

Its markup uses absolute paths (`/support.js`, `/_img/...`, `/m/`), so it has to
be served from the root. `next.config.ts` does that with `beforeFiles` rewrites
mapping `/` to `/index.html` and `/m` to `/m/index.html` — `beforeFiles` because
those need to win over the `app/` routes. The same file sets the long cache
headers on `/_img/*` and `/support.js`.

The Next app supplies the API routes and `/coming-soon` (the old splash page).

## Signups

`POST /api/join` (`app/api/join/route.ts`) writes
`{ phone_e164, source }` to the Supabase `waitlist` table. It needs
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_PUBLISHABLE_KEY`)
set in the Vercel project's environment variables, or it returns
`server_misconfigured`.

## Domain

Vercel dashboard: Project → Settings → Domains → `heykipper.com`.

## Local

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm run start   # production build
```

Photos are free Unsplash photos (Unsplash License).
