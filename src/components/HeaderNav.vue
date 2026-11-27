<script setup>
/**
 * HeaderNav.vue
 * Barra de navegación superior fija con soporte de Safe Area,
 * identidad de La Ruta Blanca (Sucre, Bolivia) y visualización reactiva de puntaje.
 */
defineProps({
  puntos: {
    type: Number,
    default: 150
  },
  mostrarEnEscaner: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['open-profile'])
</script>

<template>
  <header 
    class="fixed top-0 left-0 right-0 z-40 pt-safe bg-surface/85 backdrop-blur-xl border-b border-surface-container-high/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-all duration-300"
    role="banner"
  >
    <div class="h-16 px-4 max-w-md mx-auto flex items-center justify-between">
      <!-- Identidad de Marca: Escudo Cruz de San Andrés / Chuquisaca -->
      <div class="flex items-center gap-2.5">
        <div 
          class="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center shadow-xs border border-surface-container"
          aria-hidden="true"
        >
          <!-- Cruz carmesí representativa de Chuquisaca -->
          <svg class="w-6 h-6 text-primary-container" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10.5 2h3v6.5H20v3h-6.5V22h-3v-10.5H4v-3h6.5V2z" fill="#BA0C2F" />
          </svg>
        </div>
        
        <div class="flex flex-col">
          <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider leading-none">
            Sucre · Bolivia
          </span>
          <h1 class="text-[18px] font-extrabold tracking-tight text-primary leading-tight mt-0.5">
            LA RUTA BLANCA
          </h1>
        </div>
      </div>

      <!-- Métricas del Explorador y Avatar -->
      <div class="flex items-center gap-2">
        <!-- Píldora de Puntaje Gamificado -->
        <div 
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high/90 border border-surface-container shadow-xs"
          role="status"
          aria-label="Puntos acumulados del usuario"
        >
          <span class="material-symbols-outlined text-[18px] text-primary-container" aria-hidden="true">
            emoji_events
          </span>
          <span class="text-[13px] font-bold text-on-surface tracking-wide tabular-nums">
            {{ puntos }} PTS
          </span>
        </div>

        <!-- Botón de Perfil de Usuario -->
        <button
          type="button"
          @click="emit('open-profile')"
          class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs hover:bg-primary-container active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
          aria-label="Ver perfil del explorador"
        >
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">person</span>
        </button>
      </div>
    </div>
  </header>
</template>
