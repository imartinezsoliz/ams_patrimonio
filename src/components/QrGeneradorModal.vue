<script setup>
/**
 * QrGeneradorModal.vue
 * Generador y visor de códigos QR vinculados a las cartas de La Ruta Blanca.
 * Permite visualizar en pantalla para escanear con otro dispositivo, descargar en PNG
 * para impresión o reiniciar el progreso de pruebas.
 */
import { ref, watch } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({
  cartas: {
    type: Array,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'reset-progress', 'simulate-scan'])

const qrImages = ref({})
const generando = ref(false)

const generarTodosLosQRs = async () => {
  generando.value = true
  const mapa = {}
  for (const carta of props.cartas) {
    if (!carta.qrCodigo) continue
    try {
      mapa[carta.id] = await QRCode.toDataURL(carta.qrCodigo, {
        width: 320,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#121C2A',
          light: '#FFFFFF'
        }
      })
    } catch (err) {
      console.error('Error generando QR para', carta.id, err)
    }
  }
  qrImages.value = mapa
  generando.value = false
}

watch(() => props.isOpen, (abierto) => {
  if (abierto && Object.keys(qrImages.value).length === 0) {
    generarTodosLosQRs()
  }
}, { immediate: true })

const descargarQR = (carta) => {
  const dataUrl = qrImages.value[carta.id]
  if (!dataUrl) return
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = `qr-${carta.id}.png`
  link.click()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-sm p-0 sm:p-4 select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Generador de códigos QR de las cartas"
    >
      <div class="fixed inset-0" @click="emit('close')" aria-hidden="true"></div>

      <div class="relative z-10 w-full max-w-md bg-[#F9FAFB] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-[88vh] overflow-hidden">
        <!-- Encabezado -->
        <div class="px-4 pt-3 pb-3 bg-white border-b border-gray-100 shrink-0">
          <div class="w-12 h-1.5 rounded-full bg-gray-200 mx-auto mb-3 sm:hidden"></div>
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-base font-extrabold text-navy">Códigos QR de Cartas</h2>
              <p class="text-[11px] text-gray-500">Escanea con tu cámara o descarga los PNG para imprimir</p>
            </div>
            <button
              type="button"
              @click="emit('close')"
              class="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center active:scale-95 transition-transform"
              aria-label="Cerrar generador QR"
            >
              <span class="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
            </button>
          </div>
        </div>

        <!-- Lista de QRs -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <div v-if="generando" class="py-10 text-center text-xs text-gray-500 font-semibold">
            Generando códigos QR…
          </div>

          <article
            v-for="carta in cartas"
            :key="carta.id"
            class="shrink-0 rounded-2xl bg-white border border-gray-100 shadow-xs p-3.5 flex items-center gap-3.5"
          >
            <!-- QR generado -->
            <div class="w-24 h-24 rounded-xl bg-white border border-gray-200 p-1 shrink-0 flex items-center justify-center">
              <img
                v-if="qrImages[carta.id]"
                :src="qrImages[carta.id]"
                :alt="`Código QR de ${carta.titulo}`"
                class="w-full h-full object-contain"
              />
            </div>

            <!-- Info y acciones -->
            <div class="flex-1 min-w-0 flex flex-col gap-1.5">
              <div class="flex items-center gap-2">
                <img
                  :src="carta.imagen"
                  :alt="carta.titulo"
                  class="w-7 h-7 rounded-lg object-cover border border-gray-200 shrink-0"
                />
                <div class="min-w-0">
                  <h3 class="text-xs font-extrabold text-navy truncate">{{ carta.titulo }}</h3>
                  <span class="text-[10px] font-mono text-gray-500 block truncate">{{ carta.qrCodigo }}</span>
                </div>
              </div>

              <div class="flex items-center gap-1.5 pt-1">
                <span
                  class="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  :class="carta.desbloqueada ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'"
                >
                  {{ carta.desbloqueada ? 'Obtenida' : 'Bloqueada' }}
                </span>
                <span class="text-[10px] font-bold text-crimson">+{{ carta.puntosGanados }} PTS</span>
              </div>

              <div class="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  @click="descargarQR(carta)"
                  class="px-2.5 py-1.5 rounded-lg bg-navy text-white text-[10px] font-bold active:scale-95 transition-transform flex items-center gap-1"
                >
                  <span class="material-symbols-outlined text-[13px]" aria-hidden="true">download</span>
                  <span>Descargar</span>
                </button>
                <button
                  type="button"
                  @click="emit('simulate-scan', carta.qrCodigo)"
                  class="px-2.5 py-1.5 rounded-lg bg-red-50 text-crimson text-[10px] font-bold active:scale-95 transition-transform flex items-center gap-1"
                >
                  <span class="material-symbols-outlined text-[13px]" aria-hidden="true">qr_code_scanner</span>
                  <span>Simular</span>
                </button>
              </div>
            </div>
          </article>
        </div>

        <!-- Pie con botón de reinicio de progreso para pruebas -->
        <div class="p-3 bg-white border-t border-gray-100 shrink-0 flex items-center justify-between gap-2">
          <button
            type="button"
            @click="emit('reset-progress')"
            class="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span class="material-symbols-outlined text-[16px]" aria-hidden="true">restart_alt</span>
            <span>Reiniciar progreso</span>
          </button>

          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 rounded-xl bg-crimson text-white text-xs font-bold active:scale-95 transition-all"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
