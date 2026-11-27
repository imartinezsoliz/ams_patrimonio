<script setup>
/**
 * ExplorarView.vue
 * Pantalla principal (Home) sin mapa:
 * 1. Carrusel deslizable "Sabías que..." con puntos indicadores sincronizados.
 * 2. Carrusel interactivo deslizable de "Rutas Temáticas" (con soporte táctil, arrastre de ratón y botones).
 * 3. Carrusel deslizable de "Museos Sueltos" + modal completo de los 12 museos sin recorte vertical.
 * 4. Al entrar a un museo, abre MuseoDetalleModal con su breve descripción y ubicación en el mapa.
 */
import { ref, computed } from 'vue'
import { DATOS_CURIOSOS_MOCK, RUTAS_MOCK, MUSEOS_SUELTOS_MOCK } from '../data/mockData.js'
import RutaDetalleModal from '../components/RutaDetalleModal.vue'
import MuseoDetalleModal from '../components/MuseoDetalleModal.vue'

defineProps({
  usuario: {
    type: Object,
    required: true
  },
  cartas: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['navigate', 'locate-museum'])

// Referencias a los 3 carruseles horizontales
const carouselDatosRef = ref(null)
const carouselRutasRef = ref(null)
const carouselMuseosRef = ref(null)

// Estado de arrastre compartido para que los carruseles se deslicen tanto con dedo (touch) como con ratón (desktop)
const dragState = ref({
  isDown: false,
  startX: 0,
  scrollLeft: 0,
  hasDragged: false,
  targetEl: null
})

const startDrag = (e, el) => {
  if (!el) return
  dragState.value = {
    isDown: true,
    startX: e.pageX - el.offsetLeft,
    scrollLeft: el.scrollLeft,
    hasDragged: false,
    targetEl: el
  }
}

const onDrag = (e) => {
  const state = dragState.value
  if (!state.isDown || !state.targetEl) return
  const x = e.pageX - state.targetEl.offsetLeft
  const walk = x - state.startX
  if (Math.abs(walk) > 6) {
    state.hasDragged = true
    e.preventDefault()
  }
  state.targetEl.scrollLeft = state.scrollLeft - walk * 1.2
}

const stopDrag = () => {
  dragState.value.isDown = false
  setTimeout(() => {
    dragState.value.hasDragged = false
  }, 60)
}

// Desplazamiento horizontal mediante botones flecha
const scrollCarouselBy = (el, offset) => {
  if (!el) return
  el.scrollBy({ left: offset, behavior: 'smooth' })
}

// Sincronización de puntos del carrusel "Sabías que..."
const activeDatoIndex = ref(0)

const onScrollDatos = () => {
  const el = carouselDatosRef.value
  if (!el || !el.children.length) return
  const cardWidth = el.children[0].offsetWidth + 14
  const index = Math.min(Math.round(el.scrollLeft / cardWidth), DATOS_CURIOSOS_MOCK.length - 1)
  activeDatoIndex.value = Math.max(0, index)
}

const irADato = (index) => {
  const el = carouselDatosRef.value
  if (!el || !el.children[index]) return
  const cardWidth = el.children[0].offsetWidth + 14
  el.scrollTo({ left: index * cardWidth, behavior: 'smooth' })
  activeDatoIndex.value = index
}

// Modal de detalle de ruta
const rutaSeleccionada = ref(null)
const modalRutaAbierto = ref(false)

const abrirDetalleRuta = (ruta) => {
  if (dragState.value.hasDragged) return
  rutaSeleccionada.value = ruta
  modalRutaAbierto.value = true
}

// Modal de detalle de museo (breve descripción + ubicación en mapa)
const museoSeleccionado = ref(null)
const modalMuseoAbierto = ref(false)

const abrirDetalleMuseo = (museo) => {
  if (dragState.value.hasDragged) return
  museoSeleccionado.value = museo
  modalMuseoAbierto.value = true
}

// Modal / Catálogo completo de los 12 Museos Sueltos
const verTodosMuseos = ref(false)
const busquedaMuseo = ref('')
const categoriaMuseoFiltro = ref('todos')

const categoriasMuseos = [
  { id: 'todos', label: 'Todos (12)' },
  { id: 'Histórico', label: 'Históricos' },
  { id: 'Arte Sacro', label: 'Arte Sacro' },
  { id: 'Textil & Indígena', label: 'Indígena & ASUR' },
  { id: 'Arquitectónico', label: 'Palacetes' },
  { id: 'Paleontología', label: 'Dinosaurios' },
  { id: 'Gastronomía', label: 'Gastronomía' },
]

const museosFiltrados = computed(() => {
  return MUSEOS_SUELTOS_MOCK.filter(museo => {
    const query = busquedaMuseo.value.toLowerCase()
    const coincideTexto =
      museo.nombre.toLowerCase().includes(query) ||
      museo.descripcion.toLowerCase().includes(query) ||
      museo.direccion.toLowerCase().includes(query)

    if (categoriaMuseoFiltro.value === 'todos') return coincideTexto
    if (categoriaMuseoFiltro.value === 'Gastronomía') {
      return coincideTexto && (museo.categoria === 'Gastronomía' || museo.categoria === 'Tradición Culinaria')
    }
    return coincideTexto && museo.categoria === categoriaMuseoFiltro.value
  })
})

// Navegar a la pestaña de Mapa ubicando el museo/parada
const ubicarEnMapa = (item) => {
  modalRutaAbierto.value = false
  modalMuseoAbierto.value = false
  verTodosMuseos.value = false
  emit('locate-museum', item)
  emit('navigate', 'mapa')
}

// Navegar directamente al escáner QR
const escanearItem = () => {
  modalRutaAbierto.value = false
  modalMuseoAbierto.value = false
  verTodosMuseos.value = false
  emit('navigate', 'escaner')
}
</script>

<template>
  <div class="flex flex-col w-full px-4 pt-2 pb-6 space-y-6 select-none">
    <!-- ========================================== -->
    <!-- SECCIÓN HERO: CARRUSEL "SABÍAS QUE..."     -->
    <!-- ========================================== -->
    <section class="w-full pt-1" aria-label="Datos curiosos de Sucre">
      <div class="flex items-center justify-between mb-2.5">
        <div class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-crimson text-[20px]" aria-hidden="true">auto_awesome</span>
          <h2 class="text-xs font-extrabold text-navy uppercase tracking-wider">Sabías que...</h2>
        </div>
        <span class="text-[11px] font-semibold text-gray-400">Desliza para ver más</span>
      </div>

      <div
        ref="carouselDatosRef"
        @scroll.passive="onScrollDatos"
        @mousedown="startDrag($event, carouselDatosRef)"
        @mousemove="onDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
        class="flex gap-3.5 overflow-x-auto touch-pan-x no-scrollbar snap-x snap-mandatory py-1 -mx-4 px-4 cursor-grab active:cursor-grabbing"
      >
        <article
          v-for="(dato, idx) in DATOS_CURIOSOS_MOCK"
          :key="dato.id"
          class="snap-center shrink-0 w-[84vw] max-w-[340px] rounded-2xl bg-gradient-to-br text-white p-5 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[175px]"
          :class="dato.gradiente"
        >
          <div class="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none blur-xl" aria-hidden="true"></div>

          <div class="flex items-center justify-between relative z-10">
            <span class="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-widest uppercase text-white border border-white/20">
              {{ dato.badge }}
            </span>
            <span class="material-symbols-outlined text-white/80 text-[20px]" aria-hidden="true">
              {{ dato.icono }}
            </span>
          </div>

          <p class="font-medium text-sm leading-snug text-white/95 mt-3 relative z-10">
            {{ dato.textoPrefix }}<span class="font-bold text-amber-200">{{ dato.textoDestacado }}</span>{{ dato.textoSuffix }}
          </p>

          <div class="flex items-center justify-between pt-3 mt-1 border-t border-white/10 relative z-10">
            <span class="text-[11px] font-semibold text-white/75">{{ dato.ubicacion }}</span>
            <span class="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full text-white tabular-nums">
              #{{ idx + 1 }} de {{ DATOS_CURIOSOS_MOCK.length }}
            </span>
          </div>
        </article>
      </div>

      <!-- Puntos de Paginación Sincronizados -->
      <div class="flex items-center justify-center gap-1.5 mt-2.5" role="tablist" aria-label="Indicadores de datos curiosos">
        <button
          v-for="(dato, idx) in DATOS_CURIOSOS_MOCK"
          :key="dato.id"
          type="button"
          @click="irADato(idx)"
          :aria-label="`Ver dato curioso ${idx + 1}`"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="activeDatoIndex === idx ? 'w-5 bg-crimson' : 'w-1.5 bg-gray-300'"
        ></button>
      </div>
    </section>

    <!-- ========================================== -->
    <!-- SECCIÓN 1: RUTAS TEMÁTICAS (DESLIZABLE)    -->
    <!-- ========================================== -->
    <section class="w-full" aria-label="Rutas temáticas interactivas">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <h3 class="text-base font-extrabold text-navy tracking-tight">Rutas Temáticas</h3>
        </div>
        <div class="flex items-center gap-1.5">
          <!-- Botones de desplazamiento rápido -->
          <button
            type="button"
            @click="scrollCarouselBy(carouselRutasRef, -260)"
            class="w-7 h-7 rounded-full bg-white border border-gray-200 text-navy flex items-center justify-center shadow-2xs active:scale-95 transition-transform"
            aria-label="Deslizar rutas a la izquierda"
          >
            <span class="material-symbols-outlined text-[16px]" aria-hidden="true">chevron_left</span>
          </button>
          <button
            type="button"
            @click="scrollCarouselBy(carouselRutasRef, 260)"
            class="w-7 h-7 rounded-full bg-white border border-gray-200 text-navy flex items-center justify-center shadow-2xs active:scale-95 transition-transform"
            aria-label="Deslizar rutas a la derecha"
          >
            <span class="material-symbols-outlined text-[16px]" aria-hidden="true">chevron_right</span>
          </button>
        </div>
      </div>

      <!-- Carrusel Horizontal Deslizable de Rutas -->
      <div
        ref="carouselRutasRef"
        @mousedown="startDrag($event, carouselRutasRef)"
        @mousemove="onDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
        class="flex gap-3.5 overflow-x-auto touch-pan-x no-scrollbar py-1 -mx-4 px-4 cursor-grab active:cursor-grabbing"
      >
        <article
          v-for="ruta in RUTAS_MOCK"
          :key="ruta.id"
          @click="abrirDetalleRuta(ruta)"
          class="shrink-0 w-64 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col transition-all duration-200 active:scale-[0.98] hover:shadow-md cursor-pointer group"
        >
          <div class="relative h-32 w-full overflow-hidden">
            <img
              :src="ruta.imagen"
              :alt="`Fotografía de ${ruta.titulo}`"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            <span
              class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm"
              :class="[
                ruta.badgeTipo === 'progreso'
                  ? 'bg-crimson text-white'
                  : 'bg-white/95 text-navy'
              ]"
            >
              {{ ruta.badgeTexto }}
            </span>

            <span class="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1">
              <span class="material-symbols-outlined text-[12px]" aria-hidden="true">{{ ruta.icono }}</span>
              <span>{{ ruta.dificultad }} · {{ ruta.distancia }}</span>
            </span>
          </div>

          <div class="p-3.5 flex flex-col gap-2">
            <div>
              <div class="flex items-center justify-between gap-1">
                <h4 class="text-sm font-extrabold text-navy truncate group-hover:text-crimson transition-colors">
                  {{ ruta.titulo }}
                </h4>
                <span class="material-symbols-outlined text-[16px] text-crimson shrink-0" aria-hidden="true">
                  arrow_forward
                </span>
              </div>
              <p class="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{{ ruta.descripcion }}</p>
            </div>

            <div class="flex flex-col gap-1.5 pt-1 border-t border-gray-50">
              <div class="flex items-center justify-between text-[11px]">
                <span class="text-gray-500 font-medium">{{ ruta.museos?.length || 0 }} Museos incluidos</span>
                <span
                  class="font-bold tabular-nums"
                  :class="ruta.cartasDescubiertas > 0 ? 'text-crimson' : 'text-gray-500'"
                >
                  {{ ruta.cartasDescubiertas }} / {{ ruta.totalCartas }} Cartas
                </span>
              </div>
              <div class="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  class="h-full bg-crimson rounded-full transition-all duration-500"
                  :style="{ width: `${(ruta.cartasDescubiertas / ruta.totalCartas) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- ========================================== -->
    <!-- SECCIÓN 2: MUSEOS SUELTOS (DESLIZABLE)     -->
    <!-- ========================================== -->
    <section class="w-full" aria-label="Museos sueltos de Sucre">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <h3 class="text-base font-extrabold text-navy tracking-tight">Museos Sueltos</h3>
          <span class="px-2 py-0.5 rounded-full bg-red-50 text-crimson text-[10px] font-bold">
            {{ MUSEOS_SUELTOS_MOCK.length }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1">
            <button
              type="button"
              @click="scrollCarouselBy(carouselMuseosRef, -230)"
              class="w-7 h-7 rounded-full bg-white border border-gray-200 text-navy flex items-center justify-center shadow-2xs active:scale-95 transition-transform"
              aria-label="Deslizar museos a la izquierda"
            >
              <span class="material-symbols-outlined text-[16px]" aria-hidden="true">chevron_left</span>
            </button>
            <button
              type="button"
              @click="scrollCarouselBy(carouselMuseosRef, 230)"
              class="w-7 h-7 rounded-full bg-white border border-gray-200 text-navy flex items-center justify-center shadow-2xs active:scale-95 transition-transform"
              aria-label="Deslizar museos a la derecha"
            >
              <span class="material-symbols-outlined text-[16px]" aria-hidden="true">chevron_right</span>
            </button>
          </div>

          <button
            type="button"
            @click="verTodosMuseos = true"
            class="text-xs font-bold text-crimson hover:underline flex items-center gap-0.5 focus-visible:ring-2 focus-visible:ring-crimson rounded pl-1"
          >
            <span>Ver todo</span>
            <span class="material-symbols-outlined text-[16px]" aria-hidden="true">chevron_right</span>
          </button>
        </div>
      </div>

      <!-- Carrusel Horizontal Deslizable de los 12 Museos -->
      <div
        ref="carouselMuseosRef"
        @mousedown="startDrag($event, carouselMuseosRef)"
        @mousemove="onDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
        class="flex gap-3.5 overflow-x-auto touch-pan-x no-scrollbar py-1 -mx-4 px-4 cursor-grab active:cursor-grabbing"
      >
        <article
          v-for="museo in MUSEOS_SUELTOS_MOCK"
          :key="museo.id"
          @click="abrirDetalleMuseo(museo)"
          class="shrink-0 w-56 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col transition-all duration-200 active:scale-[0.98] hover:shadow-md cursor-pointer"
        >
          <div class="relative h-28 w-full overflow-hidden bg-slate-100">
            <img
              :src="museo.imagen"
              :alt="museo.nombre"
              class="w-full h-full object-cover pointer-events-none"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold">
              Abierto
            </span>
            <span class="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold">
              +{{ museo.puntos }} PTS
            </span>
          </div>

          <div class="p-3 flex flex-col gap-1">
            <h4 class="text-xs font-extrabold text-navy truncate">{{ museo.nombre }}</h4>
            <p class="text-[11px] text-gray-500 truncate flex items-center gap-1">
              <span class="material-symbols-outlined text-[13px] text-crimson shrink-0" aria-hidden="true">location_on</span>
              <span class="truncate">{{ museo.direccion }}</span>
            </p>
          </div>
        </article>
      </div>
    </section>

    <!-- Modal Detallado de Ruta (Al tocar cualquier ruta) -->
    <RutaDetalleModal
      :ruta="rutaSeleccionada"
      :is-open="modalRutaAbierto"
      @close="modalRutaAbierto = false"
      @locate-stop="ubicarEnMapa"
      @scan-stop="escanearItem"
    />

    <!-- Modal Detallado de Museo (Breve descripción + Ubicación en el mapa) -->
    <MuseoDetalleModal
      :museo="museoSeleccionado"
      :is-open="modalMuseoAbierto"
      @close="modalMuseoAbierto = false"
      @open-in-map="ubicarEnMapa"
      @scan="escanearItem"
    />

    <!-- Drawer / Modal Completo de los 12 Museos Sueltos (Al tocar "Ver todo") -->
    <Teleport to="body">
      <div
        v-if="verTodosMuseos"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Catálogo completo de los 12 Museos Sueltos de Sucre"
      >
        <div class="fixed inset-0" @click="verTodosMuseos = false" aria-hidden="true"></div>

        <div class="relative z-10 w-full max-w-md bg-[#F9FAFB] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-[88vh] overflow-hidden">
          <!-- Cabecera del Catálogo -->
          <div class="px-4 pt-3 pb-3 bg-white border-b border-gray-100 shrink-0">
            <div class="w-12 h-1.5 rounded-full bg-gray-200 mx-auto mb-3 sm:hidden"></div>
            <div class="flex items-center justify-between mb-3">
              <div>
                <h2 class="text-base font-extrabold text-navy">Museos Sueltos de Sucre</h2>
                <p class="text-[11px] text-gray-500">Explora los 12 museos patrimoniales disponibles</p>
              </div>
              <button
                type="button"
                @click="verTodosMuseos = false"
                class="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center active:scale-95 transition-transform"
                aria-label="Cerrar lista de museos"
              >
                <span class="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
              </button>
            </div>

            <!-- Buscador -->
            <div class="relative w-full mb-2.5">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-gray-400 pointer-events-none">
                search
              </span>
              <input
                v-model="busquedaMuseo"
                type="search"
                placeholder="Buscar museo por nombre o dirección…"
                class="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson"
              />
            </div>

            <!-- Filtros -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              <button
                v-for="cat in categoriasMuseos"
                :key="cat.id"
                type="button"
                @click="categoriaMuseoFiltro = cat.id"
                class="shrink-0 px-3 py-1 rounded-full text-[11px] font-bold transition-all"
                :class="categoriaMuseoFiltro === cat.id ? 'bg-crimson text-white' : 'bg-gray-100 text-gray-600'"
              >
                {{ cat.label }}
              </button>
            </div>
          </div>

          <!-- Lista Desplazable de los 12 Museos (con shrink-0 para evitar aplastamiento) -->
          <div class="flex-1 overflow-y-auto p-4 space-y-3">
            <article
              v-for="museo in museosFiltrados"
              :key="museo.id"
              @click="abrirDetalleMuseo(museo)"
              class="shrink-0 flex flex-col rounded-2xl bg-white border border-gray-100 shadow-xs overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              <div class="p-3 flex gap-3">
                <div class="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  <img :src="museo.imagen" :alt="museo.nombre" class="w-full h-full object-cover" loading="lazy" />
                  <span class="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/65 text-white text-[9px] font-bold">
                    +{{ museo.puntos }}
                  </span>
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span class="text-[9px] uppercase font-bold text-crimson bg-red-50 px-2 py-0.5 rounded-full inline-block">
                      {{ museo.categoria }}
                    </span>
                    <h3 class="text-sm font-extrabold text-navy mt-1 leading-tight line-clamp-1">
                      {{ museo.nombre }}
                    </h3>
                    <p class="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">
                      {{ museo.descripcion }}
                    </p>
                  </div>
                  <span class="text-[10px] text-gray-400 font-medium mt-1 truncate block">
                    {{ museo.horario }}
                  </span>
                </div>
              </div>

              <div class="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-100">
                <span class="text-[10px] text-gray-500 truncate max-w-[155px] flex items-center gap-1">
                  <span class="material-symbols-outlined text-[13px] text-crimson shrink-0" aria-hidden="true">pin_drop</span>
                  <span class="truncate">{{ museo.direccion }}</span>
                </span>
                <div class="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    @click.stop="ubicarEnMapa(museo)"
                    class="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-navy text-[10px] font-bold active:scale-95 transition-transform flex items-center gap-1"
                  >
                    <span class="material-symbols-outlined text-[13px]" aria-hidden="true">map</span>
                    <span>Mapa</span>
                  </button>
                  <button
                    type="button"
                    @click.stop="escanearItem"
                    class="px-2.5 py-1 rounded-lg bg-crimson text-white text-[10px] font-bold active:scale-95 transition-transform flex items-center gap-1"
                  >
                    <span class="material-symbols-outlined text-[13px]" aria-hidden="true">qr_code_scanner</span>
                    <span>Escanear</span>
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
