# Software Requirements Specification — La Ruta Blanca · Sucre Heritage Play

| | |
|---|---|
| **Version** | 0.1 (draft) |
| **Date** | 2026-11-27 |
| **Audience** | Internal development team |
| **Status** | For review |

---

## 1. Introduction

### 1.1 Purpose
This document defines the requirements for turning the current La Ruta Blanca front-end prototype into a production PWA. Explorers scan physical QR plaques at heritage sites in Sucre (Chuquisaca, Bolivia), unlock collectible cards and read heritage information.

### 1.2 Scope
In scope:
- Explorer PWA: map, route and museum catalog, QR scanner, card collection, profile.
- Server-side backend on Supabase: auth, database, storage, scan validation.
- Admin panel: content management, QR generation and printing, basic stats.

Out of scope for v1: native app-store builds, payments and ticketing, social features beyond an optional leaderboard.

### 1.3 Glossary
| Term | Meaning |
|---|---|
| **Explorer** | End user (tourist or local) playing the game. |
| **Site** | Any physical place that can be scanned: a standalone museum (*museo suelto*), a route stop (*parada*) or a monument. |
| **Route (Ruta)** | Ordered themed list of sites (Panorámica, Presidencial, Colonial). |
| **Card (Carta)** | Collectible linked to a site; locked until that site's QR is validly redeemed. |
| **QR plaque** | Printed QR code mounted at a site, encoding a redeem URL with a token. |
| **Redeem** | Server-validated act of scanning a QR, which unlocks a card and awards points. |
| **Rank (Rango)** | Explorer level derived from accumulated points. |

### 1.4 References
- `README.md`: catalog of the 12 museums and 3 routes.
- `CLAUDE.md`: current architecture.
- Vercel Web Interface Guidelines (`.agents/skills/web-design-guidelines/references/command.md`).
- WCAG 2.1 AA.

---

## 2. Current state vs. target

| Area | Today (prototype) | Target |
|---|---|---|
| Data | Hard-coded arrays in `src/data/mockData.js` | Postgres tables in Supabase, fetched and cached by the client |
| Scanner | `simularEscaneoExitoso()` in `src/views/EscanerView.vue` emits a fixed payload; background image instead of camera | Real camera stream + QR decoding + torch |
| Reward logic | Client-side in `App.vue` `onScanSuccess` (adds points, mutates `CARTAS_MOCK`) | Server-side Edge Function `redeem_scan`; client only displays the result |
| Collection | `ColeccionView.vue` reads the non-reactive `CARTAS_MOCK`; only 6 cards defined while the UI claims 15 | Cards from DB; counts computed from data |
| Map | Stylized drawing in `MapaRutasView.vue`; geolocation only updates a ref | Real map (Leaflet + OSM) with site pins, user position, route lines |
| Auth / persistence | None; state lost on reload | Supabase Auth (anonymous → upgradable); progress stored server-side |
| Navigation | `<component :is>` in `App.vue`, no URLs | `vue-router` with deep links (`/q/:token`, `/sitio/:id`, …) |
| PWA | `manifest.json` references `icon-192.png`/`icon-512.png` that don't exist; no service worker | Complete manifest, icons, service worker, offline support |
| Admin | None | Admin panel with CRUD + QR generation |
| Images | Hot-linked from `lh3.googleusercontent.com` | Licensed images in Supabase Storage |
| Repo hygiene | No `.gitignore` (`node_modules/`, `dist/` committed), no tests or lint | `.gitignore`, ESLint, unit + e2e tests |

**Data inconsistencies to resolve during migration:** the same place appears under different ids across arrays, for example `castillo-de-la-glorieta` / `castillo-glorieta`, `musef` / `museo-etnografico-musef`, `cementerio-general` / `cementerio-tumbas-presidenciales` and `casa-de-la-libertad` / `casa-de-la-libertad-presidentes`. The target model has one canonical **Site** entity per physical place. Routes reference sites, and cards are linked to sites (FR-DATA-1).

---

## 3. Users and roles

