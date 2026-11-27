<script setup>
/**
 * App.vue
 * Layout contenedor principal de la aplicación móvil PWA "La Ruta Blanca" (Sucre, Bolivia).
 * Orquesta las 4 vistas mediante renderizado dinámico <component :is="...">,
 * gestiona el estado reactivo persistente en localStorage (cartas desbloqueadas y puntos),
 * la revelación inmediata tras escanear un QR y el generador de QRs de prueba.
 */
import { ref, computed, watch } from 'vue'
import HeaderNav from './components/HeaderNav.vue'
import BottomNav from './components/BottomNav.vue'
import CardDetailModal from './components/CardDetailModal.vue'
import QrGeneradorModal from './components/QrGeneradorModal.vue'
import ExplorarView from './views/ExplorarView.vue'
import MapaView from './views/MapaView.vue'
import EscanerView from './views/EscanerView.vue'
import ColeccionView from './views/ColeccionView.vue'
import { hasPendingToken } from './services/deeplink.js'
import { isSupabaseConfigured } from './lib/supabase.js'
import { USER_INITIAL_STATE, CARTAS_MOCK, MONUMENTOS_MOCK, MUSEOS_SUELTOS_MOCK } from './data/mockData.js'

const STORAGE_KEY = 'ruta_blanca_progreso_v1'

// Cargar progreso guardado en localStorage (solo en modo demo/offline; con Supabase manda el servidor)
const cargarProgresoInicial = () => {
  if (!isSupabaseConfigured) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && Array.isArray(parsed.desbloqueadas)) {
          return parsed
        }
      }
    } catch (e) {
      console.warn('No se pudo leer localStorage:', e)
    }
  }
  return {
    puntos: USER_INITIAL_STATE.puntos,
    desbloqueadas: CARTAS_MOCK.filter(c => c.desbloqueada).map(c => ({
      id: c.id,
      fechaObtencion: c.fechaObtencion
    }))
  }
}

const progresoGuardado = cargarProgresoInicial()

// Estado reactivo de cartas vinculado a mockData + localStorage
const cartas = ref(
  CARTAS_MOCK.map((c) => {
    const hallada = progresoGuardado.desbloqueadas.find((d) => d.id === c.id)
    return {
      ...c,
      desbloqueada: Boolean(hallada),
      fechaObtencion: hallada ? hallada.fechaObtencion : undefined
    }
  })
)

// Calcular rango dinámicamente según puntos
const calcularRango = (pts) => {
  if (pts >= 600) return 'Guardián del Patrimonio'
  if (pts >= 350) return 'Cronista de La Plata'
  return 'Explorador Novato'
}

const usuario = ref({
  ...USER_INITIAL_STATE,
  puntos: progresoGuardado.puntos,
  rango: calcularRango(progresoGuardado.puntos)
})

