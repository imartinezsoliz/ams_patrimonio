<script setup>
/**
 * EscanerView.vue
<<<<<<< HEAD
 * Vista inmersiva a pantalla completa (100dvh) con acceso real a la cámara trasera del dispositivo
 * mediante WebRTC (getUserMedia) y decodificación de códigos QR en tiempo real con jsQR.
 * Incluye control real de linterna (torch), entrada manual de respaldo y visor de QRs de prueba.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import jsQR from 'jsqr'
=======
 * Vista inmersiva a pantalla completa (h-screen / 100dvh) para el escáner de códigos QR.
 * Diseñada para búsqueda física de placas patrimoniales en Sucre.
 * Incluye HUD táctico Chuquisaqueño, láser animado, cámara real (qr-scanner), linterna,
 * ingreso manual del código y canje en el servidor (redeem_scan vía services/api.js).
 * Sin VITE_SUPABASE_* (modo demo) se conserva el escaneo simulado.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { extractToken, redeemScan, MENSAJES_ESCANEO } from '../services/api.js'
import { isSupabaseConfigured } from '../lib/supabase.js'
import { consumePendingToken } from '../services/deeplink.js'
>>>>>>> 8812a9a30762b90271238441294b6ce66bd625d9

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
const ultimoCodigoLeido = ref('')

<<<<<<< HEAD
let mediaStream = null
let videoTrack = null
let rafId = null
let bloqueadoTemporalmente = false

// Buscar carta coincidente por código QR o ID (acepta texto directo o URL /q/<token>)
const buscarCartaPorQR = (textoCrudo) => {
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
      // mantener limpio
    }
  }

  return props.cartas.find(
    (c) =>
      c.qrCodigo?.toLowerCase() === token.toLowerCase() ||
      c.id.toLowerCase() === token.toLowerCase()
  ) || null
=======
// --- Cámara real ---------------------------------------------------------------
const videoEl = ref(null)
const camaraActiva = ref(false)
const linternaDisponible = ref(false)
let scanner = null
let desmontado = false

// --- Estado del canje ----------------------------------------------------------
const procesando = ref(false)
const mensaje = ref('')
const mensajeTipo = ref('info') // 'info' | 'error'
const mostrarManual = ref(false)
const codigoManual = ref('')
let ultimoToken = ''
let ultimoTokenAt = 0

const setMensaje = (texto, tipo = 'info') => {
  mensaje.value = texto
  mensajeTipo.value = tipo
}

// Linterna: solo si la cámara la soporta (en iOS Safari normalmente no)
const toggleLinterna = async () => {
  if (!scanner || !linternaDisponible.value) return
  try {
    await scanner.toggleFlash()
    linternaEncendida.value = scanner.isFlashOn()
  } catch {
    linternaEncendida.value = false
  }
}

const iniciarCamara = async () => {
  if (desmontado) return
  try {
    const { default: QrScanner } = await import('qr-scanner')
    if (!(await QrScanner.hasCamera())) {
      setMensaje('No se encontró una cámara. Ingresa el código manualmente.', 'error')
      mostrarManual.value = true
      return
    }
    const instancia = new QrScanner(videoEl.value, (resultado) => procesarTexto(resultado.data), {
      preferredCamera: 'environment',
      maxScansPerSecond: 5,
      highlightScanRegion: false,
      highlightCodeOutline: false,
      returnDetailedScanResult: true
    })
    await instancia.start()
    if (desmontado) {
      instancia.destroy()
      return
    }
    scanner = instancia
    camaraActiva.value = true
    linternaDisponible.value = await scanner.hasFlash()
  } catch {
    setMensaje('No pudimos acceder a la cámara. Revisa los permisos o ingresa el código manualmente.', 'error')
    mostrarManual.value = true
  }
}

// Detener la cámara al salir de la app y retomarla al volver
const onVisibilidad = () => {
  if (!scanner) return
  if (document.hidden) scanner.stop()
  else scanner.start().catch(() => {})
}

onMounted(async () => {
  document.addEventListener('visibilitychange', onVisibilidad)
  // Llegada desde una placa QR (/q/<token>): se canjea primero y la cámara arranca después,
  // para no pedir permiso de cámara a quien ya escaneó con la del teléfono.
  const tokenEnlace = consumePendingToken()
  const canjeado = tokenEnlace ? await procesarTexto(tokenEnlace) : false
  if (!canjeado) iniciarCamara()
})

onBeforeUnmount(() => {
  desmontado = true
  document.removeEventListener('visibilitychange', onVisibilidad)
  scanner?.destroy()
  scanner = null
})

// Posición actual para validar que el usuario está en el lugar (si la niega, el servidor responde no_location)
const obtenerPosicion = () =>
  new Promise((resolve) => {
    if (!('geolocation' in navigator)) return resolve({})
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }),
      () => resolve({}),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
    )
  })

/** Recibe el texto leído por la cámara o escrito a mano: URL `/q/<token>` o el token suelto. Devuelve true si se canjeó. */
const procesarTexto = async (texto) => {
  if (procesando.value) return false
  if (!isSupabaseConfigured) {
    setMensaje('Modo demo: configura .env para validar códigos reales.', 'info')
    return false
  }
  const token = extractToken(texto)
  if (!token) {
    setMensaje('Este código no pertenece a La Ruta Blanca.', 'error')
    return false
  }
  // La cámara lee el mismo QR varias veces por segundo: ignora repeticiones inmediatas
  const ahora = Date.now()
  if (token === ultimoToken && ahora - ultimoTokenAt < 4000) return false
  ultimoToken = token
  ultimoTokenAt = ahora

  procesando.value = true
  setMensaje('Validando código…')
  try {
    const res = await redeemScan(token, await obtenerPosicion())
    if (res.result === 'success') {
      setMensaje('')
      emit('scan-success', {
        id: res.card?.id ?? res.site.id,
        nombre: res.site.name,
        puntos: res.points_earned
      })
      return true
    } else if (res.result === 'already_owned') {
      setMensaje(`Ya descubriste ${res.site?.name ?? 'este lugar'}.`)
    } else if (res.result === 'too_far') {
      setMensaje(`Estás a ${res.distance_m} m. Acércate a menos de ${res.radius_m} m de la placa.`, 'error')
    } else {
      setMensaje(MENSAJES_ESCANEO[res.result] ?? 'No se pudo validar el código.', 'error')
    }
  } catch {
    // Deja el código escrito para reintentar con "Validar" sin volver a escanear
    codigoManual.value = token
    mostrarManual.value = true
    setMensaje('No pudimos validar el código. Revisa tu conexión y pulsa Validar para reintentar.', 'error')
  } finally {
    procesando.value = false
  }
  return false
}