| Role | Description | Access |
|---|---|---|
| **Explorer (anonymous)** | Opens the app without signing up | Read public content, scan, collect (progress tied to device session) |
| **Explorer (registered)** | Upgraded account (email / Google) | Same, plus progress synced across devices |
| **Content Admin** | Museum or municipal staff | CRUD on content, generate/revoke QRs, view stats |
| **Super-admin** | Project team | Manage admins, all settings |

---

## 4. Functional requirements

Priority uses MoSCoW: **M** = Must, **S** = Should, **C** = Could.

### 4.1 QR generation (admin)

| ID | Requirement | Pri |
|---|---|---|
| FR-QR-1 | The system shall generate a unique QR code per site. The payload is a URL `https://<domain>/q/<token>`, where `token` is a random value of at least 128 bits encoded base64url. | M |
| FR-QR-2 | Only a hash of the token (SHA-256) shall be stored in the DB; the plaintext is shown only at generation or print time. | S |
| FR-QR-3 | Admins shall export QRs as print-ready PDF (A5/A6 plaque layout with site name, app logo, short instruction "Escanea para descubrir la carta") and as PNG/SVG. Batch export for a route or all sites. | M |
| FR-QR-4 | Admins shall be able to revoke a QR and issue a replacement for the same site (damaged or stolen plaque). Revoked tokens return a clear "código no válido" message. | M |
| FR-QR-5 | QRs may have an optional `valid_from` / `expires_at` (temporary events). | C |
| FR-QR-6 | QR error-correction level shall be at least **M**, with **H** recommended for outdoor plaques. Minimum printed size is 4 × 4 cm. | S |

**Acceptance:** an admin generates a PDF for the Ruta Colonial. Each code, scanned with a stock phone camera, opens the PWA at the correct site. After a revoke, the old code is rejected.

### 4.2 QR scanning (explorer)

| ID | Requirement | Pri |
|---|---|---|
| FR-SCAN-1 | The scanner view shall use the rear camera (`getUserMedia`, `facingMode: environment`) and decode QR codes in real time (library such as `qr-scanner` / `html5-qrcode`, or native `BarcodeDetector` where available). | M |
| FR-SCAN-2 | Torch toggle via `MediaStreamTrack.applyConstraints({ advanced: [{ torch: true }] })`; hidden when unsupported (e.g. iOS Safari). | S |
| FR-SCAN-3 | Manual code entry fallback for when camera permission is denied or the plaque is unreadable. | M |
| FR-SCAN-4 | Scanning a plaque with the phone's native camera opens `/q/<token>`, which routes into the PWA (or the website if not installed) and starts redemption. | M |
| FR-SCAN-5 | QR codes that are not La Ruta Blanca URLs shall be ignored with a short hint and never opened automatically. | M |
| FR-SCAN-6 | The camera stream shall be stopped when leaving the scanner view or when the app is backgrounded. | M |
| FR-SCAN-7 | Clear UI states: requesting permission, permission denied (with instructions), scanning, validating, success, failure (with reason). | M |

### 4.3 Scan validation (server)

| ID | Requirement | Pri |
|---|---|---|
| FR-VAL-1 | Redemption shall be performed only by a Supabase Edge Function `redeem_scan(token, lat, lng, accuracy, scanned_at)`. The client never writes `user_cards` or points directly. | M |
| FR-VAL-2 | The function shall verify: (a) the token hash exists and is active and within validity; (b) the user's position is within the site's `radius_m` (default 100 m, configurable per site) using the Haversine distance, allowing for reported `accuracy` up to a configured cap; (c) the card is not already owned by the user. | M |
| FR-VAL-3 | On success, the card unlock, points award and scan log shall be written in one DB transaction. The response returns card data, points earned, new total and any rank change. | M |
| FR-VAL-4 | Rate limiting: at most N redeem attempts per user per minute (default 10) and per IP. | M |
| FR-VAL-5 | Every attempt (success or failure + reason) shall be logged in `scans`. | M |
| FR-VAL-6 | **GPS denied policy** (open question, §8): default is to reject with an explanation and offer retry. | M |
| FR-VAL-7 | Re-scanning an owned card shall return a friendly "ya tienes esta carta" with the card detail and no points. | M |
| FR-VAL-8 | Suspicious patterns (impossible travel speed between scans, mock-location flags when detectable) shall be flagged in `scans` for admin review. | C |

