<script setup>
/**
 * App.vue
 * Layout contenedor principal de la aplicación móvil PWA "La Ruta Blanca" (Sucre, Bolivia).
 * Orquesta las 4 vistas mediante renderizado dinámico <component :is="...">:
 * - ExplorarView (Pantalla principal sin mapa, con Sabías que, Rutas y Museos Sueltos)
 * - MapaView (Pestaña dedicada exclusivamente al mapa con ubicación de museos)
 * - EscanerView (Visor inmersivo h-screen para códigos QR)
 * - ColeccionView (Catálogo de cartas patrimoniales)
 */
import { ref, computed } from 'vue'
import HeaderNav from './components/HeaderNav.vue'
import BottomNav from './components/BottomNav.vue'
import ExplorarView from './views/ExplorarView.vue'
import MapaView from './views/MapaView.vue'
import EscanerView from './views/EscanerView.vue'
import ColeccionView from './views/ColeccionView.vue'
import { USER_INITIAL_STATE, CARTAS_MOCK, MONUMENTOS_MOCK, MUSEOS_SUELTOS_MOCK } from './data/mockData.js'

const usuario = ref({ ...USER_INITIAL_STATE })

// Vista inicial: Pantalla principal Explorar (sin mapa)
const vistaActual = ref('explorar')

// Museo enfocado al abrir la pestaña Mapa desde Explorar o Rutas
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

// Notificación emergente / Toast para recompensas
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
    MUSEOS_SUELTOS_MOCK.find(m => m.id === item.id) ||
    MONUMENTOS_MOCK.find(m => m.id === item.id) || {
      ...item,
      topPercent: item.topPercent || '45%',
      leftPercent: item.leftPercent || '48%'
    }
  museoEnMapa.value = encontrado
}

const onScanSuccess = (datosQR) => {
  usuario.value.puntos += datosQR.puntos || 150

  const carta = CARTAS_MOCK.find(c => c.id === datosQR.id)
  if (carta && !carta.desbloqueada) {
    carta.desbloqueada = true
    carta.fechaObtencion = 'Hallado hoy'
    mostrarNotificacion(`¡Reliquia descubierta: ${carta.titulo}! +${datosQR.puntos} PTS`)
  } else {
    mostrarNotificacion(`¡Patrimonio verificado: ${datosQR.nombre}! +${datosQR.puntos} PTS`)
  }

  setTimeout(() => {
    vistaActual.value = 'coleccion'
  }, 1000)
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
            :museo-inicial="museoEnMapa"
            @navigate="cambiarVista"
            @locate-museum="onLocateMuseum"
            @scan-success="onScanSuccess"
          />
        </Transition>
      </main>

      <!-- Barra de Navegación Inferior Fija (BottomNav) -->
      <BottomNav 
        :current-view="vistaActual" 
        @update:current-view="cambiarVista"
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