const enviarCodigoManual = () => {
  const texto = codigoManual.value
  if (!texto.trim()) return
  ultimoToken = '' // permite reintentar el mismo código a mano
  procesarTexto(texto)
>>>>>>> 8812a9a30762b90271238441294b6ce66bd625d9
}

// Procesar texto decodificado de un QR
const manejarQRDetectado = (texto) => {
  if (bloqueadoTemporalmente || !texto) return
  ultimoCodigoLeido.value = texto

  const carta = buscarCartaPorQR(texto)
  if (carta) {
    bloqueadoTemporalmente = true
    if ('vibrate' in navigator) {
      navigator.vibrate(120)
    }
    detenerCamara()
    emit('scan-success', {
      id: carta.id,
      codigo: carta.qrCodigo,
      nombre: carta.titulo,
      puntos: carta.puntosGanados,
      imagen: carta.imagen
    })
  } else {
    bloqueadoTemporalmente = true
    feedbackEscaneo.value = `QR "${texto.slice(0, 28)}" no pertenece a La Ruta Blanca.`
    setTimeout(() => {
      bloqueadoTemporalmente = false
      feedbackEscaneo.value = ''
    }, 2500)
  }
}

// Bucle de lectura de frames con jsQR
const escanearFrame = () => {
  if (estadoCamara.value !== 'activa') return

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
      mensajeErrorCamara.value = 'No se pudo iniciar la cámara. Puedes usar el ingreso manual o simular un QR.'
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
  manejarQRDetectado(codigoManual.value.trim())
}

const cerrarEscaner = () => {
  detenerCamara()
  emit('navigate', 'explorar')
}

onMounted(() => {
  iniciarCamara()
})

