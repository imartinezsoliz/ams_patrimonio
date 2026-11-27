<script setup>
/**
 * ColeccionView.vue
 * Vista reactiva de Colección de Cartas Patrimoniales ("Mis Cartas").
 * Muestra cartas desbloqueadas (con sus fotos de /public/cartas/) primero,
 * progreso real calculado, filtros por categoría y acceso al generador de QRs.
 */
import { ref, computed } from 'vue'
import CardDetailModal from '../components/CardDetailModal.vue'

const props = defineProps({
  usuario: {
    type: Object,
    required: true
  },
  cartas: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['navigate', 'open-qr-generator'])

// Filtro de categoría: 'todas' | 'colonial' | 'presidencial' | 'mistica'
const categoriaSeleccionada = ref('todas')

// Modal de detalle de carta
const cartaSeleccionada = ref(null)
const modalAbierto = ref(false)

<<<<<<< HEAD
// Conteos dinámicos por categoría
const categorias = computed(() => [
  { id: 'todas', label: 'Todas', icono: 'style', total: props.cartas.length },
  { id: 'colonial', label: 'Coloniales', icono: 'account_balance', total: props.cartas.filter(c => c.categoria === 'colonial').length },
  { id: 'presidencial', label: 'Presidenciales', icono: 'flag', total: props.cartas.filter(c => c.categoria === 'presidencial').length },
  { id: 'mistica', label: 'Místicas', icono: 'auto_stories', total: props.cartas.filter(c => c.categoria === 'mistica').length },
])
=======
// Totales calculados desde los datos (antes estaban fijos en 15 / 5 / 4 / 6)
const totalCartas = CARTAS_MOCK.length
const totalDe = (categoria) => CARTAS_MOCK.filter(c => c.categoria === categoria).length

// Categorías disponibles con conteo reactivo
const categorias = [
  { id: 'todas', label: 'Todas', icono: 'style', total: totalCartas },
  { id: 'colonial', label: 'Coloniales', icono: 'account_balance', total: totalDe('colonial') },
  { id: 'presidencial', label: 'Presidenciales', icono: 'flag', total: totalDe('presidencial') },
  { id: 'mistica', label: 'Místicas', icono: 'auto_stories', total: totalDe('mistica') },
]
>>>>>>> 8812a9a30762b90271238441294b6ce66bd625d9

// Ordenar colocando primero las cartas desbloqueadas y aplicar filtro
const cartasFiltradas = computed(() => {
  const base = categoriaSeleccionada.value === 'todas'
    ? [...props.cartas]
    : props.cartas.filter(c => c.categoria === categoriaSeleccionada.value)

  return base.sort((a, b) => Number(b.desbloqueada) - Number(a.desbloqueada))
})

const totalCartasDescubiertas = computed(() => {
  return props.cartas.filter(c => c.desbloqueada).length
})

const totalPorEncontrar = computed(() => {
  return Math.max(0, props.cartas.length - totalCartasDescubiertas.value)
})

const porcentajeColeccion = computed(() => {
<<<<<<< HEAD
  if (!props.cartas.length) return 0
  return Math.round((totalCartasDescubiertas.value / props.cartas.length) * 100)
=======
  return totalCartas ? Math.round((totalCartasDescubiertas.value / totalCartas) * 100) : 0
>>>>>>> 8812a9a30762b90271238441294b6ce66bd625d9
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
<<<<<<< HEAD
      <div class="flex items-center justify-between gap-2">
        <span class="text-[11px] text-crimson uppercase tracking-widest font-extrabold flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" aria-hidden="true"></span>
          TUS RELIQUIAS ({{ totalCartasDescubiertas }}/{{ cartas.length }})
=======
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-primary uppercase tracking-widest font-extrabold flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" aria-hidden="true"></span>
          TUS RELIQUIAS COLECCIONADAS ({{ totalCartasDescubiertas }}/{{ totalCartas }})
>>>>>>> 8812a9a30762b90271238441294b6ce66bd625d9
        </span>

        <span class="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 text-[11px] font-bold flex items-center gap-1 shadow-2xs shrink-0">
          <span class="material-symbols-outlined text-[14px] text-amber-600" aria-hidden="true">military_tech</span>
          {{ usuario.rango || 'Explorador Novato' }}
        </span>
      </div>

      <!-- Barra de Progreso Gamificada -->
      <div 
        class="w-full bg-gray-200/70 rounded-full h-2.5 overflow-hidden p-0.5 flex items-center shadow-inner"
        role="progressbar"
        :aria-valuenow="porcentajeColeccion"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div 
          class="bg-gradient-to-r from-navy to-crimson h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(186,12,47,0.4)]"
          :style="{ width: `${Math.max(porcentajeColeccion, 4)}%` }"
        ></div>
      </div>

      <!-- Métricas de Descubrimiento + Botón de Códigos QR -->
      <div class="flex justify-between items-center text-gray-500 text-xs">
        <span class="flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px] text-crimson" aria-hidden="true">auto_awesome</span>
          <span class="tabular-nums font-bold text-navy">{{ totalCartasDescubiertas }}</span> descubiertas
        </span>

<<<<<<< HEAD
        <button
          type="button"
          @click="emit('open-qr-generator')"
          class="text-[11px] font-bold text-crimson hover:underline flex items-center gap-1 bg-red-50 px-2.5 py-1 rounded-full border border-red-100 active:scale-95 transition-transform"
        >
          <span class="material-symbols-outlined text-[14px]" aria-hidden="true">qr_code_2</span>
          <span>Ver QRs ({{ totalPorEncontrar }} por hallar)</span>
        </button>
=======
        <span class="font-medium text-tertiary">
          <span class="tabular-nums font-semibold">{{ totalCartas - totalCartasDescubiertas }}</span> por encontrar
        </span>
>>>>>>> 8812a9a30762b90271238441294b6ce66bd625d9
      </div>
    </div>

    <!-- Píldoras de Filtro Horizontal -->
    <div 
      class="flex items-center gap-2 overflow-x-auto touch-pan-x pb-1 -mx-4 px-4 no-scrollbar"
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
        class="shrink-0 px-4 py-1.5 rounded-full text-xs font-bold shadow-2xs flex items-center gap-1.5 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-crimson border"
        :class="[
          categoriaSeleccionada === cat.id
            ? 'bg-crimson text-white border-crimson'
            : 'bg-white text-gray-600 border-gray-200 hover:text-navy'
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
        <!-- CARTA DESBLOQUEADA -->
        <div 
          v-if="carta.desbloqueada"
          @click="abrirDetalles(carta)"
          class="relative group rounded-2xl bg-white p-2 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer active:scale-[0.98] overflow-hidden border border-red-100"
        >
          <!-- Marco carmesí -->
          <div class="absolute inset-0 rounded-2xl pointer-events-none shadow-[inset_0_0_0_2px_#BA0C2F]" aria-hidden="true"></div>

          <!-- Ventana Visual de la Carta -->
          <div class="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 shadow-xs flex items-center justify-center">
            <img 
              :src="carta.imagen" 
              :alt="`Fotografía de ${carta.titulo}`"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />

            <!-- Etiqueta Superior de "Obtenido" -->
            <div class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-crimson text-white text-[10px] uppercase tracking-wider font-extrabold shadow-xs flex items-center gap-1">
              <span class="material-symbols-outlined text-[12px]" aria-hidden="true">verified</span>
              <span>Obtenido</span>
            </div>

            <!-- Insignia de Rareza -->
            <div class="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-navy to-crimson text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
              {{ carta.rareza }}
            </div>
          </div>

          <!-- Pie de Metadatos -->
          <div class="pt-4 pb-1 px-1 flex flex-col items-center text-center">
            <h3 class="text-xs font-extrabold text-navy leading-tight tracking-tight line-clamp-1">
              {{ carta.titulo }}
            </h3>
            <span class="text-[11px] text-crimson font-semibold mt-0.5">
              {{ carta.fechaObtencion }}
            </span>
            <div class="flex items-center gap-1 mt-1 text-gray-500 text-[10px] font-bold">
              <span class="material-symbols-outlined text-[12px] text-amber-500" aria-hidden="true">stars</span>
              <span class="tabular-nums">+{{ carta.puntosGanados }} PTS</span>
            </div>
          </div>
        </div>

        <!-- CARTA BLOQUEADA (SILUETA Y CANDADO) -->
        <div 
          v-else
          class="relative rounded-2xl bg-white p-2 shadow-xs flex flex-col overflow-hidden opacity-90 border border-gray-200"
        >
          <div class="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
            <img 
              :src="carta.imagen" 
              :alt="`Silueta misteriosa de ${carta.titulo}`"
              class="w-full h-full object-cover filter blur-[2px] grayscale brightness-90"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-slate-200/45 backdrop-blur-[1px]" aria-hidden="true"></div>

            <!-- Candado Translúcido Central -->
            <div 
              class="relative z-10 w-11 h-11 rounded-full bg-white/85 backdrop-blur-md shadow-xs flex items-center justify-center text-gray-600"
              aria-hidden="true"
            >
              <span class="material-symbols-outlined text-[20px]">lock</span>
            </div>

            <!-- Píldora de Categoría -->
            <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/85 backdrop-blur-xs text-gray-700 text-[10px] font-bold">
              {{ carta.categoriaLabel }}
            </span>
          </div>

          <div class="pt-3 pb-1 px-1 flex flex-col items-center text-center">
            <h3 class="text-xs font-bold text-gray-500 leading-tight line-clamp-1">
              {{ carta.titulo }}
            </h3>
            <p class="text-[11px] text-gray-400 mt-1 line-clamp-1 flex items-center gap-1">
              <span class="material-symbols-outlined text-[12px]" aria-hidden="true">
                {{ carta.iconoPista || 'location_on' }}
              </span>
              <span>{{ carta.pista }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Banner Inferior de Llamada a la Acción -->
    <div 
      @click="emit('navigate', 'escaner')"
      class="w-full rounded-2xl bg-white border border-gray-200 p-3.5 flex items-center gap-3 shadow-xs mt-1 cursor-pointer active:scale-[0.99] transition-transform"
    >
      <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-crimson shrink-0 border border-red-100">
        <span class="material-symbols-outlined text-[20px]" aria-hidden="true">qr_code_scanner</span>
      </div>
      <div class="flex flex-col min-w-0 flex-1">
        <h4 class="text-xs font-extrabold text-navy truncate">¿Listo para escanear un QR?</h4>
        <p class="text-[11px] text-gray-500 leading-snug mt-0.5">
          Toca aquí para abrir tu cámara y desbloquear una nueva carta de tu colección.
        </p>
      </div>
      <span class="material-symbols-outlined text-crimson text-[20px]" aria-hidden="true">chevron_right</span>
    </div>

    <!-- Modal Detallado de Carta Desbloqueada -->
    <CardDetailModal 
      :carta="cartaSeleccionada"
      :is-open="modalAbierto"
      @close="modalAbierto = false"
    />
  </div>
</template>
