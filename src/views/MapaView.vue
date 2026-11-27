<script setup>
/**
 * MapaView.vue
 * Nueva pestaña dedicada exclusivamente al Mapa Interactivo de Sucre
 * con la ubicación de los museos, pulso GPS en tiempo real y tarjeta inferior de selección.
 */
import { ref, watch } from 'vue'
import { MONUMENTOS_MOCK, MUSEOS_SUELTOS_MOCK } from '../data/mockData.js'

const props = defineProps({
  usuario: {
    type: Object,
    required: true
  },
  museoInicial: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['navigate'])

// Monumento seleccionado actualmente en el mapa
const monumentoSeleccionado = ref(props.museoInicial || MONUMENTOS_MOCK[0])
const isPinPopping = ref(false)
const gpsActivo = ref(false)

const ubicacionUsuario = ref({
  nombre: "Plaza 25 de Mayo (Centro)",
  lat: -19.0478,
  lng: -65.2595
})

// Sincronizar si el usuario llega desde "Ver en mapa" en otro apartado
watch(() => props.museoInicial, (nuevo) => {
  if (nuevo) {
    monumentoSeleccionado.value = nuevo
  }
})

const seleccionarMonumento = (monumento) => {
  monumentoSeleccionado.value = monumento
  isPinPopping.value = true
  setTimeout(() => {
    isPinPopping.value = false
  }, 250)
}

const centrarUbicacion = () => {
  if ('geolocation' in navigator) {
    gpsActivo.value = true
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        ubicacionUsuario.value.lat = pos.coords.latitude
        ubicacionUsuario.value.lng = pos.coords.longitude
        setTimeout(() => {
          gpsActivo.value = false
        }, 1200)
      },
      () => {
        gpsActivo.value = false
      },
      { enableHighAccuracy: true, timeout: 5000 }
    )
  }
}
</script>

