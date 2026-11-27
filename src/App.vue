<script setup>
/**
 * App.vue
 * Layout contenedor principal de la aplicación móvil PWA "La Ruta Blanca" (Sucre, Bolivia).
 * Implementa Composition API con <script setup>, navegación dinámica mediante <component :is="...">,
 * gestión reactiva de estado desacoplada y soporte preparado para Firebase y Geolocation API.
 */
import { ref, computed } from 'vue'
import HeaderNav from './components/HeaderNav.vue'
import BottomNav from './components/BottomNav.vue'
import MapaRutasView from './views/MapaRutasView.vue'
import EscanerView from './views/EscanerView.vue'
import ColeccionView from './views/ColeccionView.vue'
import { USER_INITIAL_STATE, CARTAS_MOCK } from './data/mockData.js'

// Estado del explorador (Preparado para sincronizarse con Firebase Auth & Firestore)
const usuario = ref({ ...USER_INITIAL_STATE })

// Vista actual reactiva: 'mapa' | 'escaner' | 'coleccion'
const vistaActual = ref('mapa')

// Mapeo dinámico de vistas
const vistas = {
  mapa: MapaRutasView,
  escaner: EscanerView,
  coleccion: ColeccionView
}

const vistaComponente = computed(() => {
  return vistas[vistaActual.value] || MapaRutasView
})

// Notificación emergente / Toast para recompensas y desbloqueos
const toastMensaje = ref('')
const toastVisible = ref(false)

const mostrarNotificacion = (mensaje) => {
  toastMensaje.value = mensaje
  toastVisible.value = true
  setTimeout(() => {
    toastVisible.value = false
  }, 3500)
}

/**
 * Manejador del escaneo exitoso de un código QR
 * Integra la lógica que en producción registrará el hallazgo en Firebase
 */
const onScanSuccess = (datosQR) => {
  // 1. Sumar puntaje al usuario
  usuario.value.puntos += datosQR.puntos || 150

  // 2. Desbloquear carta en la colección
  const carta = CARTAS_MOCK.find(c => c.id === datosQR.id)
  if (carta && !carta.desbloqueada) {
    carta.desbloqueada = true
    carta.fechaObtencion = 'Hallado hoy'
    mostrarNotificacion(`¡Reliquia descubierta: ${carta.titulo}! +${datosQR.puntos} PTS`)
  } else {
    mostrarNotificacion(`¡Patrimonio verificado: ${datosQR.nombre}! +${datosQR.puntos} PTS`)
  }

  // 3. Redirigir suavemente a la colección para ver la nueva carta
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
  <div class="w-full min-h-screen bg-surface flex flex-col font-sans text-on-surface antialiased overflow-x-hidden">
    <!-- Contenedor con ancho móvil estándar (Mobile First: max-w-md centrado en pantallas grandes) -->
    <div class="w-full max-w-md mx-auto min-h-screen flex flex-col relative bg-surface shadow-2xl sm:border-x sm:border-surface-container">
      
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
            : 'pt-16 pb-28 min-h-screen'
        ]"
        role="main"
      >
        <Transition name="fade-slide" mode="out-in">
          <component 
            :is="vistaComponente"
            :usuario="usuario"
            @navigate="cambiarVista"
            @scan-success="onScanSuccess"
          />
        </Transition>
      </main>

      <!-- Barra de Navegación Inferior Fija (BottomNav) -->
      <BottomNav 
        :current-view="vistaActual" 
        @update:current-view="cambiarVista"
      />

      <!-- Toast de Notificaciones y Recompensas (Accesible con aria-live) -->
      <Transition name="toast-slide">
        <div 
          v-if="toastVisible"
          class="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm px-4 py-3 rounded-2xl bg-inverse-surface/95 backdrop-blur-xl text-inverse-on-surface shadow-2xl flex items-center gap-3 border border-white/10"
          role="status"
          aria-live="polite"
        >
          <div class="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0">
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
/* Transición suave entre vistas de la aplicación */
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

/* Transición para el toast de logros y recompensas */
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
