/**
 * Capa de acceso a datos de La Ruta Blanca.
 *
 * Las vistas llaman a estas funciones en lugar de importar mockData.js.
 * Devuelven las MISMAS formas (claves en español) que usan hoy las vistas, de
 * modo que cambiar de mock a Supabase no obliga a tocar las plantillas.
 *
 * Sin VITE_SUPABASE_* en .env, todo responde con mockData.js (modo offline/demo).
 * Ojo: en modo demo se conservan los ids antiguos de mockData.js; en Supabase
 * los lugares duplicados están fusionados (ver docs/BACKEND_SETUP.md).
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'
import {
  USER_INITIAL_STATE,
  MUSEOS_SUELTOS_MOCK,
  RUTAS_MOCK,
  CARTAS_MOCK,
  DATOS_CURIOSOS_MOCK
} from '../data/mockData.js'

export const isBackendConfigured = isSupabaseConfigured

// Plaza 25 de Mayo: referencia para el texto "X m del centro".
const CENTRO = USER_INITIAL_STATE.ubicacionActual

const distanciaMetros = (a, b) => {
  const rad = Math.PI / 180
  const h =
    Math.sin(((b.lat - a.lat) * rad) / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(((b.lng - a.lng) * rad) / 2) ** 2
  return 2 * 6371000 * Math.asin(Math.sqrt(h))
}

const etiquetaDistancia = (m) =>
  m < 1000 ? `${Math.round(m)} m del centro` : `${(m / 1000).toFixed(1)} km del centro`

// --- Mapeos fila de BD -> forma que usan las vistas ---------------------------

export const mapSite = (s) => ({
  id: s.id,
  nombre: s.name,
  categoria: s.category,
  direccion: s.address,
  descripcion: s.description,
  horario: s.hours,
  coordenadas: { lat: s.lat, lng: s.lng },
  distancia: etiquetaDistancia(distanciaMetros(CENTRO, { lat: s.lat, lng: s.lng })),
  radioM: s.radius_m,
  puntos: s.points,
  rareza: s.rarity,
  icono: s.icon,
  imagen: s.image_url,
  // Posición del pin sobre la imagen estática de MapaView (temporal hasta el mapa real)
  topPercent: s.map_top_pct == null ? null : `${Number(s.map_top_pct)}%`,
  leftPercent: s.map_left_pct == null ? null : `${Number(s.map_left_pct)}%`
})

export const mapFunFact = (f) => ({
  id: f.id,
  badge: f.badge,
  icono: f.icon,
  textoPrefix: f.text_prefix,
  textoDestacado: f.text_highlight,
  textoSuffix: f.text_suffix,
  ubicacion: f.location,
  gradiente: f.gradient
})

const formatMinutes = (min) => {
  if (min == null) return null
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h && m) return `${h} h ${m} min`
  return h ? `${h} h` : `${m} min`
}

export const mapRoute = (r, ownedSiteIds = new Set()) => {
  const stops = [...(r.route_stops ?? [])].sort((a, b) => a.position - b.position)
  return {
    id: r.id,
    titulo: r.title,
    descripcion: r.description,
    categoria: r.category,
    distancia: r.distance_km == null ? null : `${r.distance_km} km`,
    dificultad: r.difficulty,
    tiempoEstimado: formatMinutes(r.est_minutes),
    icono: r.icon,
    imagen: r.image_url,
    badgeTexto: r.badge_text,
    badgeTipo: r.badge_type,
    totalCartas: stops.length,
    cartasDescubiertas: stops.filter((st) => ownedSiteIds.has(st.sites.id)).length,
    museos: stops.map((st) => ({
      id: st.sites.id,
      nombre: st.sites.name,
      subtitulo: st.subtitle,
      detalle: st.detail,
      icono: st.sites.icon,
      coordenadas: { lat: st.sites.lat, lng: st.sites.lng },
      puntos: st.sites.points,
      estado: ownedSiteIds.has(st.sites.id) ? 'Desbloqueado' : 'Por visitar'
    }))
  }
}

export const mapCard = (c, obtainedAt) => ({
  id: c.id,
  siteId: c.site_id,
  titulo: c.title,
  categoria: c.category,
  categoriaLabel: c.category_label,
  rareza: c.rarity,
  pista: c.hint,
  iconoPista: c.hint_icon,
  historiaCorta: c.short_history,
  // Una carta sin imagen propia usa la del lugar
  imagen: c.image_url ?? c.sites?.image_url ?? null,
  puntosGanados: c.sites?.points,
  desbloqueada: Boolean(obtainedAt),
  fechaObtencion: obtainedAt
    ? new Date(obtainedAt).toLocaleDateString('es-BO', { day: 'numeric', month: 'short' })
    : null
})

// --- Sesión -------------------------------------------------------------------

/** Garantiza una sesión (anónima si hace falta). Devuelve el usuario o null en modo demo. */
export async function ensureSession() {
  if (!isSupabaseConfigured) return null
  const { data } = await supabase.auth.getSession()
  if (data.session) return data.session.user
  const { data: created, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return created.user
}

// --- Lecturas -----------------------------------------------------------------

const unwrap = ({ data, error }) => {
  if (error) throw error
  return data
}

/** Los 12 museos sueltos (kind = 'museo'). Con { todos: true } incluye también las paradas de ruta. */
export async function getSites({ todos = false } = {}) {
  if (!isSupabaseConfigured) return MUSEOS_SUELTOS_MOCK
  let query = supabase.from('sites').select('*').order('name')
  if (!todos) query = query.eq('kind', 'museo')
  return unwrap(await query).map(mapSite)
}

export async function getFunFacts() {
  if (!isSupabaseConfigured) return DATOS_CURIOSOS_MOCK
  return unwrap(await supabase.from('fun_facts').select('*').order('position')).map(mapFunFact)
}

/** Ids de lugares cuya carta/escaneo ya tiene el usuario. */
async function getOwnedSiteIds(userId) {
  // Filtro explícito: los admins pueden leer los escaneos de todos por RLS.
  const rows = unwrap(
    await supabase.from('scans').select('site_id').eq('user_id', userId).eq('result', 'success')
  )
  return new Set(rows.map((r) => r.site_id))
}

export async function getRoutes() {
  if (!isSupabaseConfigured) return RUTAS_MOCK
  const user = await ensureSession()
  const [routes, owned] = await Promise.all([
    supabase
      .from('routes')
      .select('*, route_stops(position, subtitle, detail, sites(*))')
      .order('id')
      .then(unwrap),
    getOwnedSiteIds(user.id)
  ])
  return routes.map((r) => mapRoute(r, owned))
}

export async function getCards() {
  if (!isSupabaseConfigured) return CARTAS_MOCK
  await ensureSession()
  const [cards, owned] = await Promise.all([
    supabase.from('cards').select('*, sites(points, image_url)').order('id').then(unwrap),
    supabase.from('user_cards').select('card_id, obtained_at').then(unwrap)
  ])
  const obtained = new Map(owned.map((o) => [o.card_id, o.obtained_at]))
  return cards.map((c) => mapCard(c, obtained.get(c.id)))
}

/** Perfil del explorador con la forma de USER_INITIAL_STATE. */
export async function getProfile() {
  if (!isSupabaseConfigured) return { ...USER_INITIAL_STATE }
  const user = await ensureSession()
  const profile = unwrap(
    await supabase.from('profiles_with_rank').select('*').eq('user_id', user.id).single()
  )
  return {
    ...USER_INITIAL_STATE,
    nombre: profile.display_name,
    puntos: profile.points,
    rango: profile.rank_name
  }
}

// --- Escaneo ------------------------------------------------------------------

/** Extrae el token de lo que lea el escáner: URL `.../q/<token>` o el token suelto. */
export function extractToken(text) {
  const value = String(text ?? '').trim()
  const match = /\/q\/([A-Za-z0-9_-]{16,})\/?(?:[?#].*)?$/.exec(value)
  if (match) return match[1]
  return /^[A-Za-z0-9_-]{16,}$/.test(value) ? value : null
}

/** Mensajes para mostrar al usuario según el código de resultado de redeem_scan. */
export const MENSAJES_ESCANEO = {
  success: '¡Patrimonio descubierto!',
  already_owned: 'Ya descubriste este lugar.',
  invalid_token: 'Este código QR no es válido.',
  revoked_token: 'Esta placa fue reemplazada. Busca la placa nueva.',
  expired_token: 'Este código ya no está vigente.',
  no_location: 'Necesitamos tu ubicación para validar que estás en el lugar.',
  too_far: 'Debes estar en el lugar para escanear.',
  rate_limited: 'Demasiados intentos. Espera un minuto.'
}

/**
 * Canjea un escaneo en el servidor. `coords` = { lat, lng, accuracy } (de la Geolocation API).
 * Devuelve { result, ...datos } (ver docs/BACKEND_SETUP.md). En modo demo simula el éxito
 * con Casa de la Libertad, como hacía EscanerView.
 */
export async function redeemScan(token, coords = {}) {
  if (!isSupabaseConfigured) {
    return {
      result: 'success',
      site: { id: 'casa-de-la-libertad', name: 'Casa de la Libertad' },
      points_earned: 150,
      card: { id: 'casa-de-la-libertad' }
    }
  }
  await ensureSession()
  const { data, error } = await supabase.rpc('redeem_scan', {
    p_token: token,
    p_lat: coords.lat ?? null,
    p_lng: coords.lng ?? null,
    p_accuracy: coords.accuracy ?? null
  })
  if (error) throw error
  return data
}
