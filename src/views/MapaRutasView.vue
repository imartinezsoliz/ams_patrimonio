<script setup>
/**
 * MapaRutasView.vue
 * Vista interactiva de Mapa, Rutas Patrimoniales y Catálogo de Museos Sueltos de Sucre.
 * Proporciona:
 * 1. Explorar Rutas: mapa interactivo, pines con pulso GPS, carrusel temático y modal interactivo de paradas.
 * 2. Museos Sueltos: catálogo completo de los 12 museos emblemáticos de Sucre con búsqueda, filtros y acciones.
 */
import { ref, computed } from 'vue'
import { MONUMENTOS_MOCK, RUTAS_MOCK, MUSEOS_SUELTOS_MOCK } from '../data/mockData.js'
import RutaDetalleModal from '../components/RutaDetalleModal.vue'

const props = defineProps({
  usuario: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['navigate', 'select-monument'])

// Modo activo: 'rutas' | 'museos'
const modoActivo = ref('rutas')

// Monumento actualmente seleccionado en el peek/toast inferior
const monumentoSeleccionado = ref(MONUMENTOS_MOCK[0])
const isPinPopping = ref(false)

// Ruta seleccionada para el modal de desglose de paradas
const rutaSeleccionada = ref(null)
const modalRutaAbierto = ref(false)

// Búsqueda y filtrado para Museos Sueltos
const busquedaMuseo = ref('')
const categoriaMuseoFiltro = ref('todos')

// Categorías dinámicas para Museos Sueltos
const categoriasMuseos = [
  { id: 'todos', label: 'Todos (12)' },
  { id: 'Histórico', label: 'Históricos' },
  { id: 'Arte Sacro', label: 'Arte Sacro' },
  { id: 'Textil & Indígena', label: 'Indígena & ASUR' },
  { id: 'Arquitectónico', label: 'Palacetes & Castillo' },
  { id: 'Paleontología', label: 'Dinosaurios' },
  { id: 'Gastronomía', label: 'Gastronomía & Pan' },
]

// Filtrado reactivo de museos sueltos
const museosFiltrados = computed(() => {
  return MUSEOS_SUELTOS_MOCK.filter(museo => {
    const coincideTexto = museo.nombre.toLowerCase().includes(busquedaMuseo.value.toLowerCase()) ||
                          museo.descripcion.toLowerCase().includes(busquedaMuseo.value.toLowerCase()) ||
                          museo.direccion.toLowerCase().includes(busquedaMuseo.value.toLowerCase())
    
    if (categoriaMuseoFiltro.value === 'todos') {
      return coincideTexto
    }

    if (categoriaMuseoFiltro.value === 'Gastronomía') {
      return coincideTexto && (museo.categoria === 'Gastronomía' || museo.categoria === 'Tradición Culinaria')
    }

    return coincideTexto && museo.categoria === categoriaMuseoFiltro.value
  })
})

// Estado para geolocalización en tiempo real
const gpsActivo = ref(false)
const ubicacionUsuario = ref({
  nombre: "Plaza 25 de Mayo (Centro)",
  lat: -19.0478,
  lng: -65.2595
})

const seleccionarMonumento = (monumento) => {
  monumentoSeleccionado.value = monumento
  isPinPopping.value = true
  setTimeout(() => {
    isPinPopping.value = false
  }, 250)
  emit('select-monument', monumento)
}

// Abrir el desglose de museos de la ruta seleccionada
const abrirDetalleRuta = (ruta) => {
  rutaSeleccionada.value = ruta
  modalRutaAbierto.value = true
}

// Ubicar una parada o museo en el mapa
const ubicarEnMapa = (item) => {
  modalRutaAbierto.value = false
  modoActivo.value = 'rutas'
  
  // Buscar si coincide con un monumento conocido o adaptarlo
  const encontrado = MONUMENTOS_MOCK.find(m => m.id === item.id) || {
    id: item.id,
    nombre: item.nombre,
    subtitulo: item.direccion || item.subtitulo || "Monumento en Sucre",
    distancia: item.distancia || "Ubicado en el centro",
    icono: item.icono || "place",
    rareza: item.rareza || "Rara",
    imagen: item.imagen,
    puntos: item.puntos || 100
  }
  
  seleccionarMonumento(encontrado)
  window.scrollTo({ top: 100, behavior: 'smooth' })
}

// Escanear directamente un museo o parada
const escanearItem = (item) => {
  modalRutaAbierto.value = false
  emit('navigate', 'escaner')
}

/**
 * Preparación para integración con Geolocation API nativa
 */
const centrarUbicacion = () => {
  if ('geolocation' in navigator) {
    gpsActivo.value = true
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        ubicacionUsuario.value.lat = pos.coords.latitude
        ubicacionUsuario.value.lng = pos.coords.longitude
        setTimeout(() => {
          gpsActivo.value = false
        }, 1500)
      },
      (error) => {
        console.warn('Ubicación predeterminada activada (GPS no disponible):', error.message)
        gpsActivo.value = false
      },
      { enableHighAccuracy: true, timeout: 5000 }
    )
  }
}
</script>

