<script setup>
/**
 * EscanerView.vue
 * Vista inmersiva a pantalla completa (h-screen / 100dvh) para el escáner de códigos QR.
 * Diseñada para búsqueda física de placas patrimoniales en Sucre.
 * Incluye HUD táctico Chuquisaqueño, láser animado, control de linterna y preparado para cámara web/móvil.
 */
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['navigate', 'scan-success'])

// Estado reactivo de la linterna y drawer de ayuda
const linternaEncendida = ref(false)
const mostrarTips = ref(false)
const confianzaDeteccion = ref(78)
const escaneando = ref(true)

// Alternar linterna (Flashlight Toggle con simulación visual / Web MediaStream track)
const toggleLinterna = () => {
  linternaEncendida.value = !linternaEncendida.value
}

// Simular detección exitosa de un QR para pruebas instantáneas
const simularEscaneoExitoso = () => {
  emit('scan-success', {
    id: 'casa-de-la-libertad',
    codigo: 'RUTA-BLANCA-CDL-1825',
    nombre: 'Casa de la Libertad',
    puntos: 150
  })
}

// Cerrar y regresar al mapa
const cerrarEscaner = () => {
  emit('navigate', 'mapa')
}
</script>

<template>
  <div 
    class="relative w-full h-[100dvh] min-h-[580px] bg-inverse-surface flex flex-col justify-between overflow-hidden select-none p-4 pb-safe pt-safe"
    role="region"
    aria-label="Visor inmersivo de la cámara para escanear QR"
  >
    <!-- Fondo de Cámara Simulado (Fotografía arquitectónica de Sucre en alta definición) -->
    <div 
      class="absolute inset-0 bg-cover bg-center opacity-85 scale-105 transform transition-transform duration-700 pointer-events-none"
      style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDu9jef_O-oR4wxg-eJGAHom05SCMl5juKyLto2stvlyRSgTzN1vBavjdvVBT9ShwvTiZz2nTUaPidIQPOJRo7IHA8MWRoNGKDX112Rr8mIowcOWvCJpHFdIogFsvpaop93_4q7nWNfy4BSMaUFpsTpjxkLJ8Kfo5ltqmuuT2qiEhzDDw2p5wq3V3eFW8SAjcbrmbYt_tMz8UVBruUysaFg52pMOvEmcK-4IP3rYMA');"
      aria-hidden="true"
    ></div>

    <!-- Filtro de Viñeta y Lente Suave -->
    <div class="absolute inset-0 bg-gradient-to-b from-inverse-surface/90 via-transparent to-inverse-surface/95 pointer-events-none"></div>

    <!-- Partículas y Malla de Cámara Táctica HUD -->
    <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <pattern id="scannerGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1" fill="#FFFFFF" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#scannerGrid)" />
    </svg>

    <!-- BARRA SUPERIOR HUD: Botón Volver, Píldora Instructiva y Linterna -->
    <div class="relative z-20 w-full max-w-md mx-auto flex items-center justify-between gap-2 pt-2">
      <!-- Botón Volver / Cerrar -->
      <button
        type="button"
        @click="cerrarEscaner"
        class="w-10 h-10 rounded-full bg-inverse-surface/80 backdrop-blur-md flex items-center justify-center text-inverse-on-surface hover:bg-inverse-surface active:scale-95 transition-all shadow-md focus-visible:ring-2 focus-visible:ring-primary-container"
        aria-label="Cerrar escáner y volver al mapa"
      >
        <span class="material-symbols-outlined text-[20px]" aria-hidden="true">arrow_back</span>
      </button>

      <!-- Píldora Guía con Resplandor Táctico -->
      <div class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-inverse-surface/85 backdrop-blur-xl border border-white/10 shadow-lg">
        <span class="w-2 h-2 rounded-full bg-secondary-container animate-pulse shrink-0" aria-hidden="true"></span>
        <span class="text-xs font-bold text-inverse-on-surface truncate text-center">
          Busca el código QR de La Ruta Blanca
        </span>
      </div>

      <!-- Botón de Linterna / Flash -->
      <button
        type="button"
        @click="toggleLinterna"
        class="w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90 focus-visible:ring-2 focus-visible:ring-primary-container"
        :class="[
          linternaEncendida 
            ? 'bg-primary-container text-on-primary ring-2 ring-primary-container/40' 
            : 'bg-inverse-surface/80 backdrop-blur-md text-inverse-on-surface'
        ]"
        :aria-label="linternaEncendida ? 'Apagar linterna' : 'Encender linterna'"
      >
        <span class="material-symbols-outlined text-[20px]" aria-hidden="true">
          {{ linternaEncendida ? 'flashlight_off' : 'flashlight_on' }}
        </span>
      </button>
    </div>

    <!-- RETÍCULA CENTRAL Y MARCO HUD DE ESCANEO -->
    <div class="relative z-10 w-64 h-64 mx-auto my-auto flex items-center justify-center">
      <!-- Resplandor exterior pulsante -->
      <div class="absolute -inset-4 rounded-2xl opacity-40 animate-pulse bg-primary-container/15 pointer-events-none" aria-hidden="true"></div>

      <!-- 4 Esquineros Estilizados (HUD Chuquisaqueño) -->
      <!-- Esquina Superior Izquierda -->
      <div class="absolute top-0 left-0 w-8 h-8 flex flex-col justify-start items-start pointer-events-none" aria-hidden="true">
        <div class="w-8 h-1.5 bg-primary-container rounded-t"></div>
        <div class="w-1.5 h-6 bg-primary-container rounded-bl"></div>
      </div>
      <!-- Esquina Superior Derecha -->
      <div class="absolute top-0 right-0 w-8 h-8 flex flex-col justify-start items-end pointer-events-none" aria-hidden="true">
        <div class="w-8 h-1.5 bg-primary-container rounded-t"></div>
        <div class="w-1.5 h-6 bg-primary-container rounded-br"></div>
      </div>
      <!-- Esquina Inferior Izquierda -->
      <div class="absolute bottom-0 left-0 w-8 h-8 flex flex-col justify-end items-start pointer-events-none" aria-hidden="true">
        <div class="w-1.5 h-6 bg-primary-container rounded-tl"></div>
        <div class="w-8 h-1.5 bg-primary-container rounded-b"></div>
      </div>
      <!-- Esquina Inferior Derecha -->
      <div class="absolute bottom-0 right-0 w-8 h-8 flex flex-col justify-end items-end pointer-events-none" aria-hidden="true">
        <div class="w-1.5 h-6 bg-primary-container rounded-tr"></div>
        <div class="w-8 h-1.5 bg-primary-container rounded-b"></div>
      </div>

      <!-- Cruz Táctica Central (Homenaje a la Cruz de San Andrés de Chuquisaca) -->
      <div class="w-6 h-6 relative opacity-75 pointer-events-none" aria-hidden="true">
        <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-on-primary -translate-y-1/2"></div>
        <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-on-primary -translate-x-1/2"></div>
      </div>

      <!-- Línea Láser Animada -->
      <div 
        class="absolute left-2 right-2 h-1 bg-gradient-to-r from-transparent via-secondary-container to-transparent shadow-[0_0_12px_#FD5B66] rounded-full animate-laser pointer-events-none"
        aria-hidden="true"
      ></div>

      <!-- Coordenadas Geográficas de Sucre en las Esquinas -->
      <span class="absolute top-2 left-3 text-[10px] text-on-primary/60 tracking-widest font-mono pointer-events-none">
        19°02'S
      </span>
      <span class="absolute bottom-2 right-3 text-[10px] text-on-primary/60 tracking-widest font-mono pointer-events-none">
        65°15'W
      </span>
    </div>

    <!-- HUD INFERIOR: Chip de Detección de Patrimonio y Controles -->
    <div class="relative z-20 w-full max-w-md mx-auto flex flex-col items-center gap-3 pb-2">
      <!-- Tarjeta Chip de Monumento en Foco -->
      <div 
        @click="simularEscaneoExitoso"
        class="w-full px-4 py-2.5 rounded-2xl bg-inverse-surface/90 backdrop-blur-xl border border-white/10 flex items-center justify-between shadow-xl cursor-pointer hover:bg-inverse-surface transition-colors"
        title="Clic para simular escaneo de esta placa"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-8 h-8 rounded-xl bg-primary-container flex items-center justify-center shrink-0 shadow-xs">
            <span class="material-symbols-outlined text-on-primary text-[18px]" aria-hidden="true">account_balance</span>
          </div>
          <div class="flex flex-col min-w-0">
            <span class="text-[10px] text-on-primary-container uppercase tracking-wider font-extrabold">
              Patrimonio en foco
            </span>
            <span class="text-sm font-bold text-inverse-on-surface truncate">
              Casa de la Libertad
            </span>
          </div>
        </div>

        <!-- Indicador de Confianza del Reconocimiento -->
        <div class="flex flex-col items-end shrink-0 pl-2">
          <span class="text-[11px] text-secondary-container font-mono font-bold tabular-nums">
            {{ confianzaDeteccion }}%
          </span>
          <div class="w-12 h-1.5 rounded-full bg-tertiary-container overflow-hidden mt-0.5">
            <div 
              class="h-full bg-secondary-container rounded-full transition-all duration-300"
              :style="{ width: `${confianzaDeteccion}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Fila de Acciones: Cerrar y ¿Dónde buscar? -->
      <div class="w-full flex items-center justify-center gap-3 mt-1">
        <button
          type="button"
          @click="cerrarEscaner"
          class="px-5 py-2.5 rounded-full bg-inverse-surface/80 backdrop-blur-md text-inverse-on-surface flex items-center gap-2 text-xs font-bold active:scale-95 transition-all shadow-md hover:bg-inverse-surface focus-visible:ring-2 focus-visible:ring-primary-container"
        >
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">close</span>
          <span>Cerrar</span>
        </button>

        <button
          type="button"
          @click="mostrarTips = !mostrarTips"
          class="px-4 py-2.5 rounded-full bg-primary-container text-on-primary flex items-center gap-1.5 text-xs font-bold active:scale-95 transition-all shadow-lg hover:bg-primary focus-visible:ring-2 focus-visible:ring-primary-container"
          :aria-expanded="mostrarTips"
          aria-controls="tipDrawer"
        >
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">lightbulb</span>
          <span>¿Dónde buscar?</span>
        </button>
      </div>
    </div>

    <!-- Modal / Drawer Emergente de Consejos de Búsqueda -->
    <div 
      v-if="mostrarTips"
      id="tipDrawer"
      class="relative z-30 w-full max-w-md mx-auto p-4 rounded-2xl bg-surface-container-high/95 backdrop-blur-xl border border-surface-container shadow-2xl text-on-surface transition-all duration-300"
      role="region"
      aria-label="Consejo para encontrar la placa de La Ruta Blanca"
    >
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">place</span>
        </div>

        <div class="flex-1 flex flex-col">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-extrabold text-primary">Placa Oficial de Chuquisaca</h3>
            <button 
              type="button"
              @click="mostrarTips = false"
              class="text-on-surface-variant hover:text-on-surface focus-visible:ring-2 focus-visible:ring-primary-container rounded"
              aria-label="Cerrar consejo"
            >
              <span class="material-symbols-outlined text-[18px]" aria-hidden="true">close</span>
            </button>
          </div>

          <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">
            Busca las placas de bronce con el sello carmesí de <strong class="text-on-surface font-semibold">La Ruta Blanca</strong> ubicadas en el zaguán de ingreso o en los dinteles de la puerta principal.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
