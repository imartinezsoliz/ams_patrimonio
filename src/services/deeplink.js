/**
 * Enlaces de las placas QR: https://<dominio>/q/<token>
 *
 * Al escanear una placa con la cámara del teléfono se abre la PWA en esa URL.
 * `capturePendingToken()` (se llama una vez en main.js, antes de montar) guarda
 * el token y limpia la URL para que recargar la página no lo reprocese.
 * `consumePendingToken()` lo entrega una sola vez a quien lo canjee (EscanerView).
 */
import { extractToken } from './api.js'

let pending = null

/** Devuelve el token si `pathname` es `/q/<token>`; si no, null. */
export const tokenFromPath = (pathname) => {
  const match = /^\/q\/([^/]+)\/?$/.exec(pathname ?? '')
  return match ? extractToken(`/q/${match[1]}`) : null
}

export function capturePendingToken() {
  const token = tokenFromPath(window.location.pathname)
  if (!token) return null
  pending = token
  window.history.replaceState(null, '', '/')
  return token
}

export const hasPendingToken = () => Boolean(pending)

export function consumePendingToken() {
  const token = pending
  pending = null
  return token
}
