<script setup>
/**
 * EscanerView.vue
 * Vista inmersiva a pantalla completa (100dvh) con acceso real a la cámara trasera del dispositivo
 * mediante WebRTC (getUserMedia) y decodificación de códigos QR en tiempo real con jsQR.
 * Soporta tanto el modo local (cartas vinculadas por qrCodigo/id) como el canje en servidor Supabase
 * (redeem_scan y deeplink /q/<token>) cuando VITE_SUPABASE_* está configurado.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import jsQR from 'jsqr'
import { extractToken, redeemScan, MENSAJES_ESCANEO } from '../services/api.js'
import { isSupabaseConfigured } from '../lib/supabase.js'
import { consumePendingToken } from '../services/deeplink.js'

const props = defineProps({
  usuario: {
    type: Object,
    default: null
  },
  cartas: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['navigate', 'scan-success', 'open-qr-generator'])

// Referencias DOM para cámara y procesamiento de frames
const videoRef = ref(null)
const canvasRef = ref(null)

// Estados de cámara y escaneo
const estadoCamara = ref('solicitando') // 'solicitando' | 'activa' | 'error'
const mensajeErrorCamara = ref('')
const linternaEncendida = ref(false)
const linternaDisponible = ref(false)
const mostrarTips = ref(false)
const mostrarManual = ref(false)
const codigoManual = ref('')
const feedbackEscaneo = ref('')
const feedbackTipo = ref('error') // 'info' | 'error'
const procesando = ref(false)

let mediaStream = null
let videoTrack = null
let rafId = null
let bloqueadoTemporalmente = false
let desmontado = false

const setFeedback = (texto, tipo = 'error', duracionMs = 3000) => {
  feedbackEscaneo.value = texto
  feedbackTipo.value = tipo
  if (duracionMs > 0 && texto) {
    setTimeout(() => {
      if (feedbackEscaneo.value === texto) feedbackEscaneo.value = ''
    }, duracionMs)
  }
}

// Buscar carta coincidente por código QR o ID (acepta texto directo o URL /q/<token>)
const buscarCartaLocalPorQR = (textoCrudo) => {
  if (!textoCrudo) return null
  const limpio = textoCrudo.trim()
  let token = limpio

  if (limpio.startsWith('http://') || limpio.startsWith('https://')) {
    try {
      const url = new URL(limpio)
      const qParam = url.searchParams.get('code') || url.searchParams.get('q')
      if (qParam) {
        token = qParam
      } else {
        const partes = url.pathname.split('/').filter(Boolean)
        if (partes.length) token = partes[partes.length - 1]
      }
    } catch {
      // mantener texto original
    }
  }

  return props.cartas.find(
    (c) =>
      c.qrCodigo?.toLowerCase() === token.toLowerCase() ||
      c.id.toLowerCase() === token.toLowerCase()
  ) || null
}

// Posición actual para validación geográfica en Supabase
const obtenerPosicion = () =>
  new Promise((resolve) => {
    if (!('geolocation' in navigator)) return resolve({})
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }),
      () => resolve({}),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
    )
  })

// Procesar texto decodificado de un QR (soporta modo Supabase y modo local)
const manejarQRDetectado = async (texto) => {
  if (bloqueadoTemporalmente || procesando.value || !texto) return false

  // 1. Verificar coincidencia directa en catálogo local
  const cartaLocal = buscarCartaLocalPorQR(texto)
  if (cartaLocal && !isSupabaseConfigured) {
    bloqueadoTemporalmente = true
    if ('vibrate' in navigator) navigator.vibrate(120)
    detenerCamara()
    emit('scan-success', {
      id: cartaLocal.id,
      codigo: cartaLocal.qrCodigo,
      nombre: cartaLocal.titulo,
      puntos: cartaLocal.puntosGanados,
      imagen: cartaLocal.imagen
    })
    return true
  }

  // 2. Si Supabase está configurado, intentar canje contra el servidor
  if (isSupabaseConfigured) {
    const token = extractToken(texto)
    if (!token) {
      bloqueadoTemporalmente = true
      setFeedback(`QR "${texto.slice(0, 28)}" no pertenece a La Ruta Blanca.`, 'error')
      setTimeout(() => { bloqueadoTemporalmente = false }, 2500)
      return false
    }

    procesando.value = true
    bloqueadoTemporalmente = true
    setFeedback('Validando código…', 'info', 0)
    try {
      const res = await redeemScan(token, await obtenerPosicion())
      if (res.result === 'success') {
        setFeedback('', 'info', 0)
        if ('vibrate' in navigator) navigator.vibrate(120)
        detenerCamara()
        emit('scan-success', {
          id: res.card?.id ?? res.site.id,
          nombre: res.site.name,
          puntos: res.points_earned
        })
        return true
      } else if (res.result === 'already_owned') {
        setFeedback(`Ya descubriste ${res.site?.name ?? 'este lugar'}.`, 'info')
      } else if (res.result === 'too_far') {
        setFeedback(`Estás a ${res.distance_m} m. Acércate a menos de ${res.radius_m} m de la placa.`, 'error')
      } else {
        setFeedback(MENSAJES_ESCANEO[res.result] ?? 'No se pudo validar el código.', 'error')
      }
    } catch {
      codigoManual.value = token
      mostrarManual.value = true
      setFeedback('No pudimos validar el código. Revisa tu conexión y pulsa Validar.', 'error')
    } finally {
      procesando.value = false
      setTimeout(() => { bloqueadoTemporalmente = false }, 2500)
    }
    return false
  }

  // 3. No coincide en modo demo
  bloqueadoTemporalmente = true
  setFeedback(`QR "${texto.slice(0, 28)}" no pertenece a La Ruta Blanca.`, 'error')
  setTimeout(() => {
    bloqueadoTemporalmente = false
  }, 2500)
  return false
}

// Bucle de lectura de frames con jsQR
const escanearFrame = () => {
  if (estadoCamara.value !== 'activa' || desmontado) return

  const video = videoRef.value
  const canvas = canvasRef.value

  if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
    const width = video.videoWidth
    const height = video.videoHeight
    if (width > 0 && height > 0) {
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(video, 0, 0, width, height)
      const imageData = ctx.getImageData(0, 0, width, height)
      const code = jsQR(imageData.data, width, height, {
        inversionAttempts: 'attemptBoth'
      })

      if (code && code.data) {
        manejarQRDetectado(code.data)
      }
    }
  }

  rafId = requestAnimationFrame(escanearFrame)
}

const iniciarCamara = async () => {
  if (desmontado) return
  estadoCamara.value = 'solicitando'
  mensajeErrorCamara.value = ''

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    estadoCamara.value = 'error'
    mensajeErrorCamara.value = 'Tu navegador requiere HTTPS (o localhost) para acceder a la cámara.'
    return
  }

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    })

    if (desmontado) {
      detenerCamara()
      return
    }

    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream
      await videoRef.value.play()
    }

    const tracks = mediaStream.getVideoTracks()
    if (tracks.length > 0) {
      videoTrack = tracks[0]
      const capabilities = videoTrack.getCapabilities ? videoTrack.getCapabilities() : {}
      linternaDisponible.value = Boolean(capabilities.torch)
    }

    estadoCamara.value = 'activa'
    rafId = requestAnimationFrame(escanearFrame)
  } catch (err) {
    estadoCamara.value = 'error'
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      mensajeErrorCamara.value = 'Permiso de cámara denegado. Habilítalo en tu navegador o ingresa el código manualmente.'
    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      mensajeErrorCamara.value = 'No se detectó una cámara disponible en este dispositivo.'
    } else {
      mensajeErrorCamara.value = 'No se pudo iniciar la cámara. Puedes usar el ingreso manual o los QRs de prueba.'
    }
  }
}

const detenerCamara = () => {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop())
    mediaStream = null
    videoTrack = null
  }
}

const toggleLinterna = async () => {
  const nuevoEstado = !linternaEncendida.value
  if (videoTrack && linternaDisponible.value) {
    try {
      await videoTrack.applyConstraints({
        advanced: [{ torch: nuevoEstado }]
      })
      linternaEncendida.value = nuevoEstado
    } catch (err) {
      console.warn('No se pudo activar la linterna:', err)
    }
  } else {
    linternaEncendida.value = nuevoEstado
  }
}

const enviarCodigoManual = () => {
  if (!codigoManual.value.trim()) return
  bloqueadoTemporalmente = false
  manejarQRDetectado(codigoManual.value.trim())
}

const cerrarEscaner = () => {
  detenerCamara()
  emit('navigate', 'explorar')
}

const onVisibilidad = () => {
  if (document.hidden) {
    detenerCamara()
  } else if (!desmontado && estadoCamara.value === 'activa') {
    iniciarCamara()
  }
}

onMounted(async () => {
  document.addEventListener('visibilitychange', onVisibilidad)
  const tokenEnlace = consumePendingToken()
  const canjeado = tokenEnlace ? await manejarQRDetectado(tokenEnlace) : false
  if (!canjeado) {
    iniciarCamara()
  }
})

onBeforeUnmount(() => {
  desmontado = true
  document.removeEventListener('visibilitychange', onVisibilidad)
  detenerCamara()
})
</script>

<template>
  <div 
    class="relative w-full h-[100dvh] min-h-[580px] bg-inverse-surface flex flex-col justify-between overflow-hidden select-none p-4 pb-24 pt-safe"
    role="region"
    aria-label="Visor inmersivo de la cámara para escanear QR"
  >
    <!-- Stream de Cámara Real -->
    <video
      ref="videoRef"
      autoplay
      playsinline
      muted
      class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
      :class="estadoCamara === 'activa' ? 'opacity-100' : 'opacity-0'"
    ></video>

    <!-- Canvas oculto para decodificar frames QR con jsQR -->
    <canvas ref="canvasRef" class="hidden" aria-hidden="true"></canvas>

    <!-- Fondo arquitectónico fallback si la cámara está cargando o no disponible -->
    <div 
      v-if="estadoCamara !== 'activa'"
      class="absolute inset-0 bg-cover bg-center opacity-50 pointer-events-none"
      style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDu9jef_O-oR4wxg-eJGAHom05SCMl5juKyLto2stvlyRSgTzN1vBavjdvVBT9ShwvTiZz2nTUaPidIQPOJRo7IHA8MWRoNGKDX112Rr8mIowcOWvCJpHFdIogFsvpaop93_4q7nWNfy4BSMaUFpsTpjxkLJ8Kfo5ltqmuuT2qiEhzDDw2p5wq3V3eFW8SAjcbrmbYt_tMz8UVBruUysaFg52pMOvEmcK-4IP3rYMA');"
      aria-hidden="true"
    ></div>

    <!-- Viñeta sutil para legibilidad del HUD -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none"></div>

    <!-- BARRA SUPERIOR HUD: Volver, Estado y Linterna -->
    <div class="relative z-20 w-full max-w-md mx-auto flex items-center justify-between gap-2 pt-2">
      <button
        type="button"
        @click="cerrarEscaner"
        class="w-10 h-10 rounded-full bg-black/55 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/75 active:scale-95 transition-all shadow-md focus-visible:ring-2 focus-visible:ring-crimson"
        aria-label="Cerrar escáner y volver"
      >
        <span class="material-symbols-outlined text-[20px]" aria-hidden="true">arrow_back</span>
      </button>

      <div class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 shadow-lg">
        <span
          class="w-2 h-2 rounded-full shrink-0"
          :class="estadoCamara === 'activa' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-pulse'"
          aria-hidden="true"
        ></span>
        <span class="text-xs font-bold text-white truncate text-center">
          {{ estadoCamara === 'activa' ? 'Apunta al código QR del museo' : estadoCamara === 'solicitando' ? 'Iniciando cámara…' : 'Cámara no disponible' }}
        </span>
      </div>

      <button
        type="button"
        @click="toggleLinterna"
        class="w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90 focus-visible:ring-2 focus-visible:ring-crimson"
        :class="[
          linternaEncendida 
            ? 'bg-crimson text-white ring-2 ring-crimson/50' 
            : 'bg-black/55 backdrop-blur-md text-white'
        ]"
        :aria-label="linternaEncendida ? 'Apagar linterna' : 'Encender linterna'"
      >
        <span class="material-symbols-outlined text-[20px]" aria-hidden="true">
          {{ linternaEncendida ? 'flashlight_off' : 'flashlight_on' }}
        </span>
      </button>
    </div>

    <!-- RETÍCULA CENTRAL DE ESCANEO QR -->
    <div class="relative z-10 w-64 h-64 mx-auto my-auto flex flex-col items-center justify-center">
      <!-- Estado de Error / Sin Cámara -->
      <div
        v-if="estadoCamara === 'error'"
        class="w-full p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/15 text-center flex flex-col items-center gap-2.5 shadow-2xl"
      >
        <span class="material-symbols-outlined text-amber-400 text-[34px]" aria-hidden="true">no_photography</span>
        <p class="text-xs text-white/90 leading-relaxed">{{ mensajeErrorCamara }}</p>
        <div class="flex gap-2 w-full pt-1">
          <button
            type="button"
            @click="iniciarCamara"
            class="flex-1 py-2 px-3 rounded-xl bg-white/15 text-white text-[11px] font-bold hover:bg-white/25 transition-colors"
          >
            Reintentar
          </button>
          <button
            type="button"
            @click="mostrarManual = true"
            class="flex-1 py-2 px-3 rounded-xl bg-crimson text-white text-[11px] font-bold hover:bg-red-700 transition-colors"
          >
            Código Manual
          </button>
        </div>
      </div>

      <!-- Visor Activo con Esquineros y Láser -->
      <template v-else>
        <div class="absolute -inset-3 rounded-2xl opacity-30 animate-pulse bg-crimson/10 pointer-events-none" aria-hidden="true"></div>

        <!-- 4 Esquineros Carmesí -->
        <div class="absolute top-0 left-0 w-8 h-8 flex flex-col justify-start items-start pointer-events-none" aria-hidden="true">
          <div class="w-8 h-1.5 bg-crimson rounded-t"></div>
          <div class="w-1.5 h-6 bg-crimson rounded-bl"></div>
        </div>
        <div class="absolute top-0 right-0 w-8 h-8 flex flex-col justify-start items-end pointer-events-none" aria-hidden="true">
          <div class="w-8 h-1.5 bg-crimson rounded-t"></div>
          <div class="w-1.5 h-6 bg-crimson rounded-br"></div>
        </div>
        <div class="absolute bottom-0 left-0 w-8 h-8 flex flex-col justify-end items-start pointer-events-none" aria-hidden="true">
          <div class="w-1.5 h-6 bg-crimson rounded-tl"></div>
          <div class="w-8 h-1.5 bg-crimson rounded-b"></div>
        </div>
        <div class="absolute bottom-0 right-0 w-8 h-8 flex flex-col justify-end items-end pointer-events-none" aria-hidden="true">
          <div class="w-1.5 h-6 bg-crimson rounded-tr"></div>
          <div class="w-8 h-1.5 bg-crimson rounded-b"></div>
        </div>

        <!-- Cruz Central -->
        <div class="w-6 h-6 relative opacity-75 pointer-events-none" aria-hidden="true">
          <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-white -translate-y-1/2"></div>
          <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white -translate-x-1/2"></div>
        </div>

        <!-- Línea Láser Animada -->
        <div 
          class="absolute left-2 right-2 h-1 bg-gradient-to-r from-transparent via-secondary-container to-transparent shadow-[0_0_12px_#FD5B66] rounded-full animate-laser pointer-events-none"
          aria-hidden="true"
        ></div>

        <span class="absolute top-2 left-3 text-[10px] text-white/60 tracking-widest font-mono pointer-events-none">19°02'S</span>
        <span class="absolute bottom-2 right-3 text-[10px] text-white/60 tracking-widest font-mono pointer-events-none">65°15'W</span>
      </template>
    </div>

    <!-- Alerta / Estado de Validación -->
    <div
      v-if="feedbackEscaneo"
      class="relative z-30 w-full max-w-md mx-auto mb-2 px-4 py-2.5 rounded-xl text-xs font-bold text-center shadow-lg"
      :class="feedbackTipo === 'info' ? 'bg-slate-900/90 text-white border border-white/15' : 'bg-amber-500 text-slate-950'"
      role="status"
      aria-live="polite"
    >
      {{ feedbackEscaneo }}
    </div>

    <!-- HUD INFERIOR: Controles, Entrada Manual y QRs de Prueba -->
    <div class="relative z-20 w-full max-w-md mx-auto flex flex-col items-center gap-2.5">
      <!-- Panel Opcional de Ingreso Manual -->
      <form
        v-if="mostrarManual"
        @submit.prevent="enviarCodigoManual"
        class="w-full p-2.5 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/15 flex items-center gap-2 shadow-xl"
      >
        <input
          v-model="codigoManual"
          type="text"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          placeholder="Ej: RUTA-BLANCA-REC-1601"
          aria-label="Código o enlace de la placa QR"
          class="flex-1 min-w-0 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-crimson"
        />
        <button
          type="submit"
          :disabled="procesando || !codigoManual.trim()"
          class="px-3.5 py-2 rounded-xl bg-crimson text-white text-xs font-bold shrink-0 disabled:opacity-50 active:scale-95 transition-transform"
        >
          Validar
        </button>
      </form>

      <!-- Fila de Acciones -->
      <div class="w-full flex items-center justify-center gap-2">
        <button
          type="button"
          @click="mostrarManual = !mostrarManual"
          :aria-expanded="mostrarManual"
          class="px-3.5 py-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center gap-1.5 text-xs font-bold active:scale-95 transition-all shadow-md"
        >
          <span class="material-symbols-outlined text-[16px]" aria-hidden="true">keyboard</span>
          <span>Código</span>
        </button>

        <button
          type="button"
          @click="emit('open-qr-generator')"
          class="px-4 py-2.5 rounded-full bg-crimson text-white flex items-center gap-1.5 text-xs font-bold active:scale-95 transition-all shadow-lg"
        >
          <span class="material-symbols-outlined text-[16px]" aria-hidden="true">qr_code_2</span>
          <span>QRs de prueba</span>
        </button>

        <button
          type="button"
          @click="mostrarTips = !mostrarTips"
          class="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center active:scale-95 transition-all shadow-md"
          :aria-expanded="mostrarTips"
          aria-label="¿Dónde buscar el código QR?"
        >
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">lightbulb</span>
        </button>
      </div>
    </div>

    <!-- Drawer de Ayuda -->
    <div 
      v-if="mostrarTips"
      id="tipDrawer"
      class="relative z-30 w-full max-w-md mx-auto mt-2 p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl text-navy"
      role="region"
      aria-label="Consejo para encontrar la placa de La Ruta Blanca"
    >
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-full bg-crimson text-white flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">place</span>
        </div>
        <div class="flex-1 flex flex-col">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-extrabold text-crimson">Placa Oficial de Chuquisaca</h3>
            <button 
              type="button"
              @click="mostrarTips = false"
              class="text-gray-400 hover:text-navy"
              aria-label="Cerrar consejo"
            >
              <span class="material-symbols-outlined text-[18px]" aria-hidden="true">close</span>
            </button>
          </div>
          <p class="text-[11px] text-gray-600 mt-1 leading-relaxed">
            Busca las placas con el sello carmesí de <strong>La Ruta Blanca</strong> en los museos, o abre <strong>"QRs de prueba"</strong> para generar y escanear los códigos vinculados a tus cartas.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
