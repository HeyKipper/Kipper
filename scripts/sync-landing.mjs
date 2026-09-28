/**
 * Copies the landing-page export into public/ so Next can serve it.
 *
 * landing/ stays the single source of truth: it is the export from the design
 * canvas and is replaced wholesale on every re-export. The copies under
 * public/ are build output and are gitignored, so there is never a second
 * version of the page to keep in sync by hand.
 *
 * Runs automatically before `npm run dev` and `npm run build`.
 */
import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const from = join(root, "landing");
const to = join(root, "public");

// The HTML references /support.js, /ds/... and /_img/... as absolute paths, so
// those three have to sit at the public root. The pages themselves go under
// /landing and are surfaced at / and /m by rewrites in next.config.ts.
const assets = ["support.js", "ds", "_img"];
const pages = [
  ["index.html", join("landing", "index.html")],
  [join("m", "index.html"), join("landing", "m", "index.html")],
];

if (!existsSync(from)) {
  console.error("sync-landing: landing/ not found");
  process.exit(1);
}

for (const name of assets) {
  const src = join(from, name);
  if (!existsSync(src)) continue;
  await rm(join(to, name), { recursive: true, force: true });
  await cp(src, join(to, name), { recursive: true });
}

for (const [src, dest] of pages) {
  const full = join(from, src);
  if (!existsSync(full)) {
    console.error(`sync-landing: missing ${src}`);
    process.exit(1);
  }
  await mkdir(dirname(join(to, dest)), { recursive: true });
  await cp(full, join(to, dest));
}

console.log("sync-landing: copied landing export into public/");
