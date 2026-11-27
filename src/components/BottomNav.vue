<script setup>
/**
 * BottomNav.vue
 * Barra de navegación inferior móvil fija con 4 vistas:
 * Explorar (Principal), Mapa (Ubicación de Museos), Escanear (Botón flotante QR) y Mis Cartas.
 */
defineProps({
  currentView: {
    type: String,
    required: true,
    validator: (value) => ['explorar', 'mapa', 'escaner', 'coleccion'].includes(value)
  }
})

const emit = defineEmits(['update:currentView'])

const cambiarVista = (nuevaVista) => {
  emit('update:currentView', nuevaVista)
}
</script>

<template>
  <nav 
    class="fixed bottom-0 left-0 right-0 z-40 pb-safe bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
    aria-label="Navegación principal de la aplicación"
  >
    <div class="h-16 px-2 max-w-md mx-auto grid grid-cols-4 items-center relative">
      <!-- Pestaña 1: Explorar (Inicio con Sabías que, Rutas y Museos) -->
      <button
        type="button"
        @click="cambiarVista('explorar')"
        :aria-current="currentView === 'explorar' ? 'page' : undefined"
        class="flex flex-col items-center justify-center gap-0.5 h-full transition-colors focus-visible:ring-2 focus-visible:ring-crimson rounded-lg"
        :class="[
          currentView === 'explorar'
            ? 'text-crimson font-bold'
            : 'text-gray-400 hover:text-gray-700 font-medium'
        ]"
      >
        <span 
          class="material-symbols-outlined text-[22px] transition-transform duration-200"
          :class="{ 'scale-110': currentView === 'explorar' }"
          aria-hidden="true"
        >
          explore
        </span>
        <span class="text-[10px] tracking-tight">Explorar</span>
      </button>

      <!-- Pestaña 2: Mapa (Ubicación de los Museos) -->
      <button
        type="button"
        @click="cambiarVista('mapa')"
        :aria-current="currentView === 'mapa' ? 'page' : undefined"
        class="flex flex-col items-center justify-center gap-0.5 h-full transition-colors focus-visible:ring-2 focus-visible:ring-crimson rounded-lg"
        :class="[
          currentView === 'mapa'
            ? 'text-crimson font-bold'
            : 'text-gray-400 hover:text-gray-700 font-medium'
        ]"
      >
        <span 
          class="material-symbols-outlined text-[22px] transition-transform duration-200"
          :class="{ 'scale-110': currentView === 'mapa' }"
          aria-hidden="true"
        >
          map
        </span>
        <span class="text-[10px] tracking-tight">Mapa</span>
      </button>

      <!-- Pestaña 3: Botón Flotante Central de Escaneo QR -->
      <div class="relative -top-3.5 flex flex-col items-center justify-center">
        <button
          type="button"
          @click="cambiarVista('escaner')"
          :aria-current="currentView === 'escaner' ? 'page' : undefined"
          aria-label="Abrir escáner QR de monumentos"
          class="relative w-14 h-14 rounded-full bg-gradient-to-tr from-crimson to-red-600 flex items-center justify-center shadow-[0_6px_18px_rgba(186,12,47,0.38)] text-white active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2"
          :class="{ 'ring-4 ring-crimson/20 ring-offset-2': currentView === 'escaner' }"
        >
          <span 
            class="material-symbols-outlined text-[26px] relative z-10 transition-transform duration-200"
            :class="{ 'rotate-90': currentView === 'escaner' }"
            aria-hidden="true"
          >
            qr_code_scanner
          </span>
        </button>

        <span 
          class="text-[10px] mt-1 font-bold transition-colors"
          :class="[
            currentView === 'escaner' 
              ? 'text-crimson' 
              : 'text-gray-600'
          ]"
        >
          Escanear
        </span>
      </div>

      <!-- Pestaña 4: Mis Cartas / Colección -->
      <button
        type="button"
        @click="cambiarVista('coleccion')"
        :aria-current="currentView === 'coleccion' ? 'page' : undefined"
        class="flex flex-col items-center justify-center gap-0.5 h-full transition-colors focus-visible:ring-2 focus-visible:ring-crimson rounded-lg"
        :class="[
          currentView === 'coleccion'
            ? 'text-crimson font-bold'
            : 'text-gray-400 hover:text-gray-700 font-medium'
        ]"
      >
        <span 
          class="material-symbols-outlined text-[22px] transition-transform duration-200"
          :class="{ 'scale-110': currentView === 'coleccion' }"
          aria-hidden="true"
        >
          style
        </span>
        <span class="text-[10px] tracking-tight">Mis Cartas</span>
      </button>
    </div>
  </nav>
</template>