**Acceptance:** standing at Casa de la Libertad, scanning its plaque unlocks the card and adds its configured points. Scanning the same token 2 km away fails with "Debes estar en el lugar". A second scan at the site returns "ya tienes esta carta".

### 4.4 Collectible cards

| ID | Requirement | Pri |
|---|---|---|
| FR-CARD-1 | The collection view shall show all cards, locked ones as silhouettes with their hint (`pista`), and unlocked ones with image, rarity and date obtained. | M |
| FR-CARD-2 | Filtering by category (colonial, presidencial, mística, …) with counts computed from data, not hard-coded. | M |
| FR-CARD-3 | Card detail modal with short history (`historiaCorta`), the linked site and a link to the site's info page. | M |
| FR-CARD-4 | Progress shown overall, per category and per route. | M |
| FR-CARD-5 | Rarity tiers (Común, Rara, Épica, Legendaria) with consistent visual treatment. | S |
| FR-CARD-6 | Unlock animation and toast after a successful redeem, as in the current prototype. | S |

### 4.5 Heritage information

| ID | Requirement | Pri |
|---|---|---|
| FR-INFO-1 | Site detail page (`/sitio/:id`): name, category, address, opening hours, description, images, coordinates, linked card, and routes containing it. | M |
| FR-INFO-2 | Route detail: ordered stops, distance, estimated time, difficulty, progress. | M |
| FR-INFO-3 | Museum catalog with text search and category filter (existing behavior in `MapaRutasView.vue`). | M |
| FR-INFO-4 | Extended content unlocked after redemption (e.g. longer history, audio guide). | C |

### 4.6 Map and geolocation

| ID | Requirement | Pri |
|---|---|---|
| FR-MAP-1 | Interactive map (Leaflet + OpenStreetMap tiles) centered on Sucre, with pins for all sites and pin styles that distinguish collected from not collected. | M |
| FR-MAP-2 | Show the user's live position after consent. Do not request location on first load; request it on first use of the map or scanner. | M |
| FR-MAP-3 | "Locate" a stop from a route or museum card centers the map on that pin. | M |
| FR-MAP-4 | Draw route polylines with the order of stops. | S |
| FR-MAP-5 | Distance from the user to each site, replacing the static `distancia` strings. | S |
| FR-MAP-6 | "Directions" deep-link to Google Maps / OSM apps. | C |

### 4.7 Accounts and profile

| ID | Requirement | Pri |
|---|---|---|
| FR-AUTH-1 | On first launch, create a Supabase anonymous session automatically, so the user can play without signing up. | M |
| FR-AUTH-2 | Anonymous users can upgrade to email (magic link) or Google sign-in without losing progress (identity linking). | M |
| FR-AUTH-3 | Profile: display name, points, rank, cards collected, routes completed. | M |
| FR-AUTH-4 | Account deletion with removal of personal data. | M |

### 4.8 Gamification

| ID | Requirement | Pri |
|---|---|---|
| FR-GAME-1 | Each site/card defines the points it awards (configurable per site). | M |
| FR-GAME-2 | Ranks derived from point thresholds stored in a `ranks` table (e.g. Explorador Novato → …). | M |
| FR-GAME-3 | Completing all stops of a route awards a bonus and a route badge. | S |
| FR-GAME-4 | Public leaderboard (opt-in, display name only). | C |

### 4.9 Admin panel

| ID | Requirement | Pri |
|---|---|---|
| FR-ADM-1 | Separate admin area (`/admin`, role-gated) for CRUD on sites, routes (with stop ordering), cards and ranks. | M |
| FR-ADM-2 | Image upload to Supabase Storage with automatic resizing/compression (WebP). | M |
| FR-ADM-3 | QR management: generate, print (FR-QR-3), revoke/replace (FR-QR-4), see last scan time per plaque. | M |
| FR-ADM-4 | Stats: scans per site per day, unique explorers, failed-scan reasons, flagged scans. | S |
| FR-ADM-5 | Draft/published state for content. | C |

