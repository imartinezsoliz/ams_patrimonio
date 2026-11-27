/**
 * Loads the seed content into Supabase through the API (service role), without the
 * Supabase CLI or a database password. Same rules as supabase/seed.sql:
 *
 *   - sites, routes, authored cards, fun facts, ranks: upserted
 *   - images that already point at the `site-images` bucket are kept
 *   - draft cards are inserted once and never overwritten
 *   - route stops are replaced; player data (user_cards, scans, qr_codes) is never touched
 *
 *   node scripts/seed-via-api.mjs --dry-run    # show what would be written
 *   node scripts/seed-via-api.mjs
 *
 * The schema must already exist (migrations applied). Needs SUPABASE_URL (or VITE_SUPABASE_URL)
 * and SUPABASE_SERVICE_ROLE_KEY.
 */
import { parseArgs } from 'node:util'
import { createClient } from '@supabase/supabase-js'
import { RUTAS_MOCK, DATOS_CURIOSOS_MOCK } from '../src/data/mockData.js'
import { RANKS, canon, minutes, sites, cards, draftCards } from './seed-data.mjs'

try {
  process.loadEnvFile('.env')
} catch {
  // no .env file: rely on the real environment
}

const { values: args } = parseArgs({ options: { 'dry-run': { type: 'boolean', default: false } } })

const fail = (msg) => {
  console.error(`Error: ${msg}`)
  process.exit(1)
}

// --- Build rows in database column shape ----------------------------------------
const rankRows = RANKS.map(([name, min_points]) => ({ name, min_points }))

const siteRows = [...sites.values()].map((s) => ({
  id: s.id, name: s.name, category: s.category, address: s.address, description: s.description,
  hours: s.hours, lat: s.lat, lng: s.lng, points: s.points, rarity: s.rarity, icon: s.icon,
  image_url: s.image, kind: s.kind, map_top_pct: s.top, map_left_pct: s.left
}))

const routeRows = RUTAS_MOCK.map((r) => ({
  id: r.id, title: r.titulo, description: r.descripcion, category: r.categoria,
  distance_km: parseFloat(r.distancia), est_minutes: minutes(r.tiempoEstimado),
  difficulty: r.dificultad, icon: r.icono, image_url: r.imagen,
  badge_text: r.badgeTexto, badge_type: r.badgeTipo
}))

const stopRows = RUTAS_MOCK.flatMap((r) =>
  r.museos.map((s, i) => ({
    route_id: r.id, site_id: canon(s.id), position: i + 1, subtitle: s.subtitulo, detail: s.detalle
  }))
)

const cardRow = (c, siteId, isDraft) => ({
  id: siteId, site_id: siteId, title: c.titulo, category: c.categoria, category_label: c.categoriaLabel,
  rarity: c.rareza, hint: c.pista, hint_icon: c.iconoPista, short_history: c.historiaCorta,
  image_url: c.imagen ?? null, is_draft: isDraft
})
const authoredRows = cards.map((c) => cardRow(c, c.siteId, false))
const draftRows = draftCards.map((c) => cardRow(c, c.id, true))

const factRows = DATOS_CURIOSOS_MOCK.map((d, i) => ({
  id: d.id, position: i + 1, badge: d.badge, icon: d.icono, text_prefix: d.textoPrefix,
  text_highlight: d.textoDestacado, text_suffix: d.textoSuffix, location: d.ubicacion,
  gradient: d.gradiente
}))

const plan = [
  ['ranks', rankRows], ['sites', siteRows], ['routes', routeRows], ['route_stops', stopRows],
  ['cards (authored)', authoredRows], ['cards (drafts, insert-only)', draftRows], ['fun_facts', factRows]
]

if (args['dry-run']) {
  for (const [name, list] of plan) console.log(`would write ${String(list.length).padStart(3)} ${name}`)
  process.exit(0)
}

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) fail('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required (or use --dry-run)')
const db = createClient(url, key, { auth: { persistSession: false } })

const check = (label, { error }) => {
  if (error) fail(`${label}: ${error.message}`)
  console.log(`ok  ${label}`)
}

const UPLOADED = '/storage/v1/object/public/site-images/'

/** Keep images already uploaded to Storage instead of restoring the placeholder link. */
async function keepUploadedImages(table, rows) {
  const { data, error } = await db.from(table).select('id, image_url')
  if (error) fail(`${table}: ${error.message}`)
  const uploaded = new Map(data.filter((r) => r.image_url?.includes(UPLOADED)).map((r) => [r.id, r.image_url]))
  return rows.map((r) => (uploaded.has(r.id) ? { ...r, image_url: uploaded.get(r.id) } : r))
}

check('ranks', await db.from('ranks').upsert(rankRows, { onConflict: 'name' }))
check('sites', await db.from('sites').upsert(await keepUploadedImages('sites', siteRows), { onConflict: 'id' }))
check('routes', await db.from('routes').upsert(await keepUploadedImages('routes', routeRows), { onConflict: 'id' }))

// Route stops: replaced wholesale, like the SQL seed (avoids (route_id, position) clashes when reordering).
check('route_stops (cleared)', await db.from('route_stops').delete().neq('route_id', ''))
check('route_stops', await db.from('route_stops').insert(stopRows))

check('cards (authored)', await db.from('cards').upsert(await keepUploadedImages('cards', authoredRows), { onConflict: 'id' }))
check('cards (drafts)', await db.from('cards').upsert(draftRows, { onConflict: 'id', ignoreDuplicates: true }))
check('fun_facts', await db.from('fun_facts').upsert(factRows, { onConflict: 'id' }))
console.log('\nSeed loaded.')
