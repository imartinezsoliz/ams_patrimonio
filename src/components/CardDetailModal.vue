<script setup>
/**
 * CardDetailModal.vue
 * Modal interactivo para visualizar los detalles de una carta desbloqueada,
 * o celebrar el desbloqueo inmediato tras escanear un código QR.
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
        class="relative z-10 w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 pb-8 shadow-2xl overflow-hidden flex flex-col gap-4 max-h-[92vh] overflow-y-auto"
      >
        <!-- Manija móvil -->
        <div class="w-12 h-1.5 rounded-full bg-gray-200 mx-auto -mt-1 sm:hidden"></div>

        <!-- Banner de Celebración si proviene del Escáner QR -->
        <div
          v-if="esDesbloqueo"
          class="p-3 rounded-2xl flex items-center gap-3 border"
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
        <div class="flex items-center justify-between">
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

        <!-- Ventana de Arte de la Carta (Foto real de /public/cartas/) -->
        <div class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border-2 border-crimson bg-slate-100">
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

        <!-- Texto Histórico y Contenido -->
        <div class="flex flex-col gap-1.5">
          <h2 :id="`modal-title-${carta.id}`" class="text-xl font-extrabold text-navy">
            {{ carta.titulo }}
          </h2>
          <p class="text-sm text-gray-600 leading-relaxed">
            {{ carta.historiaCorta }}
          </p>
        </div>

        <!-- Acciones -->
        <div class="flex gap-2.5 pt-1">
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