### 4.10 Internationalization

| ID | Requirement | Pri |
|---|---|---|
| FR-I18N-1 | All UI strings externalized (`vue-i18n`); Spanish is the default. | M |
| FR-I18N-2 | English translation of UI and content (translatable content fields in DB). | S |
| FR-I18N-3 | Quechua translation. | C |

### 4.11 Data migration

| ID | Requirement | Pri |
|---|---|---|
| FR-DATA-1 | Seed script that migrates `mockData.js` content into the DB, merging duplicate ids into canonical sites (see §2). | M |
| FR-DATA-2 | Remove the client's runtime dependency on `mockData.js` (keep it only for tests or storybook if useful). | M |

---

## 5. Data model (Supabase / Postgres)

```
sites        (id slug PK, name, category, address, description, hours, lat, lng,
              radius_m int default 100, image_path, icon, points int, published bool)
routes       (id slug PK, title, description, category, distance_km, est_minutes,
              difficulty, icon, image_path, completion_bonus int)
route_stops  (route_id FK, site_id FK, position int, note)          PK(route_id, site_id)
cards        (id slug PK, site_id FK unique, title, category, rarity, hint,
              short_history, image_path)
qr_codes     (id uuid PK, site_id FK, token_hash bytea unique, active bool,
              valid_from, expires_at, created_by, created_at, revoked_at)
profiles     (user_id PK → auth.users, display_name, points int, rank_id FK,
              role enum('explorer','admin','superadmin'), leaderboard_opt_in bool)
user_cards   (user_id FK, card_id FK, obtained_at, scan_id FK)       PK(user_id, card_id)
scans        (id uuid PK, user_id, qr_code_id, site_id, lat, lng, accuracy,
              distance_m, result enum, flagged bool, created_at)
ranks        (id PK, name, min_points)
```

**Row-Level Security**
- `sites`, `routes`, `route_stops`, `cards`, `ranks`: public read where `published`; write for admins only.
- `profiles`: users read and update their own row (except `points`, `rank_id`, `role`); admins read all.
- `user_cards`, `scans`: users read their own; **inserts only via the Edge Function** (service role).
- `qr_codes`: admins only.

Admin role checks use a custom JWT claim or a `profiles.role` lookup inside policies.

---

## 6. Non-functional requirements

### 6.1 PWA

| ID | Requirement | Pri |
|---|---|---|
| NFR-PWA-1 | Service worker via `vite-plugin-pwa` (Workbox): precache the app shell; runtime cache for images (CacheFirst) and content API (StaleWhileRevalidate). | M |
| NFR-PWA-2 | Previously loaded content, the collection and the profile shall be viewable offline. | M |
| NFR-PWA-3 | **Offline scan queue:** if offline, store `{token, lat, lng, accuracy, scanned_at}` in IndexedDB and redeem automatically when back online. The server accepts queued scans up to a max age (e.g. 24 h) and still validates location against the stored coordinates. | S |
| NFR-PWA-4 | Complete manifest: PNG icons 192/512, maskable icon, Apple touch icon, screenshots; the files referenced in `public/manifest.json` must exist. | M |
| NFR-PWA-5 | Custom install prompt (`beforeinstallprompt`) and iOS "Add to Home Screen" instructions. | S |
| NFR-PWA-6 | Update flow: notify the user when a new version is available and reload on confirm. | S |
| NFR-PWA-7 | Served over HTTPS only; camera and geolocation require a secure context. | M |

### 6.2 Performance
- LCP < 2.5 s and INP < 200 ms on a mid-range Android phone over 4G; Lighthouse PWA and Performance scores ≥ 90.
- Initial JS ≤ 200 KB gzipped; lazy-load the scanner library, map and admin routes.
- Images served as WebP with responsive sizes.

### 6.3 Compatibility
- Android Chrome (last 2 versions) and iOS Safari 16.4+. Portrait mobile is primary; desktop shows the centered mobile column (current layout).

### 6.4 Accessibility
- WCAG 2.1 AA and Web Interface Guidelines. Every flow, including manual code entry, must be completable without the camera, and all controls must be usable by keyboard and screen reader.
- Remove `maximum-scale=1.0, user-scalable=no` from `index.html` (it blocks zoom, failing WCAG 1.4.4).

