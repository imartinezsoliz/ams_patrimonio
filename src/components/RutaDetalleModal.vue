<script setup>
/**
 * RutaDetalleModal.vue
 * Modal / Drawer deslizante que despliega el desglose detallado de museos y paradas
 * que integran la ruta patrimonial seleccionada.
 */
defineProps({
  ruta: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'locate-stop', 'scan-stop'])
</script>

<template>
  <Teleport to="body">
    <div 
      v-if="isOpen && ruta"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-opacity duration-300 select-none"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`ruta-title-${ruta.id}`"
    >
      <!-- Fondo oscuro cliqueable para cerrar -->
      <div class="fixed inset-0" @click="emit('close')" aria-hidden="true"></div>

      <!-- Hoja / Drawer Deslizante Móvil -->
      <div 
        class="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in slide-in-from-bottom duration-300"
      >
        <!-- Manija de agarre móvil -->
        <div class="w-12 h-1.5 rounded-full bg-surface-container-high mx-auto mt-2.5 shrink-0 sm:hidden"></div>

        <!-- Cabecera con Imagen de la Ruta -->
        <div class="relative h-44 w-full shrink-0 overflow-hidden mt-1">
          <img 
            :src="ruta.imagen" 
            :alt="`Fotografía de la ${ruta.titulo}`" 
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20"></div>

          <!-- Botón de Cerrar Flotante -->
          <button
            type="button"
            @click="emit('close')"
            class="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 active:scale-95 transition-all shadow-md focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Cerrar desglose de la ruta"
          >
            <span class="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
          </button>

          <!-- Título y Categoría sobre la Imagen -->
          <div class="absolute bottom-3 left-4 right-4 flex flex-col text-white">
            <span class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary w-max shadow-xs">
              {{ ruta.badgeTexto }}
            </span>
            <h2 :id="`ruta-title-${ruta.id}`" class="text-xl font-extrabold tracking-tight mt-1 leading-tight">
              {{ ruta.titulo }}
            </h2>
          </div>
        </div>

        <!-- Métricas Rápidas de la Ruta -->
        <div class="grid grid-cols-3 gap-2 p-3 bg-surface-container-low border-b border-surface-container text-center shrink-0">
          <div class="flex flex-col items-center">
            <span class="text-[10px] text-on-surface-variant font-medium">Distancia</span>
            <span class="text-xs font-bold text-on-surface flex items-center gap-0.5 mt-0.5">
              <span class="material-symbols-outlined text-[14px] text-primary" aria-hidden="true">straighten</span>
              {{ ruta.distancia }}
            </span>
          </div>

          <div class="flex flex-col items-center border-x border-surface-container">
            <span class="text-[10px] text-on-surface-variant font-medium">Tiempo</span>
            <span class="text-xs font-bold text-on-surface flex items-center gap-0.5 mt-0.5">
              <span class="material-symbols-outlined text-[14px] text-primary" aria-hidden="true">schedule</span>
              {{ ruta.tiempoEstimado || '2 h' }}
            </span>
          </div>

          <div class="flex flex-col items-center">
            <span class="text-[10px] text-on-surface-variant font-medium">Paradas</span>
            <span class="text-xs font-bold text-primary flex items-center gap-0.5 mt-0.5">
              <span class="material-symbols-outlined text-[14px]" aria-hidden="true">museum</span>
              {{ ruta.museos?.length || 0 }} Museos
            </span>
          </div>
        </div>

        <!-- Contenido Desplazable: Descripción y Lista de Museos -->
        <div class="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
          <p class="text-xs text-on-surface-variant leading-relaxed">
            {{ ruta.descripcion }}
          </p>

          <!-- Título de Sección -->
          <div class="flex items-center justify-between pt-1">
            <h3 class="text-xs font-extrabold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-primary-container" aria-hidden="true"></span>
              Museos y Paradas del Recorrido ({{ ruta.museos?.length || 0 }})
            </h3>
            <span class="text-[11px] text-primary font-bold">
              +{{ (ruta.museos?.length || 0) * 100 }} PTS totales
            </span>
          </div>

          <!-- Línea de Tiempo / Secuencia de Museos -->
          <div class="space-y-2.5 pb-2">
            <div 
              v-for="(museo, index) in ruta.museos" 
              :key="museo.id"
              class="shrink-0 relative flex items-start gap-3 p-3 rounded-2xl bg-surface border border-surface-container shadow-2xs hover:border-primary-container/40 transition-colors"
            >
              <!-- Número de Orden / Pin de Parada -->
              <div class="flex flex-col items-center shrink-0 mt-0.5">
                <div class="w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-xs font-extrabold shadow-xs">
                  {{ index + 1 }}
                </div>
                <!-- Línea conectora si no es el último -->
                <div 
                  v-if="index < ruta.museos.length - 1" 
                  class="w-0.5 h-full bg-surface-container-high my-1 min-h-[20px]"
                  aria-hidden="true"
                ></div>
              </div>

              <!-- Información de la Parada Cultural -->
              <div class="flex-1 min-w-0 flex flex-col">
                <div class="flex items-center justify-between gap-2">
                  <h4 class="text-xs font-bold text-on-surface truncate">
                    {{ museo.nombre }}
                  </h4>
                  <span 
                    class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0"
                    :class="[
                      museo.estado === 'Desbloqueado'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-surface-container-high text-on-surface-variant'
                    ]"
                  >
                    {{ museo.estado || 'Por visitar' }}
                  </span>
                </div>

                <span class="text-[11px] text-primary font-semibold mt-0.5">
                  {{ museo.subtitulo }}
                </span>

                <p class="text-[11px] text-on-surface-variant line-clamp-2 mt-1 leading-snug">
                  {{ museo.detalle }}
                </p>

                <!-- Acciones Rápidas por Parada -->
                <div class="flex items-center gap-2 mt-2 pt-1 border-t border-surface-container/60">
                  <button
                    type="button"
                    @click="emit('locate-stop', museo)"
                    class="text-[11px] font-bold text-on-surface hover:text-primary flex items-center gap-1 active:scale-95 transition-all focus-visible:ring-1 focus-visible:ring-primary rounded"
                  >
                    <span class="material-symbols-outlined text-[14px]" aria-hidden="true">near_me</span>
                    <span>Ver en mapa</span>
                  </button>

                  <span class="text-surface-container-high">·</span>

                  <button
                    type="button"
                    @click="emit('scan-stop', museo)"
                    class="text-[11px] font-bold text-primary hover:text-primary-container flex items-center gap-1 active:scale-95 transition-all focus-visible:ring-1 focus-visible:ring-primary rounded"
                  >
                    <span class="material-symbols-outlined text-[14px]" aria-hidden="true">qr_code_scanner</span>
                    <span>Escanear QR (+{{ museo.puntos }} PTS)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Barra Inferior Fija de Acción -->
        <div class="p-3 bg-surface-container-lowest border-t border-surface-container shrink-0 flex gap-2.5">
          <button
            type="button"
            @click="emit('close')"
            class="flex-1 py-3 px-4 rounded-xl bg-primary-container text-on-primary font-bold text-xs shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">explore</span>
            <span>Seguir Recorrido en Mapa</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
