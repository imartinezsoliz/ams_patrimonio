<script setup>
/**
 * BottomNav.vue
 * Barra de navegación inferior móvil fija, optimizada para pulgares (ergonomía móvil).
 * Botón central flotante elevado para el escáner de códigos QR con micro-interacción.
 */
defineProps({
  currentView: {
    type: String,
    required: true,
    validator: (value) => ['mapa', 'escaner', 'coleccion'].includes(value)
  }
})

const emit = defineEmits(['update:currentView'])

const cambiarVista = (nuevaVista) => {
  emit('update:currentView', nuevaVista)
}
</script>

<template>
  <nav 
    class="fixed bottom-0 left-0 right-0 z-40 pb-safe bg-surface-container-lowest/95 backdrop-blur-xl border-t border-surface-container-high/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    aria-label="Navegación principal de la aplicación"
  >
    <div class="h-20 px-6 max-w-md mx-auto flex items-center justify-between relative">
      <!-- Pestaña 1: Mapa Cultural y Rutas -->
      <button
        type="button"
        @click="cambiarVista('mapa')"
        :aria-current="currentView === 'mapa' ? 'page' : undefined"
        class="flex flex-col items-center justify-center gap-1 w-20 h-full transition-colors focus-visible:ring-2 focus-visible:ring-primary-container rounded-lg"
        :class="[
          currentView === 'mapa'
            ? 'text-primary-container font-bold'
            : 'text-on-surface-variant hover:text-on-surface'
        ]"
      >
        <span 
          class="material-symbols-outlined text-[24px] transition-transform duration-200"
          :class="{ 'scale-110': currentView === 'mapa' }"
          aria-hidden="true"
        >
          map
        </span>
        <span class="text-[11px] tracking-wide">Mapa</span>
      </button>

      <!-- Botón Central Flotante: Escáner QR de Monumentos (Elevado) -->
      <div class="relative -top-5 flex flex-col items-center justify-center">
        <button
          type="button"
          @click="cambiarVista('escaner')"
          :aria-current="currentView === 'escaner' ? 'page' : undefined"
          aria-label="Abrir escáner QR de monumentos"
          class="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center shadow-[0_8px_20px_-2px_rgba(186,12,47,0.45)] text-on-primary active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
          :class="{ 'ring-4 ring-primary-container/20 ring-offset-2': currentView === 'escaner' }"
        >
          <!-- Pulso animado sutil que guía la acción principal -->
          <span 
            class="absolute -inset-1 rounded-full bg-primary-container/25 animate-ping pointer-events-none"
            aria-hidden="true"
          ></span>
          
          <span 
            class="material-symbols-outlined text-[30px] relative z-10 transition-transform duration-200"
            :class="{ 'rotate-90': currentView === 'escaner' }"
            aria-hidden="true"
          >
            qr_code_scanner
          </span>
        </button>

        <span 
          class="text-[11px] mt-1.5 font-bold transition-colors"
          :class="[
            currentView === 'escaner' 
              ? 'text-primary-container' 
              : 'text-on-surface-variant'
          ]"
        >
          Escanear
        </span>
      </div>

      <!-- Pestaña 3: Mis Cartas / Colección -->
      <button
        type="button"
        @click="cambiarVista('coleccion')"
        :aria-current="currentView === 'coleccion' ? 'page' : undefined"
        class="flex flex-col items-center justify-center gap-1 w-20 h-full transition-colors focus-visible:ring-2 focus-visible:ring-primary-container rounded-lg"
        :class="[
          currentView === 'coleccion'
            ? 'text-primary-container font-bold'
            : 'text-on-surface-variant hover:text-on-surface'
        ]"
      >
        <span 
          class="material-symbols-outlined text-[24px] transition-transform duration-200"
          :class="{ 'scale-110': currentView === 'coleccion' }"
          aria-hidden="true"
        >
          style
        </span>
        <span class="text-[11px] tracking-wide">Mis Cartas</span>
      </button>
    </div>
  </nav>
</template>
