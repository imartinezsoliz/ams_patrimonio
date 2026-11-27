# Backend setup (Supabase)

Everything the backend needs lives in `supabase/`:

| Path | What |
|---|---|
| `supabase/migrations/*_initial_schema.sql` | Tables, enums, triggers and Row-Level Security (see `docs/SRS.md` §5) |
| `supabase/seed.sql` | Content from `mockData.js` (22 sites, 3 routes, 6 cards, ranks). **Generated**: edit `src/data/mockData.js` or `scripts/generate-seed.mjs`, then `npm run seed:generate` |
| `scripts/generate-qr.mjs` | Creates QR plaques and registers their hashes |

## 1. Connect your Supabase project (one time)

You do not need Docker for this; you talk directly to the hosted project.

1. **Get the project ref:** Supabase dashboard → *Project Settings → General → Reference ID* (also the `xxxx` in `https://xxxx.supabase.co`).
2. **Log in to the CLI:** `npx supabase login` (opens the browser).
   - On **NixOS** the npm-downloaded binary can't run. Use `nix-shell -p supabase-cli` and call `supabase ...` instead of `npx supabase ...`.
3. **Link the repo to the project:**
   ```bash
   npx supabase link --project-ref <ref>
   ```
   It asks for the database password you chose when creating the project (reset it under *Project Settings → Database* if forgotten).
4. **Create the tables:**
   ```bash
   npx supabase db push
   ```
5. **Load the content.** Either `npx supabase db push --include-seed`, or paste `supabase/seed.sql` into the dashboard *SQL Editor* and run it. It is safe to run repeatedly: it never touches player data.
6. **Enable anonymous sign-ins:** dashboard → *Authentication → Sign In / Providers → Allow anonymous sign-ins*. The app relies on this so users can play without registering (FR-AUTH-1). Each new user automatically gets a `profiles` row.
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

## Contract for `redeem_scan` (not implemented yet)

The server function that will redeem a scan must:
1. Compute `sha256(token)` of the `/q/<token>` path segment and look it up in `qr_codes` (`active`, `valid_from`/`expires_at`).
2. Check the Haversine distance between the reported position and `sites.lat/lng` against `sites.radius_m`.
3. In one transaction: insert into `scans`, insert into `user_cards` (the card whose `site_id` matches), and add `sites.points` to `profiles.points`.
4. Use the **service role** (clients have no write access to `scans`, `user_cards` or `profiles.points`), and log failures in `scans.result`.

## Notes and known limits

- **Data merging:** duplicate ids in `mockData.js` were merged into one site each: `casa-de-la-libertad-presidentes`, `museo-etnografico-musef`, `cementerio-tumbas-presidenciales` and `castillo-glorieta` map onto `casa-de-la-libertad`, `musef`, `cementerio-general` and `castillo-de-la-glorieta`. Frontend code that uses the old ids will need updating. `museo-catedral` vs `catedral-metropolitana` and `museo-la-recoleta` vs `la-recoleta` are different places and stay separate.
- **Ranks** (Novato 0 / Explorador 300 / Guardián 800 / Cronista 1500) are placeholders.
- **Images** are still the hot-linked URLs in `image_url`; move them to Supabase Storage later.
- Only 6 of 22 sites have a card; the others still award points but have no collectible yet.
- Locked cards are publicly readable (the UI shows silhouettes with hints), so their image and history are not secret.
