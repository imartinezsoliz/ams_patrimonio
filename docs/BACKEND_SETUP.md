# Backend setup (Supabase)

Everything the backend needs lives in `supabase/`:

| Path | What |
|---|---|
| `supabase/migrations/*_initial_schema.sql` | Tables, enums, triggers and Row-Level Security (see `docs/SRS.md` §5) |
| `supabase/seed.sql` | Content from `mockData.js` (also loadable with `npm run seed:apply`) (22 sites, 3 routes, 6 cards, 4 fun facts, ranks). **Generated**: edit `src/data/mockData.js` or `scripts/generate-seed.mjs`, then `npm run seed:generate` |
| `scripts/generate-qr.mjs` | Creates QR plaques and registers their hashes |

## 1. Connect your Supabase project (one time)

You do not need Docker for this; you talk directly to the hosted project.

1. **Get the project ref:** Supabase dashboard → *Project Settings → General → Reference ID* (also the `xxxx` in `https://xxxx.supabase.co`).
2. **Open a shell with the CLI.**
   - **NixOS:** the npm-downloaded binary can't run, so use the Nix package. This opens a *new shell*; type the following commands inside it, one per line:
     ```bash
     nix-shell -p supabase-cli
     ```
   - **Windows / macOS / other Linux:** nothing to open; use `npx supabase …` wherever the steps below say `supabase …`.
3. **Authenticate.** Create an access token at <https://supabase.com/dashboard/account/tokens> and export it for this shell only:
   ```bash
   export SUPABASE_ACCESS_TOKEN=<your-token>
   ```
   (Alternative: `supabase login`, then type the verification code from the browser at the CLI prompt and wait for "You are now logged in".)
   **Never paste tokens or the database password into chats, issues or commits.** If one leaks, revoke it on the same tokens page.
4. **Link the repo to the project:**
   ```bash
   supabase link --project-ref <ref>
   ```
   It asks for the database password you chose when creating the project (reset it under *Project Settings → Database* if forgotten).
5. **Create the tables, functions and content:**
   ```bash
   supabase db push --include-seed
   ```
   Later, plain `supabase db push` applies only new migrations. The seed is safe to rerun: it never touches player data. Alternatives for the content (not the schema): paste `supabase/seed.sql` into the dashboard *SQL Editor*, or run `npm run seed:apply`, which loads the same content through the API using only the service role key from `.env` (no CLI or database password; migrations must already be applied). `npm run seed:apply -- --dry-run` shows what it would write. Both follow the same rules and share their data builder, `scripts/seed-data.mjs`.
6. **Enable anonymous sign-ins** (one-time dashboard setting): dashboard → *Authentication → Sign In / Providers → Allow anonymous sign-ins*. The app relies on this so users can play without registering (FR-AUTH-1). Each new user automatically gets a `profiles` row.
7. **Make yourself an admin:** open the app once so an anonymous profile is created (or sign up), then in the SQL Editor:
   ```sql
   update public.profiles set role = 'superadmin' where user_id = '<your auth.users id>';
   ```

## 2. Local configuration

```bash
cp .env.example .env     # .env is git-ignored
```

