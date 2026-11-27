<script setup>
/**
 * MuseoDetalleModal.vue
 * Modal / Bottom Sheet de detalle para cualquier museo seleccionado.
 * Muestra la fotografía, breve descripción histórica, horario, dirección
 * y un mini-mapa interactivo con su ubicación exacta en Sucre.
 */
defineProps({
  museo: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'open-in-map', 'scan'])
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen && museo"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 select-none"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`museo-title-${museo.id}`"
    >
      <!-- Fondo cliqueable para cerrar -->
      <div class="fixed inset-0" @click="emit('close')" aria-hidden="true"></div>

      <!-- Contenedor Modal -->
      <div class="relative z-10 w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <!-- Manija móvil -->
        <div class="w-12 h-1.5 rounded-full bg-gray-200 mx-auto mt-2.5 shrink-0 sm:hidden"></div>

        <!-- Imagen de Portada -->
        <div class="relative h-44 w-full shrink-0 overflow-hidden mt-1 bg-slate-100">
          <img
            :src="museo.imagen"
            :alt="`Fotografía de ${museo.nombre}`"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

          <!-- Botón Cerrar -->
          <button
            type="button"
            @click="emit('close')"
            class="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Cerrar detalle del museo"
          >
            <span class="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
          </button>

          <!-- Badges y Título -->
          <div class="absolute bottom-3 left-4 right-4 flex flex-col text-white">
            <div class="flex items-center gap-2">
              <span class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-crimson text-white shadow-xs">
                {{ museo.categoria }}
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white">
                +{{ museo.puntos }} PTS
              </span>
            </div>
            <h2 :id="`museo-title-${museo.id}`" class="text-lg font-extrabold tracking-tight mt-1 leading-tight">
              {{ museo.nombre }}
            </h2>
          </div>
        </div>

        <!-- Contenido Desplazable -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          <!-- Dirección y Horario -->
          <div class="grid grid-cols-2 gap-2.5">
            <div class="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2">
              <span class="material-symbols-outlined text-[18px] text-crimson shrink-0 mt-0.5" aria-hidden="true">pin_drop</span>
              <div class="min-w-0">
                <span class="text-[10px] font-bold text-gray-400 uppercase block">Dirección</span>
                <span class="text-xs font-semibold text-navy leading-snug block">{{ museo.direccion }}</span>
              </div>
            </div>

            <div class="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2">
              <span class="material-symbols-outlined text-[18px] text-navy shrink-0 mt-0.5" aria-hidden="true">schedule</span>
              <div class="min-w-0">
                <span class="text-[10px] font-bold text-gray-400 uppercase block">Horario</span>
                <span class="text-xs font-semibold text-navy leading-snug block">{{ museo.horario }}</span>
              </div>
            </div>
          </div>

          <!-- Breve Descripción -->
          <div class="space-y-1.5">
            <h3 class="text-xs font-extrabold text-navy uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-crimson" aria-hidden="true">info</span>
              Breve Descripción
            </h3>
            <p class="text-xs text-gray-600 leading-relaxed">
              {{ museo.descripcion }}
            </p>
          </div>

          <!-- Ubicación en el Mapa (Mini-Mapa Interactivo) -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-extrabold text-navy uppercase tracking-wider flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px] text-crimson" aria-hidden="true">map</span>
                Ubicación en el Mapa
              </h3>
              <span class="text-[11px] font-semibold text-gray-500">{{ museo.distancia }}</span>
            </div>

            <div
              @click="emit('open-in-map', museo)"
              class="relative w-full h-36 rounded-2xl overflow-hidden border border-gray-200 shadow-xs cursor-pointer group"
            >
              <!-- Plano de Sucre -->
              <div
                class="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZDjRoZrWbIRdRVxtBe3zl2BGsk34x6uXRNSLsxsOI1m9l56hV1eA5FaakTggicSpccRViEx3HmcehhfXJa37chGApHJLf_QJSVSrDNp7t6FsPOLp8VVHgZtENoey1wcJ0IJDM6OEOeQSWWH-r2RJyhCrxpaWRE_BHeyWr7IKnfW7zAUyb8qYKNU262B5_0wsGlgFtqUllmt7FmcQkfEj6iM1roPT-ZJtM60uM1gQ');"
              ></div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"></div>

              <!-- Pin Exacto del Museo -->
              <div
                class="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                :style="{ top: museo.topPercent || '45%', left: museo.leftPercent || '48%' }"
              >
                <div class="relative flex items-center justify-center">
                  <span class="absolute w-9 h-9 rounded-full bg-crimson/40 animate-ping"></span>
                  <div class="w-8 h-8 rounded-full bg-crimson text-white flex items-center justify-center shadow-lg ring-2 ring-white">
                    <span class="material-symbols-outlined text-[16px]" aria-hidden="true">{{ museo.icono || 'museum' }}</span>
                  </div>
                </div>
              </div>

              <!-- Etiqueta Inferior -->
              <div class="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold text-navy shadow-sm flex items-center gap-1">
                <span>Ampliar mapa</span>
                <span class="material-symbols-outlined text-[13px] text-crimson" aria-hidden="true">open_in_new</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Barra Inferior de Acciones -->
        <div class="p-3.5 bg-gray-50 border-t border-gray-100 shrink-0 flex gap-2.5">
          <button
            type="button"
            @click="emit('open-in-map', museo)"
            class="flex-1 py-2.5 px-3 rounded-xl bg-white border border-gray-200 text-navy font-bold text-xs active:scale-95 transition-transform flex items-center justify-center gap-1.5"
          >
            <span class="material-symbols-outlined text-[17px] text-crimson" aria-hidden="true">map</span>
            <span>Ver en Mapa</span>
          </button>

          <button
            type="button"
            @click="emit('scan', museo)"
            class="flex-1 py-2.5 px-3 rounded-xl bg-crimson text-white font-bold text-xs shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1.5"
          >
            <span class="material-symbols-outlined text-[17px]" aria-hidden="true">qr_code_scanner</span>
            <span>Escanear QR</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