<template>
  <div class="flex flex-col w-full px-4 pt-2 pb-6 gap-3.5 select-none">
    <!-- Encabezado Compacto del Mapa -->
    <div class="flex items-center justify-between pt-1">
      <div>
        <h2 class="text-base font-extrabold text-navy tracking-tight">Mapa de Museos</h2>
        <p class="text-[11px] text-gray-500">Ubicación de monumentos y placas QR en Sucre</p>
      </div>
      <span class="px-2.5 py-1 rounded-full bg-red-50 text-crimson text-[11px] font-bold flex items-center gap-1 border border-red-100">
        <span class="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" aria-hidden="true"></span>
        {{ MUSEOS_SUELTOS_MOCK.length }} Museos
      </span>
    </div>

    <!-- Viewport Principal del Mapa Interactivo -->
    <div class="relative w-full h-[54vh] min-h-[340px] max-h-[480px] rounded-2xl overflow-hidden shadow-md bg-slate-100 border border-gray-200">
      <!-- Plano de Sucre -->
      <div
        class="w-full h-full bg-cover bg-center transition-transform duration-700"
        data-location="Plaza 25 de Mayo, Sucre, Bolivia"
        style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZDjRoZrWbIRdRVxtBe3zl2BGsk34x6uXRNSLsxsOI1m9l56hV1eA5FaakTggicSpccRViEx3HmcehhfXJa37chGApHJLf_QJSVSrDNp7t6FsPOLp8VVHgZtENoey1wcJ0IJDM6OEOeQSWWH-r2RJyhCrxpaWRE_BHeyWr7IKnfW7zAUyb8qYKNU262B5_0wsGlgFtqUllmt7FmcQkfEj6iM1roPT-ZJtM60uM1gQ');"
        role="img"
        aria-label="Mapa interactivo con ubicación de los museos de Sucre"
      ></div>

      <div class="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

      <!-- Pines Interactivos de los 12 Museos -->
      <div
        v-for="monumento in MUSEOS_SUELTOS_MOCK"
        :key="monumento.id"
        class="absolute flex flex-col items-center group cursor-pointer -translate-x-1/2 -translate-y-1/2 z-20"
        :style="{ top: monumento.topPercent, left: monumento.leftPercent }"
        @click="seleccionarMonumento(monumento)"
      >
        <div class="relative flex items-center justify-center">
          <span
            v-if="monumentoSeleccionado.id === monumento.id"
            class="absolute w-9 h-9 rounded-full bg-crimson/40 animate-ping pointer-events-none"
            aria-hidden="true"
          ></span>
          <button
            type="button"
            :aria-label="`Seleccionar ${monumento.nombre} en el mapa`"
            class="w-8 h-8 rounded-full text-white flex items-center justify-center shadow-lg transition-all duration-200 group-hover:scale-110 focus-visible:ring-2 focus-visible:ring-offset-2"
            :class="[
              monumentoSeleccionado.id === monumento.id
                ? 'bg-crimson scale-110 ring-2 ring-white'
                : 'bg-navy hover:bg-crimson'
            ]"
          >
            <span class="material-symbols-outlined text-[16px]" aria-hidden="true">
              {{ monumento.icono }}
            </span>
          </button>
        </div>
        <!-- Etiqueta flotante del pin seleccionado -->
        <span
          v-if="monumentoSeleccionado.id === monumento.id"
          class="mt-1 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-sm text-[10px] font-bold text-navy shadow-sm whitespace-nowrap"
        >
          {{ monumento.nombre }}
        </span>
      </div>

      <!-- Pulso de Ubicación GPS del Usuario -->
      <div
        class="absolute top-[48%] left-[46%] flex items-center justify-center pointer-events-none z-10"
        title="Tu ubicación actual"
      >
        <span class="absolute w-10 h-10 rounded-full bg-blue-500/30 animate-ping"></span>
        <div class="w-4 h-4 rounded-full bg-blue-600 shadow-md ring-4 ring-white"></div>
      </div>

      <!-- Distintivo de Ubicación Actual -->
      <div class="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-gray-100 text-xs font-semibold text-navy">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></span>
        <span>{{ ubicacionUsuario.nombre }}</span>
      </div>

      <!-- Botón Flotante Centrar GPS -->
      <div class="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
        <button
          type="button"
          @click="centrarUbicacion"
          aria-label="Centrar en mi ubicación actual"
          class="w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md text-navy flex items-center justify-center shadow-md active:scale-95 transition-transform focus-visible:ring-2 focus-visible:ring-crimson"
        >
          <span
            class="material-symbols-outlined text-[19px]"
            :class="{ 'animate-spin text-crimson': gpsActivo }"
            aria-hidden="true"
          >
            my_location
          </span>
        </button>
      </div>
    </div>

    <!-- Tarjeta de Información del Museo Seleccionado en el Mapa -->
    <div
      class="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-200"
      :class="{ 'scale-[1.02] shadow-md': isPinPopping }"
    >
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-11 h-11 rounded-xl bg-crimson text-white flex items-center justify-center shrink-0 shadow-xs">
          <span class="material-symbols-outlined text-[22px]" aria-hidden="true">
            {{ monumentoSeleccionado.icono || 'museum' }}
          </span>
        </div>

        <div class="flex flex-col min-w-0">
          <span class="text-[10px] font-extrabold text-crimson uppercase tracking-wider">
            {{ monumentoSeleccionado.rareza || 'Museo' }} · +{{ monumentoSeleccionado.puntos || 100 }} PTS
          </span>
          <h3 class="text-sm font-extrabold text-navy truncate leading-tight mt-0.5">
            {{ monumentoSeleccionado.nombre }}
          </h3>
          <p class="text-[11px] text-gray-500 truncate mt-0.5">
            {{ monumentoSeleccionado.distancia || monumentoSeleccionado.direccion || 'Centro Histórico de Sucre' }}
          </p>
        </div>
      </div>

      <button
        type="button"
        @click="emit('navigate', 'escaner')"
        class="shrink-0 px-3.5 py-2 rounded-xl bg-crimson text-white text-xs font-bold shadow-xs hover:bg-red-700 active:scale-95 transition-all flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-crimson"
      >
        <span class="material-symbols-outlined text-[16px]" aria-hidden="true">qr_code_scanner</span>
        <span>Escanear</span>
      </button>
    </div>

    <!-- Selector Rápido Horizontal de Museos en el Mapa -->
    <div class="flex gap-2 overflow-x-auto touch-pan-x no-scrollbar pb-1 -mx-4 px-4">
      <button
        v-for="monumento in MUSEOS_SUELTOS_MOCK"
        :key="monumento.id"
        type="button"
        @click="seleccionarMonumento(monumento)"
        class="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 border"
        :class="[
          monumentoSeleccionado.id === monumento.id
            ? 'bg-navy text-white border-navy shadow-xs'
            : 'bg-white text-gray-600 border-gray-200 hover:border-crimson/40'
        ]"
      >
        <span class="material-symbols-outlined text-[15px]" aria-hidden="true">{{ monumento.icono }}</span>
        <span>{{ monumento.nombre }}</span>
      </button>
    </div>
  </div>
</template>
