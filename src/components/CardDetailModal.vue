<script setup>
/**
 * CardDetailModal.vue
 * Modal interactivo para visualizar los detalles de una carta desbloqueada:
 * arte histórico, rareza, historia patrimonial y puntos obtenidos.
 */
defineProps({
  carta: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div 
      v-if="isOpen && carta"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`modal-title-${carta.id}`"
    >
      <!-- Fondo cliqueable para cerrar -->
      <div class="fixed inset-0" @click="emit('close')" aria-hidden="true"></div>

      <!-- Contenedor de la Carta -->
      <div 
        class="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl p-5 pb-8 shadow-2xl overflow-hidden flex flex-col gap-4 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto"
      >
        <!-- Manija de arrastre móvil -->
        <div class="w-12 h-1.5 rounded-full bg-surface-container-high mx-auto -mt-1 sm:hidden"></div>

        <!-- Encabezado del Modal -->
        <div class="flex items-center justify-between">
          <span class="text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-primary-fixed text-primary">
            {{ carta.categoriaLabel }} · {{ carta.rareza }}
          </span>

          <button
            type="button"
            @click="emit('close')"
            class="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-95 transition-all"
            aria-label="Cerrar detalles de la carta"
          >
            <span class="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
          </button>
        </div>

        <!-- Ventana de Arte de la Carta -->
        <div class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border-2 border-primary-container">
          <img 
            :src="carta.imagen" 
            :alt="`Ilustración histórica de ${carta.titulo}`"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

          <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
            <span class="text-xs font-semibold flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px] text-primary-container" aria-hidden="true">
                verified
              </span>
              {{ carta.fechaObtencion || 'Descubierto' }}
            </span>

            <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-primary-container text-on-primary">
              +{{ carta.puntosGanados }} PTS
            </span>
          </div>
        </div>

        <!-- Texto Histórico y Contenido -->
        <div class="flex flex-col gap-2">
          <h2 :id="`modal-title-${carta.id}`" class="text-xl font-extrabold text-on-surface">
            {{ carta.titulo }}
          </h2>
          <p class="text-sm text-on-surface-variant leading-relaxed">
            {{ carta.historiaCorta }}
          </p>
        </div>

        <!-- Acciones: Compartir y Explorar en Mapa -->
        <div class="flex gap-2.5 pt-2">
          <button
            type="button"
            @click="emit('close')"
            class="flex-1 py-3 px-4 rounded-xl bg-primary-container text-on-primary font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">check</span>
            ¡Genial!
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