// Guardar automáticamente en localStorage cuando cambie el progreso
const guardarProgreso = () => {
  try {
    const payload = {
      puntos: usuario.value.puntos,
      desbloqueadas: cartas.value
        .filter((c) => c.desbloqueada)
        .map((c) => ({ id: c.id, fechaObtencion: c.fechaObtencion || 'Hallado hoy' }))
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch (e) {
    console.warn('No se pudo guardar en localStorage:', e)
  }
}

watch(
  () => [usuario.value.puntos, cartas.value.map((c) => c.desbloqueada)],
  () => guardarProgreso(),
  { deep: true }
)

// Vista inicial: Pantalla principal Explorar (sin mapa)
// (o directo al escáner si se llegó desde una placa QR: EscanerView canjea el token)
const vistaActual = ref(hasPendingToken() ? 'escaner' : 'explorar')

// Museo enfocado al abrir la pestaña Mapa
const museoEnMapa = ref(MONUMENTOS_MOCK[0])

const vistas = {
  explorar: ExplorarView,
  mapa: MapaView,
  escaner: EscanerView,
  coleccion: ColeccionView
}

const vistaComponente = computed(() => {
  return vistas[vistaActual.value] || ExplorarView
})

// Modal de revelación inmediata de Carta Desbloqueada al escanear QR
const cartaRevelada = ref(null)
const modalRevelacionAbierto = ref(false)
const cartaYaObtenida = ref(false)

// Modal generador de códigos QR
const modalQrAbierto = ref(false)

// Notificación emergente / Toast
const toastMensaje = ref('')
const toastVisible = ref(false)

const mostrarNotificacion = (mensaje) => {
  toastMensaje.value = mensaje
  toastVisible.value = true
  setTimeout(() => {
    toastVisible.value = false
  }, 3500)
}

const onLocateMuseum = (item) => {
  const encontrado =
    MUSEOS_SUELTOS_MOCK.find((m) => m.id === item.id) ||
    MONUMENTOS_MOCK.find((m) => m.id === item.id) || {
      ...item,
      topPercent: item.topPercent || '45%',
      leftPercent: item.leftPercent || '48%'
    }
  museoEnMapa.value = encontrado
}

/**
 * Procesa un escaneo QR válido:
 * Desbloquea la carta, suma puntos, guarda en localStorage y muestra la carta ganada.
 */
const onScanSuccess = (datosQR) => {
  const carta = cartas.value.find(
    (c) => c.id === datosQR.id || c.qrCodigo === datosQR.codigo
  )

  if (!carta) {
    mostrarNotificacion('Código QR no reconocido en el catálogo.')
    return
  }

  if (!carta.desbloqueada) {
    const hoy = new Date()
    const fechaFormateada = `Hallado hoy ${hoy.getDate()}/${hoy.getMonth() + 1}`
    carta.desbloqueada = true
    carta.fechaObtencion = fechaFormateada
    usuario.value.puntos += carta.puntosGanados
    usuario.value.rango = calcularRango(usuario.value.puntos)
    cartaYaObtenida.value = false
    mostrarNotificacion(`¡Reliquia desbloqueada: ${carta.titulo}! +${carta.puntosGanados} PTS`)
  } else {
    cartaYaObtenida.value = true
    mostrarNotificacion(`Ya posees la carta: ${carta.titulo}`)
  }

  cartaRevelada.value = carta
  modalRevelacionAbierto.value = true
}

// Simular escaneo directamente desde el modal de QRs de prueba
const simularEscaneoDesdeModal = (qrCodigo) => {
  const carta = cartas.value.find((c) => c.qrCodigo === qrCodigo)
  if (!carta) return
  modalQrAbierto.value = false
  onScanSuccess({
    id: carta.id,
    codigo: carta.qrCodigo,
    nombre: carta.titulo,
    puntos: carta.puntosGanados
  })
}

// Reiniciar colección para volver a probar el escaneo desde 0
const reiniciarProgreso = () => {
  cartas.value = CARTAS_MOCK.map((c) => ({
    ...c,
    desbloqueada: false,
    fechaObtencion: undefined
  }))
  usuario.value.puntos = 0
  usuario.value.rango = calcularRango(0)
  guardarProgreso()
  mostrarNotificacion('Progreso reiniciado: 0 cartas desbloqueadas.')
}

const irAMisCartasTrasDesbloqueo = () => {
  modalRevelacionAbierto.value = false
  cambiarVista('coleccion')
}

const cambiarVista = (nuevaVista) => {
  vistaActual.value = nuevaVista
  window.scrollTo({ top: 0, behavior: 'instant' })
}
</script>

<template>
  <div class="w-full min-h-screen bg-[#F9FAFB] flex flex-col font-sans text-on-surface antialiased overflow-x-hidden">
    <div class="w-full max-w-md mx-auto min-h-screen flex flex-col relative bg-[#F9FAFB] shadow-2xl sm:border-x sm:border-gray-100">
      
      <!-- Barra Superior: Oculta en Escáner para experiencia inmersiva h-screen -->
      <HeaderNav 
        v-if="vistaActual !== 'escaner'"
        :puntos="usuario.puntos" 
        @open-profile="mostrarNotificacion(`Explorador: ${usuario.nombre} · Rango: ${usuario.rango}`)"
      />

      <!-- Contenedor Principal con Renderizado Dinámico de Vistas -->
      <main 
        id="main-content"
        class="flex-1 flex flex-col w-full relative"
        :class="[
          vistaActual === 'escaner' 
            ? 'p-0 h-[100dvh] overflow-hidden' 
            : 'pt-20 pb-24 min-h-screen'
        ]"
        role="main"
      >
        <Transition name="fade-slide" mode="out-in">
          <component 
            :is="vistaComponente"
            :usuario="usuario"
            :cartas="cartas"
            :museo-inicial="museoEnMapa"
            @navigate="cambiarVista"
            @locate-museum="onLocateMuseum"
            @scan-success="onScanSuccess"
            @open-qr-generator="modalQrAbierto = true"
          />
        </Transition>
      </main>

      <!-- Barra de Navegación Inferior Fija (BottomNav) -->
      <BottomNav 
        :current-view="vistaActual" 
        @update:current-view="cambiarVista"
      />

      <!-- Modal Celebratorio de Carta Desbloqueada tras Escaneo -->
      <CardDetailModal
        :carta="cartaRevelada"
        :is-open="modalRevelacionAbierto"
        :es-desbloqueo="true"
        :ya-obtenida="cartaYaObtenida"
        @close="irAMisCartasTrasDesbloqueo"
        @go-collection="irAMisCartasTrasDesbloqueo"
      />

      <!-- Generador de Códigos QR de Prueba -->
      <QrGeneradorModal
        :cartas="cartas"
        :is-open="modalQrAbierto"
        @close="modalQrAbierto = false"
        @simulate-scan="simularEscaneoDesdeModal"
        @reset-progress="reiniciarProgreso"
      />

      <!-- Toast de Notificaciones y Recompensas -->
      <Transition name="toast-slide">
        <div 
          v-if="toastVisible"
          class="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm px-4 py-3 rounded-2xl bg-inverse-surface/95 backdrop-blur-xl text-inverse-on-surface shadow-2xl flex items-center gap-3 border border-white/10"
          role="status"
          aria-live="polite"
        >
          <div class="w-8 h-8 rounded-full bg-crimson text-white flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">stars</span>
          </div>
          <p class="text-xs font-semibold leading-snug flex-1">
            {{ toastMensaje }}
          </p>
        </div>
      </Transition>

    </div>
  </div>
</template>

<style>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px) scale(0.95);
}
</style>
