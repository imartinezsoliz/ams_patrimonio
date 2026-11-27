<script setup>
/**
 * HeaderNav.vue
 * Barra de navegación superior fija con soporte de Safe Area,
 * identidad de La Ruta Blanca (Sucre, Bolivia) alineada al diseño del mockup.
 */
defineProps({
  puntos: {
    type: Number,
    default: 150
  }
})

const emit = defineEmits(['open-profile'])
</script>

<template>
  <header 
    class="fixed top-0 left-0 right-0 z-40 pt-safe bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300"
    role="banner"
  >
    <div class="h-16 px-4 max-w-md mx-auto flex items-center justify-between">
      <!-- Identidad de Marca: Escudo Carmesí -->
      <div class="flex items-center gap-2.5 min-w-0">
        <div 
          class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100"
          aria-hidden="true"
        >
          <svg class="w-6 h-6 text-crimson" fill="none" viewBox="0 0 24 24">
            <path d="M12 2L3 7v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7l-9-5z" fill="#BA0C2F" />
            <path d="M12 7v10M7 12h10" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" />
          </svg>
        </div>
        
        <div class="flex flex-col min-w-0">
          <h1 class="text-base font-extrabold text-navy tracking-tight leading-tight truncate">
            LA RUTA BLANCA
          </h1>
          <span class="text-[11px] font-semibold text-gray-500 tracking-normal truncate">
            Descubre los secretos de Sucre
          </span>
        </div>
      </div>

      <!-- Métricas del Explorador y Avatar -->
      <div class="flex items-center gap-2.5 shrink-0">
        <!-- Píldora de Puntaje Gamificado -->
        <div 
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 shadow-xs"
          role="status"
          aria-label="Puntos acumulados del usuario"
        >
          <span class="text-xs" aria-hidden="true">🏆</span>
          <span class="text-xs font-bold text-amber-900 tracking-wide tabular-nums">
            {{ puntos }} PTS
          </span>
        </div>

        <!-- Botón de Perfil de Usuario -->
        <button
          type="button"
          @click="emit('open-profile')"
          class="w-9 h-9 rounded-full bg-gradient-to-tr from-navy to-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-transform focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2"
          aria-label="Ver perfil del explorador"
        >
          <span class="material-symbols-outlined text-[19px]" aria-hidden="true">person</span>
        </button>
      </div>
    </div>
  </header>
</template>