Fill in from *Project Settings → API*:

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`: used by the frontend (`@supabase/supabase-js` is already installed). Safe to expose because RLS protects the data.
- `SUPABASE_SERVICE_ROLE_KEY`: only for scripts like the QR generator. It bypasses all security. Never prefix it with `VITE_` and never commit it.

## 3. Generate QR plaques

```bash
npm run qr:generate -- --all                        # one QR per site
npm run qr:generate -- --site musef --site museo-asur
npm run qr:generate -- --site musef --rotate        # replace a damaged/stolen plaque
npm run qr:generate -- --site musef --dry-run       # try it without touching the database
```

Output goes to `qr-output/` (git-ignored): `<site>.png`, `<site>.svg`, `codes.csv`. Each QR encodes `QR_BASE_URL/q/<token>`.

- Only `sha256(token)` is stored in `qr_codes.token_hash`. **If the output files are lost, the QR cannot be recovered**: rotate instead.
- A site can have only one active QR (enforced by the database). `--rotate` revokes the old one first.
- **Set `QR_BASE_URL` to the final domain before printing.** It is embedded in every code.

## Redeeming a scan: `redeem_scan`

Implemented in `supabase/migrations/20261127000100_redeem_scan.sql` as a Postgres function, called from the client with `supabase.rpc('redeem_scan', { p_token, p_lat, p_lng, p_accuracy })` (the frontend wrapper is `redeemScan` in `src/services/api.js`). The user is always `auth.uid()`; anonymous sessions work.

It checks, in order: rate limit (10 attempts/user/minute) → token exists (`sha256` lookup) → active → within `valid_from`/`expires_at` → location provided → distance ≤ `sites.radius_m` + GPS accuracy (forgiven up to 50 m) → not already redeemed by this user. On success it logs the scan, unlocks the site's card (if it has one) and adds `sites.points`, atomically.

It never raises for normal failures; it returns `{ "result": "<code>" }` and logs the attempt in `scans`. Result codes: `success`, `already_owned`, `invalid_token`, `revoked_token`, `expired_token`, `no_location`, `too_far` (also returns `distance_m`, `radius_m`), `rate_limited`. On `success` it also returns `site`, `points_earned`, `total_points`, `rank_name`, `rank_changed`, `distance_m` and `card` (null if the site has no card).

Not implemented yet: offline scan queue (`scanned_at`), impossible-travel flagging.

## 4. How the frontend uses the backend

- **Loading data:** `src/main.js` calls `hydrateFromBackend()` (`src/services/hydrate.js`) before mounting. It loads sites, routes, cards, fun facts and the profile from Supabase and replaces the *contents* of the arrays in `mockData.js`, so views need no changes. If `.env` is missing, Supabase is unreachable, or loading takes more than 5 s, the app keeps the demo data. Everything is replaced at once or not at all. This is a temporary bridge: when the team adopts Pinia/composables, delete `hydrate.js` and call `src/services/api.js` from the views.
- **Scanning:** `EscanerView.vue` reads the camera with `qr-scanner` (lazy-loaded), takes the GPS position, extracts the token from `…/q/<token>` and calls `redeemScan`. `App.vue` is unchanged: on `success` the view emits the same `scan-success` event as before, with the server's result. The "Código" button opens a manual entry field (no camera, damaged plaque).
- **Demo mode** (no `.env`): the simulated scan chip still works and real scans show "Modo demo".

### Testing the real flow on one machine
1. Do steps 1–2 above, then `npm run qr:generate -- --site casa-de-la-libertad`.
2. `npm run dev`, open the app, go to Scanner → **Código**, paste the URL from `qr-output/codes.csv`.
3. The server checks your GPS against the site (default radius 100 m). A desktop browser rarely reports an exact location, so for local testing temporarily widen it in the SQL Editor, and restore it afterwards:
   ```sql
   update public.sites set radius_m = 100000 where id = 'casa-de-la-libertad';  -- testing only
   update public.sites set radius_m = 100 where id = 'casa-de-la-libertad';
   ```
4. To scan with a phone camera, the dev server needs https: run `npm run dev:https` (self-signed certificate; accept the browser warning) and open the *Network* URL it prints.
5. Replay a scan: `delete from public.scans where site_id = '…' and user_id = '…'` and `delete from public.user_cards …` (or use a new browser profile, which creates a new anonymous user).

## 5. Deploying to Vercel

QR codes only work for other people once the PWA is on a public https address. `vercel.json` already rewrites every path to `index.html`, so `/q/<token>` links load the app.

1. Vercel dashboard → *Add New → Project* → import the GitHub repo (or run `npx vercel` locally). The Vite preset is detected: build `npm run build`, output `dist`.
2. *Settings → Environment Variables* (these are read at **build** time, so redeploy after changing them):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   Do **not** add `SUPABASE_SERVICE_ROLE_KEY`: it is only for local scripts.
3. Deploy, and note the URL (e.g. `https://ams-patrimonio.vercel.app`). Anonymous sign-in needs no extra Supabase configuration; add the URL under *Authentication → URL Configuration* only when email/Google login is added.
4. Point the QR codes at it: set `QR_BASE_URL=https://<your-url>` in your local `.env`, then `npm run qr:generate -- --all` (or `--site <id> --rotate` to replace codes made with a wrong domain).
5. Test: open a generated link on a phone. The app opens straight into the scanner flow, asks for location and redeems the plaque.

