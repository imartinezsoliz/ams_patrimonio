# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"La Ruta Blanca · Sucre Heritage Play": a mobile-first, gamified PWA for exploring heritage sites in Sucre, Bolivia. Visitors scan QR plaques at museums and route stops to earn points and unlock collectible cards. Built with Vue 3 (`<script setup>`, Composition API), Vite 5 and Tailwind CSS 3. Plain JavaScript, no TypeScript. All UI text, identifiers and code comments are in **Spanish**, and new code should follow suit (e.g. `vistaActual`, `cambiarVista`, `mostrarNotificacion`).

## Commands

```bash
npm install
npm run dev       # Vite dev server on port 5173, exposed on the LAN (host: true) for testing on a phone
npm run build     # production build to dist/
npm run preview   # serve the built dist/
```

The project has no test runner, linter or formatter.

## Architecture

- **No router and no store.** `src/App.vue` holds all app-level state: `usuario` (seeded from `USER_INITIAL_STATE`) and `vistaActual` (`'mapa' | 'escaner' | 'coleccion'`). It renders the active view through `<component :is>` using a `vistas` map. To add a view, register it in that map and add a tab to `BottomNav.vue`.
- **Event contract between views and App.** Every view receives the `usuario` prop and may emit:
  - `navigate(viewName)`: switches views (`cambiarVista`).
  - `scan-success({ id, codigo, nombre, puntos })`: handled by `onScanSuccess`, which adds points, unlocks the matching card in `CARTAS_MOCK` by `id`, shows a toast, then redirects to `coleccion`.
  `BottomNav` uses `update:currentView` and `HeaderNav` uses `open-profile`.
- **Data layer.** `src/data/mockData.js` is the only data source. It exports `USER_INITIAL_STATE`, `MUSEOS_SUELTOS_MOCK` (the 12 standalone museums), `RUTAS_MOCK` (3 themed routes, each with nested `museos` stops), `MONUMENTOS_MOCK` (map pins) and `CARTAS_MOCK` (collectible cards). Entities across these arrays are linked by a shared string `id` slug (e.g. `casa-de-la-libertad`). The data is shaped for a planned future sync with Firebase Auth/Firestore.
- **Card unlocking works through remounts, not reactivity.** `CARTAS_MOCK` is a plain, non-reactive module array that `App.vue` mutates in place (`desbloqueada`, `fechaObtencion`). `ColeccionView` sees the change only because switching views remounts it. If the collection ever needs to update while it is mounted, move that state into a `ref`/`reactive`.
- **The scanner and map are simulated.** `EscanerView` has no real camera or QR decoding: `simularEscaneoExitoso` emits a hard-coded payload, and the camera feed is a background image. `MapaRutasView` draws a stylized map, not a map library. It calls `navigator.geolocation` only to update the user's position. The view also toggles between "rutas" and "museos" (a searchable catalog filtered by `categoria`).
- **Layout.** The app sits in a centered `max-w-md` column. `HeaderNav` is hidden on the scanner view, which is a full-screen `h-[100dvh]` view. Other views get `pt-16 pb-28` to clear the fixed header and bottom nav. Safe-area insets are handled through the `safe-top`/`safe-bottom` spacing tokens and `style.css`.

## Styling conventions

- Use the Material 3–style color tokens defined in `tailwind.config.js` (`primary`, `primary-container` = Chuquisaca crimson `#BA0C2F`, `surface-container-*`, `on-surface`, `inverse-surface`, `outline`, etc.) rather than raw hex or default Tailwind colors.
- Icons are **Material Symbols Outlined**, loaded from Google Fonts in `index.html` and used as `<span class="material-symbols-outlined">name</span>`. Icon names are stored as strings in the mock data (`icono`, `iconoPista`). The font is Plus Jakarta Sans.
- Accessibility is an explicit goal (the README cites Vercel's Web Interface Guidelines): decorative icons get `aria-hidden="true"`, icon-only buttons get `aria-label`, toasts use `aria-live`. The repo bundles a `web-design-guidelines` skill in `.agents/skills/` containing the full rule list (`references/command.md`), so use it when reviewing UI.

## Repository notes

- The team develops on both Windows and Linux. `node_modules/` and `dist/` are git-ignored, so run `npm install` after pulling. Never commit them: esbuild and rollup install platform-specific binaries.
- `public/manifest.json` is the PWA manifest, but the `icon-192.png`/`icon-512.png` files it references don't exist yet. The app has no service worker yet.
- The requirements and roadmap are in `docs/SRS.md`.

## Backend (Supabase)

Schema, RLS and seed live in `supabase/`; `supabase/seed.sql` is generated from `mockData.js` (`npm run seed:generate`), so don't edit it by hand. `scripts/generate-qr.mjs` (`npm run qr:generate`) creates QR plaques. Setup steps and the `redeem_scan` contract are in `docs/BACKEND_SETUP.md`. Copy `.env.example` to `.env`; the service role key must never reach the frontend. On NixOS, run the Supabase CLI via `nix-shell -p supabase-cli`.

Frontend data access goes through `src/services/api.js` (`getSites`, `getRoutes`, `getCards`, `getProfile`, `redeemScan`, `extractToken`), which keeps the views' existing Spanish-keyed shapes and falls back to `mockData.js` when `VITE_SUPABASE_*` is not set. Scan rewards are decided only by the `redeem_scan` database function.

At startup `src/main.js` runs `hydrateFromBackend()` (`src/services/hydrate.js`), which swaps the contents of the `mockData.js` arrays for Supabase data before mounting; views still import the mock arrays. `EscanerView` uses the real camera (`qr-scanner`), GPS and `redeemScan`. Use `npm run dev:https` to test the camera on a phone.