### 6.5 Security
- Tokens are unguessable (FR-QR-1) and stored as hashes (FR-QR-2).
- All reward logic is server-side; RLS enabled on every table; the Supabase service key is never shipped to the client.
- Rate limiting on `redeem_scan` (FR-VAL-4).
- Content Security Policy and dependency audit in CI.

### 6.6 Privacy
- Explicit consent screen before the first location request, explaining why location is needed.
- Store location only with scan attempts (not continuous tracking); define a retention period (e.g. 12 months), then anonymize.
- Privacy policy page; account deletion (FR-AUTH-4). Follow Bolivian personal-data rules and GDPR practices for foreign tourists.

### 6.7 Maintainability
- Add `.gitignore`, stop tracking `node_modules/` and `dist/`.
- ESLint + Prettier; Vitest for unit tests (e.g. distance calc, rank calc); Playwright for e2e of the scan flow.
- Introduce `vue-router` and Pinia; replace the `<component :is>` switch and the mutable `CARTAS_MOCK` with stores.
- Environments: dev / staging / prod Supabase projects; DB migrations under version control (`supabase/migrations`).

---

## 7. External interfaces

| Interface | Use |
|---|---|
| Supabase Auth | Anonymous + email / Google sessions |
| Supabase PostgREST | Read content, profile, collection |
| Supabase Edge Functions | `redeem_scan`, admin `generate_qr` / `revoke_qr` |
| Supabase Storage | Site and card images |
| OpenStreetMap tiles (or a hosted tile provider) | Map rendering; respect tile usage policy |
| Browser APIs | `getUserMedia`, `BarcodeDetector`, Geolocation, Service Worker, IndexedDB, Web Share (optional) |
| QR / PDF generation | `qrcode` + `pdf-lib` / `jspdf` in the admin panel (client-side) or in an Edge Function |

---

## 8. Assumptions, constraints, open questions

1. **GPS denied:** reject the scan, or allow it with reduced points? (Default: reject.)
2. **Indoor GPS accuracy:** inside thick colonial walls accuracy may exceed 50–100 m. Per-site `radius_m` tuning is needed; field-test each site.
3. **Plaques:** who prints, mounts and maintains them? Where exactly is each placed, and what is the procedure when one is damaged?
4. **Card count:** the UI states 15 cards; only 6 are defined. Define the full card list and its mapping to sites (likely one card per site across 12 museums + route stops).
5. **Image licensing:** current images are hot-linked AI or third-party assets; replace them with licensed or own photography.
6. **Leaderboard** in v1 or later?
7. **Hosting / domain** for the PWA (e.g. Vercel / Netlify / Cloudflare Pages) and the final domain encoded in QRs. The domain must be fixed before printing.
8. **Content ownership:** which institutions approve historical texts?

---

## 9. Milestones (suggested)

| Milestone | Content | Key FRs |
|---|---|---|
| **M0 – Foundations** | `.gitignore`, lint, router, Pinia, i18n scaffolding, fix manifest icons | NFR-PWA-4, §6.7 |
| **M1 – Backend** | Supabase project, schema, RLS, seed from `mockData.js`, anonymous auth, content read from DB | FR-DATA-*, FR-AUTH-1, §5 |
| **M2 – Real scanning** | Camera scanner, `/q/:token` deep link, `redeem_scan` with GPS check, collection from DB | FR-SCAN-*, FR-VAL-*, FR-CARD-* |
| **M3 – Admin + QR** | Admin CRUD, image upload, QR generation, PDF print, revoke | FR-ADM-*, FR-QR-* |
| **M4 – PWA** | Service worker, offline, scan queue, install & update prompts | NFR-PWA-* |
| **M5 – Map & polish** | Leaflet map, route lines, distances, English translation, account upgrade, gamification bonuses | FR-MAP-*, FR-I18N-2, FR-AUTH-2, FR-GAME-3 |
| **M6 – Field test** | On-site tests at every plaque, radius tuning, accessibility and performance audit | §6.2, §6.4, §8.2 |