**Choose the final domain before printing plaques.** It is inside every QR; a free `*.vercel.app` address is fine for team testing, but changing domain later means reprinting everything (or keeping the old domain redirecting to the new one).

## 6. Cards for every site

Every site has a card: 6 are authored in `mockData.js`, and 16 are **drafts** generated by `scripts/generate-seed.mjs` from the site's own data (title = name, hint = address, history = description, category from the route/type). Drafts have `cards.is_draft = true`.

- The seed inserts drafts once and **never overwrites them**, so editing a draft in the database is safe. Mark it reviewed with `update public.cards set title = '…', short_history = '…', is_draft = false where id = '…';`.
- To regenerate a draft from site data, delete the row and re-run the seed.
- Authored cards (in `mockData.js`) are overwritten by the seed, so change those in `mockData.js`.
- A card without its own image uses its site's image.

## 7. Images

Photos live in the public Storage bucket `site-images` (created by migration `…_draft_cards_and_images.sql`: 2 MB max, jpg/png/webp). Until photos are uploaded, the app keeps the old `lh3.googleusercontent.com` links, which are not licensed or under your control, and 10 route-only sites have no image at all.

```
images/sites/<site-id>.jpg      e.g. images/sites/musef.jpg
images/routes/<route-id>.webp   e.g. images/routes/ruta-colonial.webp
images/cards/<card-id>.png      optional; otherwise the card uses its site's image
```

```bash
npm run images:upload -- --dry-run     # list what would be uploaded (no keys needed)
npm run images:upload                  # upload and update image_url
```

The file name must be an existing id (site ids are in `supabase/seed.sql`). Aim for about 1600 px on the long side and under 400 KB: the script uploads as-is and does not resize. `images/` is git-ignored; keep originals on a shared drive. Re-seeding never replaces an image that already points at this bucket. Use only photos you own or are licensed to use.

## Notes and known limits

- **Data merging:** duplicate ids in `mockData.js` were merged into one site each: `casa-de-la-libertad-presidentes`, `museo-etnografico-musef`, `cementerio-tumbas-presidenciales` and `castillo-glorieta` map onto `casa-de-la-libertad`, `musef`, `cementerio-general` and `castillo-de-la-glorieta`. Frontend code that uses the old ids will need updating. `museo-catedral` vs `catedral-metropolitana` and `museo-la-recoleta` vs `la-recoleta` are different places and stay separate.
- **Ranks** (Novato 0 / Explorador 300 / Guardián 800 / Cronista 1500) are placeholders.
- **Images** are still the hot-linked URLs in `image_url`; move them to Supabase Storage later.
- `sites.kind` is `museo` for the 12 standalone museums (shown in Explorar/Mapa) and `parada` for route-only stops. `map_top_pct`/`map_left_pct` position pins on the current static map image and are temporary (drop them when the Leaflet map lands).
- `fun_facts.gradient` holds Tailwind classes; Tailwind only generates classes it finds in `src/`, so a *new* gradient written in the database won't render until the same classes appear in source (or are safelisted).
- Draft cards are placeholders: review the text, category (colonial / presidencial / mística) and hint of each (§6).
- Locked cards are publicly readable (the UI shows silhouettes with hints), so their image and history are not secret.