<template>
  <div class="flex flex-col w-full pb-6 select-none">
    <!-- SELECTOR DE MODO SUPERIOR: Explorar Rutas vs Museos Sueltos -->
    <section class="px-4 pt-2 pb-3">
      <div 
        class="grid grid-cols-2 gap-2 p-1 rounded-full bg-surface-container-high border border-surface-container shadow-xs"
        role="tablist"
        aria-label="Modo de visualización"
      >
        <button
          type="button"
          role="tab"
          :aria-selected="modoActivo === 'rutas'"
          @click="modoActivo = 'rutas'"
          class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary-container"
          :class="[
            modoActivo === 'rutas'
              ? 'bg-primary-container text-on-primary shadow-sm'
              : 'bg-surface-container-lowest text-primary-container hover:bg-surface-container-low'
          ]"
        >
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">map</span>
          <span>Explorar Rutas</span>
        </button>

        <button
          type="button"
          role="tab"
          :aria-selected="modoActivo === 'museos'"
          @click="modoActivo = 'museos'"
          class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary-container"
          :class="[
            modoActivo === 'museos'
              ? 'bg-primary-container text-on-primary shadow-sm'
              : 'bg-surface-container-lowest text-primary-container hover:bg-surface-container-low'
          ]"
        >
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">account_balance</span>
          <span>Museos Sueltos</span>
        </button>
      </div>
    </section>

    <!-- ========================================== -->
    <!-- MODO 1: EXPLORAR RUTAS & MAPA INTERACTIVO -->
    <!-- ========================================== -->
    <div v-if="modoActivo === 'rutas'" class="flex flex-col w-full">
      <!-- Viewport del Mapa Interactivo (Plaza 25 de Mayo y Centro Histórico) -->
      <section class="px-4 py-1">
        <div class="relative w-full h-64 rounded-2xl overflow-hidden shadow-md bg-surface-container-low border border-surface-container">
          <!-- Textura del Mapa con las calles coloniales de Sucre -->
          <div 
            class="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
            data-location="Plaza 25 de Mayo, Sucre, Bolivia"
            style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZDjRoZrWbIRdRVxtBe3zl2BGsk34x6uXRNSLsxsOI1m9l56hV1eA5FaakTggicSpccRViEx3HmcehhfXJa37chGApHJLf_QJSVSrDNp7t6FsPOLp8VVHgZtENoey1wcJ0IJDM6OEOeQSWWH-r2RJyhCrxpaWRE_BHeyWr7IKnfW7zAUyb8qYKNU262B5_0wsGlgFtqUllmt7FmcQkfEj6iM1roPT-ZJtM60uM1gQ');"
            role="img"
            aria-label="Plano cartográfico del centro histórico de Sucre con monumentos destacados"
          ></div>

          <!-- Capa de Sombra y Viñeta -->
          <div class="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>

          <!-- PINES CHUQUISAQUEÑOS DINÁMICOS -->
          <div 
            v-for="monumento in MONUMENTOS_MOCK" 
            :key="monumento.id"
            class="absolute flex flex-col items-center group cursor-pointer -translate-x-1/2 -translate-y-1/2 z-20"
            :style="{ top: monumento.topPercent, left: monumento.leftPercent }"
            @click="seleccionarMonumento(monumento)"
          >
            <!-- Pin Activo / Seleccionado con onda expansiva -->
            <div class="relative flex items-center justify-center">
              <span 
                v-if="monumentoSeleccionado.id === monumento.id"
                class="absolute w-8 h-8 rounded-full bg-primary-container/40 animate-ping pointer-events-none"
                aria-hidden="true"
              ></span>
              <button
                type="button"
                :aria-label="`Ver monumento ${monumento.nombre}`"
                class="w-7 h-7 rounded-full text-on-primary flex items-center justify-center shadow-lg transform transition-all duration-200 group-hover:scale-125 focus-visible:ring-2 focus-visible:ring-offset-2"
                :class="[
                  monumentoSeleccionado.id === monumento.id
                    ? 'bg-primary-container scale-110 ring-2 ring-white'
                    : 'bg-primary hover:bg-primary-container'
                ]"
              >
                <span class="material-symbols-outlined text-[15px]" aria-hidden="true">
                  {{ monumento.icono }}
                </span>
              </button>
            </div>
          </div>

          <!-- Pulso de Ubicación GPS en Tiempo Real del Usuario (Plaza 25 de Mayo) -->
          <div 
            class="absolute top-[48%] left-[46%] flex items-center justify-center pointer-events-none z-10"
            title="Tu ubicación actual"
          >
            <span class="absolute w-10 h-10 rounded-full bg-blue-500/30 animate-ping"></span>
            <div class="w-4 h-4 rounded-full bg-blue-600 shadow-md ring-4 ring-white"></div>
          </div>

          <!-- Distintivo Flotante Inferior: Ubicación Actual del Usuario -->
          <div class="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-xs border border-surface-container text-xs font-semibold text-on-surface">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></span>
            <span>{{ ubicacionUsuario.nombre }}</span>
          </div>

          <!-- Controles Flotantes del Mapa -->
          <div class="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
            <button 
              type="button"
              @click="centrarUbicacion"
              aria-label="Centrar en mi ubicación actual"
              class="w-8 h-8 rounded-xl bg-surface-container-lowest/95 backdrop-blur-md text-on-surface flex items-center justify-center shadow-sm active:bg-surface-container-high transition-colors focus-visible:ring-2 focus-visible:ring-primary-container"
            >
              <span 
                class="material-symbols-outlined text-[18px]" 
                :class="{ 'animate-spin text-primary-container': gpsActivo }"
                aria-hidden="true"
              >
                my_location
              </span>
            </button>

            <button 
              type="button"
              aria-label="Cambiar capas y filtros del mapa"
              class="w-8 h-8 rounded-xl bg-surface-container-lowest/95 backdrop-blur-md text-on-surface flex items-center justify-center shadow-sm active:bg-surface-container-high transition-colors focus-visible:ring-2 focus-visible:ring-primary-container"
            >
              <span class="material-symbols-outlined text-[18px]" aria-hidden="true">layers</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Tarjeta Deslizante / Peek Interactivo del Punto Seleccionado -->
      <section class="px-4 pt-2">
        <div 
          class="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low border border-surface-container shadow-xs transition-all duration-200"
          :class="{ 'scale-[1.02] shadow-md': isPinPopping }"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-11 h-11 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-xs">
              <span class="material-symbols-outlined text-[22px]" aria-hidden="true">
                {{ monumentoSeleccionado.icono || 'flag' }}
              </span>
            </div>

            <div class="flex flex-col min-w-0">
              <span class="text-[10px] font-extrabold text-primary uppercase tracking-wider">
                Punto Cercano · {{ monumentoSeleccionado.rareza }}
              </span>
              <h2 class="text-base font-bold text-on-surface truncate leading-tight mt-0.5">
                {{ monumentoSeleccionado.nombre }}
              </h2>
              <p class="text-xs text-on-surface-variant truncate mt-0.5">
                {{ monumentoSeleccionado.distancia }}
              </p>
            </div>
          </div>

          <button 
            type="button"
            @click="emit('navigate', 'escaner')"
            class="shrink-0 px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container active:scale-95 transition-all flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary-container"
          >
            <span class="material-symbols-outlined text-[16px]" aria-hidden="true">qr_code_scanner</span>
            <span>Escanear</span>
          </button>
        </div>
      </section>

      <!-- Encabezado de Rutas Temáticas -->
      <section class="px-4 pt-6 pb-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-extrabold text-on-surface">Rutas Temáticas</h2>
            <span class="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-extrabold">
              3 oficiales
            </span>
          </div>

          <span class="text-[11px] text-on-surface-variant font-medium">
            Toca una ruta para ver sus museos
          </span>
        </div>
      </section>

      <!-- Carrusel Horizontal de Rutas Temáticas (Clickeable con Apertura de Museos) -->
      <section class="w-full overflow-x-auto pb-2 pt-1 px-4 no-scrollbar">
        <div class="flex gap-4 w-max">
          <article 
            v-for="ruta in RUTAS_MOCK" 
            :key="ruta.id"
            @click="abrirDetalleRuta(ruta)"
            class="w-64 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs overflow-hidden flex flex-col transition-all duration-200 active:scale-[0.98] hover:shadow-md cursor-pointer group"
          >
            <!-- Portada con Imagen y Distintivos -->
            <div class="relative h-32 w-full overflow-hidden">
              <img 
                :src="ruta.imagen" 
                :alt="`Fotografía de la ${ruta.titulo}`"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              <!-- Badge Superior Izquierdo -->
              <span 
                class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shadow-xs"
                :class="[
                  ruta.badgeTipo === 'progreso' 
                    ? 'bg-primary-container text-on-primary' 
                    : 'bg-surface-container-high text-on-surface'
                ]"
              >
                {{ ruta.badgeTexto }}
              </span>

              <!-- Badge Inferior Derecho: Dificultad y Distancia -->
              <span class="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1">
                <span class="material-symbols-outlined text-[12px]" aria-hidden="true">{{ ruta.icono }}</span>
                <span>{{ ruta.dificultad }} · {{ ruta.distancia }}</span>
              </span>
            </div>

            <!-- Contenido y Paradas de la Ruta -->
            <div class="p-3.5 flex flex-col gap-2">
              <div>
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    {{ ruta.titulo }}
                  </h3>
                  <span class="material-symbols-outlined text-[18px] text-primary" aria-hidden="true">
                    arrow_forward
                  </span>
                </div>
                <p class="text-xs text-on-surface-variant line-clamp-1 mt-0.5">{{ ruta.descripcion }}</p>
              </div>

              <!-- Lista resumen de museos incluidos -->
              <div class="flex flex-col gap-1 pt-1 border-t border-surface-container/60">
                <span class="text-[10px] uppercase font-bold text-primary tracking-wider flex items-center gap-1">
                  <span class="material-symbols-outlined text-[12px]" aria-hidden="true">museum</span>
                  {{ ruta.museos?.length || 0 }} Paradas incluidas
                </span>

                <div class="flex items-center justify-between text-[11px] text-on-surface-variant">
                  <span>Cartas descubiertas</span>
                  <span class="font-bold text-primary tabular-nums">
                    {{ ruta.cartasDescubiertas }} / {{ ruta.totalCartas }}
                  </span>
                </div>

                <div class="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                  <div 
                    class="h-full bg-primary-container rounded-full transition-all duration-500"
                    :style="{ width: `${(ruta.cartasDescubiertas / ruta.totalCartas) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- Desafío Diario: Banner Gamificado -->
      <section class="px-4 pt-4 pb-2">
        <div class="relative p-4 rounded-2xl bg-gradient-to-r from-primary-container to-secondary text-on-primary shadow-elevated overflow-hidden flex items-center justify-between">
          <div class="relative z-10 flex flex-col pr-3">
            <span class="text-[10px] uppercase tracking-wider font-extrabold text-primary-fixed">
              Desafío Diario
            </span>
            <h3 class="text-base font-extrabold text-on-primary leading-tight mt-0.5">
              Visita Casa de la Libertad
            </h3>
            <p class="text-xs text-on-primary/90 mt-1">
              Escanea el código en la galería presidencial y gana +50 PTS extras hoy.
            </p>
          </div>

          <div class="relative z-10 shrink-0 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-on-primary shadow-xs">
            <span class="material-symbols-outlined text-[28px]" aria-hidden="true">stars</span>
          </div>

          <div class="absolute -right-4 -bottom-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none"></div>
        </div>
      </section>
    </div>

    <!-- ========================================== -->
    <!-- MODO 2: CATÁLOGO COMPLETO DE MUSEOS SUELTOS -->
    <!-- ========================================== -->
    <div v-else class="flex flex-col w-full px-4 gap-3">
      <!-- Buscador y Filtro Rápido de Museos -->
      <div class="flex flex-col gap-2.5">
        <div class="relative w-full">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant pointer-events-none">
            search
          </span>
          <input
            v-model="busquedaMuseo"
            type="search"
            placeholder="Buscar entre los 12 museos de Sucre…"
            class="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-container-lowest border border-surface-container text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary-container shadow-xs"
          />
        </div>

        <!-- Filtros por Categoría de Museo -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
          <button
            v-for="cat in categoriasMuseos"
            :key="cat.id"
            type="button"
            @click="categoriaMuseoFiltro = cat.id"
            class="shrink-0 px-3 py-1 rounded-full text-[11px] font-bold shadow-xs active:scale-95 transition-all"
            :class="[
              categoriaMuseoFiltro === cat.id
                ? 'bg-primary-container text-on-primary'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-surface-container'
            ]"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- Resumen de Resultados -->
      <div class="flex items-center justify-between text-xs text-on-surface-variant pt-1">
        <span class="font-bold text-on-surface">
          Catálogo Patrimonial de Sucre
        </span>
        <span class="tabular-nums font-semibold">
          {{ museosFiltrados.length }} museos encontrados
        </span>
      </div>

      <!-- Lista Vertical de los 12 Museos Sueltos -->
      <div class="flex flex-col gap-3">
        <article
          v-for="museo in museosFiltrados"
          :key="museo.id"
          class="flex flex-col rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md"
        >
          <!-- Fila Principal con Miniatura y Datos -->
          <div class="p-3.5 flex gap-3.5">
            <!-- Miniatura del Museo -->
            <div class="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-xs bg-surface-container">
              <img 
                :src="museo.imagen" 
                :alt="`Fotografía de ${museo.nombre}`" 
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <span class="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[9px] font-bold uppercase">
                +{{ museo.puntos }} PTS
              </span>
            </div>

            <!-- Contenido del Museo -->
            <div class="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary-fixed text-primary">
                    {{ museo.categoria }}
                  </span>
                  <span class="text-[10px] text-on-surface-variant font-medium flex items-center gap-0.5">
                    <span class="material-symbols-outlined text-[12px] text-primary" aria-hidden="true">near_me</span>
                    {{ museo.distancia }}
                  </span>
                </div>

                <h3 class="text-sm font-extrabold text-on-surface leading-tight mt-1 line-clamp-1">
                  {{ museo.nombre }}
                </h3>

                <p class="text-[11px] text-on-surface-variant line-clamp-2 mt-1 leading-snug">
                  {{ museo.descripcion }}
                </p>
              </div>

              <!-- Horario / Dirección -->
              <span class="text-[10px] text-on-surface-variant font-medium flex items-center gap-1 mt-1 truncate">
                <span class="material-symbols-outlined text-[12px]" aria-hidden="true">schedule</span>
                {{ museo.horario }}
              </span>
            </div>
          </div>

          <!-- Barra de Acciones del Museo -->
          <div class="flex items-center justify-between px-3.5 py-2.5 bg-surface-container-low/70 border-t border-surface-container">
            <span class="text-[10px] text-on-surface-variant truncate max-w-[180px] flex items-center gap-1">
              <span class="material-symbols-outlined text-[13px] text-primary" aria-hidden="true">pin_drop</span>
              {{ museo.direccion }}
            </span>

            <div class="flex items-center gap-2 shrink-0">
              <button
                type="button"
                @click="ubicarEnMapa(museo)"
                class="px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface text-[11px] font-bold hover:bg-surface-container-high active:scale-95 transition-all flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-primary"
                aria-label="Ver este museo en el mapa"
              >
                <span class="material-symbols-outlined text-[14px]" aria-hidden="true">map</span>
                <span>En Mapa</span>
              </button>

              <button
                type="button"
                @click="escanearItem(museo)"
                class="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary text-[11px] font-bold shadow-xs hover:bg-primary active:scale-95 transition-all flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-primary"
                aria-label="Escanear placa QR de este museo"
              >
                <span class="material-symbols-outlined text-[14px]" aria-hidden="true">qr_code_scanner</span>
                <span>Escanear</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- Modal Interactivo: Desglose de Museos de la Ruta Seleccionada -->
    <RutaDetalleModal
      :ruta="rutaSeleccionada"
      :is-open="modalRutaAbierto"
      @close="modalRutaAbierto = false"
      @locate-stop="ubicarEnMapa"
      @scan-stop="escanearItem"
    />
  </div>
</template>
