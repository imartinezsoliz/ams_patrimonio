<script setup>
/**
 * ColeccionView.vue
 * Vista de Colección de Cartas Patrimoniales ("Mis Cartas").
 * Despliega el catálogo de reliquias descubiertas y bloqueadas en una cuadrícula de 2 columnas,
 * filtros reactivos por categoría y apertura de detalles con historia colonial.
 */
import { ref, computed } from 'vue'
import { CARTAS_MOCK } from '../data/mockData.js'
import CardDetailModal from '../components/CardDetailModal.vue'

const props = defineProps({
  usuario: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['navigate'])

// Filtro de categoría: 'todas' | 'colonial' | 'presidencial' | 'mistica'
const categoriaSeleccionada = ref('todas')

// Modal de detalle de carta
const cartaSeleccionada = ref(null)
const modalAbierto = ref(false)

// Categorías disponibles con conteo reactivo
const categorias = [
  { id: 'todas', label: 'Todas', icono: 'style', total: 15 },
  { id: 'colonial', label: 'Coloniales', icono: 'account_balance', total: 5 },
  { id: 'presidencial', label: 'Presidenciales', icono: 'flag', total: 4 },
  { id: 'mistica', label: 'Místicas', icono: 'auto_stories', total: 6 },
]

// Filtrado computado
const cartasFiltradas = computed(() => {
  if (categoriaSeleccionada.value === 'todas') {
    return CARTAS_MOCK
  }
  return CARTAS_MOCK.filter(c => c.categoria === categoriaSeleccionada.value)
})

// Porcentaje de progreso de colección
const totalCartasDescubiertas = computed(() => {
  return CARTAS_MOCK.filter(c => c.desbloqueada).length
})

const porcentajeColeccion = computed(() => {
  return Math.round((totalCartasDescubiertas.value / 15) * 100)
})

const abrirDetalles = (carta) => {
  if (carta.desbloqueada) {
    cartaSeleccionada.value = carta
    modalAbierto.value = true
  }
}
</script>

<template>
  <div class="flex flex-col w-full px-4 pt-2 pb-6 gap-4 select-none">
    <!-- Encabezado de Progreso de la Colección -->
    <div class="flex flex-col gap-2 pt-1">
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-primary uppercase tracking-widest font-extrabold flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" aria-hidden="true"></span>
          TUS RELIQUIAS COLECCIONADAS ({{ totalCartasDescubiertas }}/15)
        </span>

        <span class="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary text-[11px] font-bold flex items-center gap-1 shadow-xs border border-surface-container">
          <span class="material-symbols-outlined text-[14px]" aria-hidden="true">military_tech</span>
          {{ usuario.rango || 'Explorador Novato' }}
        </span>
      </div>

      <!-- Barra de Progreso Gamificada con Gradiente Carmesí -->
      <div 
        class="w-full bg-surface-container rounded-full h-2.5 overflow-hidden p-0.5 flex items-center shadow-inner"
        role="progressbar"
        :aria-valuenow="porcentajeColeccion"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div 
          class="bg-gradient-to-r from-primary to-primary-container h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(186,12,47,0.5)]"
          :style="{ width: `${porcentajeColeccion || 7}%` }"
        ></div>
      </div>

      <!-- Métricas de Descubrimiento -->
      <div class="flex justify-between items-center text-on-surface-variant text-xs">
        <span class="flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px] text-primary-container" aria-hidden="true">
            auto_awesome
          </span>
          <span class="tabular-nums font-semibold">{{ totalCartasDescubiertas }}</span> descubierta
        </span>

        <span class="font-medium text-tertiary">
          <span class="tabular-nums font-semibold">{{ 15 - totalCartasDescubiertas }}</span> por encontrar
        </span>
      </div>
    </div>

    <!-- Píldoras de Filtro Horizontal -->
    <div 
      class="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar"
      role="tablist"
      aria-label="Filtrar cartas por categoría"
    >
      <button
        v-for="cat in categorias"
        :key="cat.id"
        type="button"
        role="tab"
        :aria-selected="categoriaSeleccionada === cat.id"
        @click="categoriaSeleccionada = cat.id"
        class="shrink-0 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs flex items-center gap-1.5 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-primary-container"
        :class="[
          categoriaSeleccionada === cat.id
            ? 'bg-primary-container text-on-primary'
            : 'bg-surface-container-lowest text-tertiary hover:text-on-surface hover:bg-surface-container-low'
        ]"
      >
        <span class="material-symbols-outlined text-[15px]" aria-hidden="true">{{ cat.icono }}</span>
        <span>{{ cat.label }} ({{ cat.total }})</span>
      </button>
    </div>

    <!-- Cuadrícula de Cartas (Grid Móvil de 2 Columnas) -->
    <div class="grid grid-cols-2 gap-3.5 pt-1">
      <div 
        v-for="carta in cartasFiltradas" 
        :key="carta.id"
        class="flex flex-col"
      >
        <!-- CARTA 1: DESBLOQUEADA -->
        <div 
          v-if="carta.desbloqueada"
          @click="abrirDetalles(carta)"
          class="relative group rounded-2xl bg-surface-container-lowest p-2 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer active:scale-[0.98] overflow-hidden border border-surface-container"
        >
          <!-- Resplandor del marco acentuado en Carmesí Chuquisaqueño -->
          <div class="absolute inset-0 rounded-2xl pointer-events-none shadow-[inset_0_0_0_2px_#BA0C2F]" aria-hidden="true"></div>

          <!-- Ventana Visual de la Carta -->
          <div class="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-surface-container-high shadow-xs flex items-center justify-center">
            <img 
              :src="carta.imagen" 
              :alt="`Ilustración de ${carta.titulo}`"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />

            <!-- Etiqueta Superior de "Obtenido" -->
            <div class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-primary-container text-on-primary text-[10px] uppercase tracking-wider font-extrabold shadow-xs flex items-center gap-1">
              <span class="material-symbols-outlined text-[12px]" aria-hidden="true">verified</span>
              <span>Obtenido</span>
            </div>

            <!-- Insignia de Rareza en el Centro Inferior -->
            <div class="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary text-[10px] font-extrabold uppercase tracking-wider shadow-md">
              {{ carta.rareza }}
            </div>
          </div>

          <!-- Pie de Metadatos de la Carta Desbloqueada -->
          <div class="pt-4 pb-1 px-1 flex flex-col items-center text-center">
            <h3 class="text-xs font-bold text-on-surface leading-tight tracking-tight line-clamp-1">
              {{ carta.titulo }}
            </h3>
            <span class="text-[11px] text-primary font-semibold mt-0.5">
              {{ carta.fechaObtencion }}
            </span>
            <div class="flex items-center gap-1 mt-1 text-on-surface-variant text-[10px] font-bold">
              <span class="material-symbols-outlined text-[12px] text-primary-container" aria-hidden="true">stars</span>
              <span class="tabular-nums">+{{ carta.puntosGanados }} PTS ganados</span>
            </div>
          </div>
        </div>

        <!-- CARTA 2: BLOQUEADA (MISTERIO / SILUETA) -->
        <div 
          v-else
          class="relative rounded-2xl bg-surface-container-lowest p-2 shadow-xs flex flex-col overflow-hidden opacity-90 border border-surface-container"
        >
          <!-- Área de silueta gris y misterio -->
          <div class="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-surface-container flex items-center justify-center">
            <img 
              :src="carta.imagen" 
              :alt="`Silueta misteriosa de ${carta.titulo}`"
              class="w-full h-full object-cover filter blur-[1.5px] grayscale brightness-90"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-surface-dim/40 backdrop-blur-[1px]" aria-hidden="true"></div>

            <!-- Candado Translúcido Central -->
            <div 
              class="relative z-10 w-11 h-11 rounded-full bg-surface-container-lowest/80 backdrop-blur-md shadow-xs flex items-center justify-center text-tertiary"
              aria-hidden="true"
            >
              <span class="material-symbols-outlined text-[20px]">lock</span>
            </div>

            <!-- Píldora de Categoría -->
            <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-surface-container-lowest/80 backdrop-blur-xs text-tertiary text-[10px] font-bold">
              {{ carta.categoriaLabel }}
            </span>
          </div>

          <!-- Pie de Metadatos de la Carta Bloqueada -->
          <div class="pt-3 pb-1 px-1 flex flex-col items-center text-center">
            <h3 class="text-xs font-bold text-tertiary leading-tight line-clamp-1">
              {{ carta.titulo }}
            </h3>
            <p class="text-[11px] text-on-surface-variant/80 mt-1 line-clamp-1 flex items-center gap-1">
              <span class="material-symbols-outlined text-[12px]" aria-hidden="true">
                {{ carta.iconoPista || 'location_on' }}
              </span>
              <span>{{ carta.pista }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Banner Inferior de Llamada a la Acción (Radar Nudge) -->
    <div class="w-full rounded-2xl bg-surface-container-low border border-surface-container p-3.5 flex items-center gap-3 shadow-xs mt-1">
      <div class="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0 shadow-xs">
        <span class="material-symbols-outlined text-[20px]" aria-hidden="true">radar</span>
      </div>
      <div class="flex flex-col min-w-0">
        <h4 class="text-xs font-bold text-on-surface truncate">¿Buscas tu próxima reliquia?</h4>
        <p class="text-[11px] text-on-surface-variant leading-snug mt-0.5">
          Camina cerca de los puntos del mapa y presiona el escáner al hallar la placa QR.
        </p>
      </div>
    </div>

    <!-- Modal Detallado de Carta Desbloqueada -->
    <CardDetailModal 
      :carta="cartaSeleccionada"
      :is-open="modalAbierto"
      @close="modalAbierto = false"
    />
  </div>
</template>
