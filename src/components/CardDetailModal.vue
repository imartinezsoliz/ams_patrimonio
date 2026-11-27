<script setup>
/**
 * CardDetailModal.vue
 * Modal interactivo para visualizar los detalles completos de una carta desbloqueada,
 * o celebrar el desbloqueo inmediato tras escanear un código QR mostrando la fotografía
 * real e información histórica ampliada del museo correspondiente.
 */
defineProps({
  carta: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  },
  esDesbloqueo: {
    type: Boolean,
    default: false
  },
  yaObtenida: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'go-collection'])
</script>

<template>
  <Teleport to="body">
    <div 
      v-if="isOpen && carta"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-sm p-0 sm:p-4 transition-opacity duration-300 select-none"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`modal-title-${carta.id}`"
    >
      <!-- Fondo cliqueable para cerrar -->
      <div class="fixed inset-0" @click="emit('close')" aria-hidden="true"></div>

      <!-- Contenedor de la Carta -->
      <div 
        class="relative z-10 w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 pb-7 shadow-2xl overflow-hidden flex flex-col gap-3.5 max-h-[92vh] overflow-y-auto"
      >
        <!-- Manija móvil -->
        <div class="w-12 h-1.5 rounded-full bg-gray-200 mx-auto -mt-1 shrink-0 sm:hidden"></div>

        <!-- Banner de Celebración si proviene del Escáner QR -->
        <div
          v-if="esDesbloqueo"
          class="p-3 rounded-2xl flex items-center gap-3 border shrink-0"
          :class="yaObtenida ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-red-50 border-red-200 text-crimson'"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm"
            :class="yaObtenida ? 'bg-amber-500' : 'bg-crimson'"
          >
            <span class="material-symbols-outlined text-[22px]" aria-hidden="true">
              {{ yaObtenida ? 'verified' : 'celebration' }}
            </span>
          </div>
          <div class="flex flex-col min-w-0">
            <span class="text-xs font-extrabold uppercase tracking-wide">
              {{ yaObtenida ? '¡Ya tienes esta carta!' : '¡Nueva Carta Desbloqueada!' }}
            </span>
            <span class="text-[11px] font-medium opacity-85">
              {{ yaObtenida ? 'Esta reliquia ya forma parte de tu colección.' : `Has ganado +${carta.puntosGanados} PTS para tu rango.` }}
            </span>
          </div>
        </div>

        <!-- Encabezado del Modal -->
        <div class="flex items-center justify-between shrink-0">
          <span class="text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-red-50 text-crimson border border-red-100">
            {{ carta.categoriaLabel }} · {{ carta.rareza }}
          </span>

          <button
            type="button"
            @click="emit('close')"
            class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-navy active:scale-95 transition-all"
            aria-label="Cerrar detalles de la carta"
          >
            <span class="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
          </button>
        </div>

        <!-- Ventana de Arte de la Carta (Foto real de /public/cartas/ o /public/museos/) -->
        <div class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border-2 border-crimson bg-slate-100 shrink-0">
          <img 
            :src="carta.imagen" 
            :alt="`Fotografía de ${carta.titulo}`"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>

          <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
            <span class="text-xs font-semibold flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px] text-emerald-400" aria-hidden="true">
                verified
              </span>
              {{ carta.fechaObtencion || 'Desbloqueado' }}
            </span>

            <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-crimson text-white shadow-sm">
              +{{ carta.puntosGanados }} PTS
            </span>
          </div>
        </div>

        <!-- Título y Resumen -->
        <div class="flex flex-col gap-1.5">
          <h2 :id="`modal-title-${carta.id}`" class="text-xl font-extrabold text-navy leading-tight">
            {{ carta.titulo }}
          </h2>
          <p class="text-xs font-semibold text-crimson leading-relaxed">
            {{ carta.historiaCorta }}
          </p>
        </div>

        <!-- Mayor Información Histórica del Museo -->
        <div
          v-if="carta.informacionDetallada"
          class="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2"
        >
          <h3 class="text-[11px] font-extrabold text-navy uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-crimson" aria-hidden="true">menu_book</span>
            Historia y Patrimonio del Museo
          </h3>
          <p class="text-xs text-gray-600 leading-relaxed">
            {{ carta.informacionDetallada }}
          </p>
        </div>

        <!-- Piezas o Puntos Imperdibles -->
        <div v-if="carta.destacados && carta.destacados.length" class="space-y-1.5">
          <h3 class="text-[11px] font-extrabold text-navy uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-crimson" aria-hidden="true">auto_awesome</span>
            Qué no te puedes perder
          </h3>
          <ul class="space-y-1.5">
            <li
              v-for="(item, idx) in carta.destacados"
              :key="idx"
              class="flex items-start gap-2 text-xs text-gray-700 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-2xs"
            >
              <span class="material-symbols-outlined text-[15px] text-crimson shrink-0 mt-0.5" aria-hidden="true">
                check_circle
              </span>
              <span class="leading-snug">{{ item }}</span>
            </li>
          </ul>
        </div>

        <!-- Datos Prácticos de Visita -->
        <div v-if="carta.direccion || carta.horario" class="grid grid-cols-2 gap-2">
          <div v-if="carta.direccion" class="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-crimson shrink-0 mt-0.5" aria-hidden="true">pin_drop</span>
            <div class="min-w-0">
              <span class="text-[9px] font-bold text-gray-400 uppercase block">Ubicación</span>
              <span class="text-[11px] font-semibold text-navy leading-snug block">{{ carta.direccion }}</span>
            </div>
          </div>

          <div v-if="carta.horario" class="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-navy shrink-0 mt-0.5" aria-hidden="true">schedule</span>
            <div class="min-w-0">
              <span class="text-[9px] font-bold text-gray-400 uppercase block">Horario</span>
              <span class="text-[11px] font-semibold text-navy leading-snug block">{{ carta.horario }}</span>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="flex gap-2.5 pt-1 shrink-0">
          <button
            v-if="esDesbloqueo"
            type="button"
            @click="emit('go-collection')"
            class="flex-1 py-3 px-4 rounded-xl bg-crimson text-white font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">style</span>
            <span>Ver en Mis Cartas</span>
          </button>

          <button
            v-else
            type="button"
            @click="emit('close')"
            class="flex-1 py-3 px-4 rounded-xl bg-crimson text-white font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">check</span>
            <span>¡Genial!</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
