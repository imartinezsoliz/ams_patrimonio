/**
 * Builds the seed content (sites, stops, cards, draft cards, ranks) from src/data/mockData.js.
 * Shared by scripts/generate-seed.mjs (SQL) and scripts/seed-via-api.mjs (API upserts).
 *
 * The mock data uses several ids for the same physical place; ID_ALIASES maps
 * them onto one canonical site id. Sites that are different places (e.g. the
 * Cathedral museum vs. the Cathedral bell tower stop) stay separate.
 */
import {
  MUSEOS_SUELTOS_MOCK,
  RUTAS_MOCK,
  MONUMENTOS_MOCK,
  CARTAS_MOCK
} from '../src/data/mockData.js'

export const ID_ALIASES = {
  'casa-de-la-libertad-presidentes': 'casa-de-la-libertad',
  'museo-etnografico-musef': 'musef',
  'cementerio-tumbas-presidenciales': 'cementerio-general',
  'castillo-glorieta': 'castillo-de-la-glorieta'
}
const pct = (v) => (v == null ? null : parseFloat(v))
export const canon = (id) => ID_ALIASES[id] ?? id

// Placeholder thresholds: confirm names/values with the team.
export const RANKS = [
  ['Explorador Novato', 0],
  ['Explorador', 300],
  ['Guardián del Patrimonio', 800],
  ['Cronista de Sucre', 1500]
]

// --- Sites: museums first, then stop-only places, merged by canonical id -----
export const sites = new Map()

for (const m of MUSEOS_SUELTOS_MOCK) {
  sites.set(canon(m.id), {
    id: canon(m.id),
    name: m.nombre,
    category: m.categoria,
    address: m.direccion,
    description: m.descripcion,
    hours: m.horario,
    lat: m.coordenadas.lat,
    lng: m.coordenadas.lng,
    points: m.puntos,
    rarity: m.rareza,
    icon: m.icono,
    image: m.imagen,
    kind: 'museo',
    top: pct(m.topPercent),
    left: pct(m.leftPercent)
  })
}

export const stops = RUTAS_MOCK.flatMap((r) => r.museos)
for (const s of [...stops, ...MONUMENTOS_MOCK]) {
  const id = canon(s.id)
  const existing = sites.get(id)
  if (existing) {
    // Fill gaps only; museum data wins.
    existing.image ??= s.imagen
    existing.description ??= s.descripcion ?? s.detalle
    existing.top ??= pct(s.topPercent)
    existing.left ??= pct(s.leftPercent)
    continue
  }
  sites.set(id, {
    id,
    name: s.nombre,
    category: s.categoria ?? 'Patrimonio',
    address: s.subtitulo,
    description: s.descripcion ?? s.detalle,
    hours: null,
    lat: s.coordenadas.lat,
    lng: s.coordenadas.lng,
    points: s.puntos ?? 100,
    rarity: s.rareza ?? 'Común',
    icon: s.icono,
    image: s.imagen ?? null,
    kind: 'parada',
    top: pct(s.topPercent),
    left: pct(s.leftPercent)
  })
}

// --- Routes ------------------------------------------------------------------
export const minutes = (text) => {
  const h = /(\d+)\s*h/.exec(text)
  const m = /(\d+)\s*min/.exec(text)
  return (h ? Number(h[1]) * 60 : 0) + (m ? Number(m[1]) : 0)
}

// --- Cards: one per site -----------------------------------------------------
export const cards = CARTAS_MOCK.map((c) => ({ ...c, siteId: canon(c.id) }))
for (const c of cards) {
  if (!sites.has(c.siteId)) throw new Error(`Card ${c.id} has no site ${c.siteId}`)
}

// Draft cards for every site that has no authored card. Content is a placeholder built
// from site data; the seed inserts them once (on conflict do nothing) so later edits survive.
const presidentialIds = new Set(
  RUTAS_MOCK.filter((r) => r.id === 'ruta-presidencial').flatMap((r) => r.museos.map((s) => canon(s.id)))
)
const MYSTIC_CATEGORIES = new Set([
  'Paleontología', 'Textil & Indígena', 'Etnográfico', 'Gastronomía', 'Tradición Culinaria'
])
const authored = new Set(cards.map((c) => c.siteId))
const labelFor = { colonial: 'Colonial', presidencial: 'Presidencial', mistica: 'Mística' }
export const draftCards = [...sites.values()]
  .filter((site) => !authored.has(site.id))
  .map((site) => {
    const categoria = presidentialIds.has(site.id)
      ? 'presidencial'
      : MYSTIC_CATEGORIES.has(site.category) ? 'mistica' : 'colonial'
    return {
      id: site.id,
      titulo: site.name,
      categoria,
      categoriaLabel: site.category === 'Patrimonio' ? labelFor[categoria] : site.category,
      rareza: site.rarity,
      pista: site.address ?? site.name,
      iconoPista: 'location_on',
      historiaCorta: site.description,
      imagen: null // the card falls back to the site's image
    }
  })