onUnmounted(() => {
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

<<<<<<< HEAD
    <!-- Viñeta sutil para legibilidad del HUD -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none"></div>
=======
    <!-- Cámara real (qr-scanner); mientras no esté activa se ve la imagen de fondo -->
    <video
      ref="videoEl"
      class="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-500"
      :class="camaraActiva ? 'opacity-100' : 'opacity-0'"
      muted
      playsinline
      aria-hidden="true"
    ></video>

    <!-- Filtro de Viñeta y Lente Suave -->
    <div class="absolute inset-0 bg-gradient-to-b from-inverse-surface/90 via-transparent to-inverse-surface/95 pointer-events-none"></div>
>>>>>>> 8812a9a30762b90271238441294b6ce66bd625d9

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
<<<<<<< HEAD
        class="w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90 focus-visible:ring-2 focus-visible:ring-crimson"
=======
        :disabled="!linternaDisponible"
        class="w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90 focus-visible:ring-2 focus-visible:ring-primary-container"
>>>>>>> 8812a9a30762b90271238441294b6ce66bd625d9
        :class="[
          !linternaDisponible && isSupabaseConfigured ? 'invisible' : '',
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

<<<<<<< HEAD
    <!-- Alerta si el QR no es de La Ruta Blanca -->
    <div
      v-if="feedbackEscaneo"
      class="relative z-30 w-full max-w-md mx-auto mb-2 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold text-center shadow-lg"
      role="alert"
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
=======
    <!-- HUD INFERIOR: Chip de Detección de Patrimonio y Controles -->
    <div class="relative z-20 w-full max-w-md mx-auto flex flex-col items-center gap-3 pb-2">
      <!-- Estado del canje (accesible) -->
      <p
        v-if="mensaje"
        class="w-full px-4 py-2.5 rounded-2xl text-xs font-bold text-center backdrop-blur-xl border shadow-xl"
        :class="mensajeTipo === 'error'
          ? 'bg-error-container/95 text-error border-error/30'
          : 'bg-inverse-surface/90 text-inverse-on-surface border-white/10'"
        role="status"
        aria-live="polite"
      >
        {{ mensaje }}
      </p>

      <!-- Ingreso manual del código (sin cámara o placa ilegible) -->
      <form
        v-if="mostrarManual"
        class="w-full flex items-center gap-2 p-2 rounded-2xl bg-inverse-surface/90 backdrop-blur-xl border border-white/10 shadow-xl"
        @submit.prevent="enviarCodigoManual"
      >
        <input
          v-model="codigoManual"
          type="text"
          inputmode="url"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          placeholder="Pega el enlace o código de la placa…"
          aria-label="Código o enlace de la placa QR"
          class="flex-1 min-w-0 px-3 py-2 rounded-xl bg-white/10 text-inverse-on-surface placeholder:text-inverse-on-surface/50 text-sm focus-visible:ring-2 focus-visible:ring-primary-container outline-none"
        />
        <button
          type="submit"
          :disabled="procesando || !codigoManual.trim()"
          class="px-4 py-2 rounded-xl bg-primary-container text-on-primary text-xs font-bold disabled:opacity-50 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-primary-container"
        >
          Validar
        </button>
      </form>

      <!-- Tarjeta Chip de Monumento en Foco (solo modo demo: escaneo simulado) -->
      <div 
        v-if="!isSupabaseConfigured"
        @click="simularEscaneoExitoso"
        class="w-full px-4 py-2.5 rounded-2xl bg-inverse-surface/90 backdrop-blur-xl border border-white/10 flex items-center justify-between shadow-xl cursor-pointer hover:bg-inverse-surface transition-colors"
        title="Clic para simular escaneo de esta placa"
>>>>>>> 8812a9a30762b90271238441294b6ce66bd625d9
      >
        <input
          v-model="codigoManual"
          type="text"
          placeholder="Ej: RUTA-BLANCA-REC-1601"
          class="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-crimson"
        />
        <button
          type="submit"
          class="px-3.5 py-2 rounded-xl bg-crimson text-white text-xs font-bold shrink-0 active:scale-95 transition-transform"
        >
          Validar
        </button>
      </form>

      <!-- Fila de Acciones -->
      <div class="w-full flex items-center justify-center gap-2">
        <button
          type="button"
          @click="mostrarManual = !mostrarManual"
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
          @click="mostrarManual = !mostrarManual"
          class="px-4 py-2.5 rounded-full bg-inverse-surface/80 backdrop-blur-md text-inverse-on-surface flex items-center gap-1.5 text-xs font-bold active:scale-95 transition-all shadow-md hover:bg-inverse-surface focus-visible:ring-2 focus-visible:ring-primary-container"
          :aria-expanded="mostrarManual"
        >
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">keyboard</span>
          <span>Código</span>
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
