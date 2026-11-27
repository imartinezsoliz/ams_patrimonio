/**
 * Puente temporal mock -> Supabase.
 *
 * Las vistas siguen importando los arreglos de mockData.js. Antes de montar la
 * app, `hydrateFromBackend()` reemplaza el CONTENIDO de esos arreglos (mismas
 * referencias) con los datos de Supabase, así las vistas no necesitan cambios.
 *
 * - Sin VITE_SUPABASE_* en .env, o si el backend falla / tarda demasiado,
 *   no se toca nada y la app sigue con los datos de demostración.
 * - Todo se carga primero y se reemplaza al final: nunca queda un estado a medias.
 *
 * Cuando el equipo adopte Pinia/composables, este archivo se elimina y las
 * vistas llaman directamente a src/services/api.js.
 */
import {
  USER_INITIAL_STATE,
  MUSEOS_SUELTOS_MOCK,
  RUTAS_MOCK,
  CARTAS_MOCK,
  DATOS_CURIOSOS_MOCK
} from '../data/mockData.js'
import * as defaultApi from './api.js'

const TIMEOUT_MS = 5000

const replaceContents = (target, items) => target.splice(0, target.length, ...items)

export async function hydrateFromBackend(api = defaultApi, timeoutMs = TIMEOUT_MS) {
  if (!api.isBackendConfigured) return { source: 'mock' }

  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`timeout de ${timeoutMs} ms`)), timeoutMs)
  })

  try {
    await api.ensureSession()
    const [museos, rutas, cartas, perfil, datos] = await Promise.race([
      Promise.all([
        api.getSites(),
        api.getRoutes(),
        api.getCards(),
        api.getProfile(),
        api.getFunFacts()
      ]),
      timeout
    ])

    replaceContents(MUSEOS_SUELTOS_MOCK, museos)
    replaceContents(RUTAS_MOCK, rutas)
    replaceContents(CARTAS_MOCK, cartas)
    replaceContents(DATOS_CURIOSOS_MOCK, datos)
    Object.assign(USER_INITIAL_STATE, perfil)
    return { source: 'supabase' }
  } catch (error) {
    console.warn('No se pudo cargar Supabase; se usan datos de demostración:', error.message ?? error)
    return { source: 'mock', error }
  } finally {
    clearTimeout(timer)
  }
}
