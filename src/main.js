import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { hydrateFromBackend } from './services/hydrate.js'

// Carga datos de Supabase (si está configurado) antes de montar; ver services/hydrate.js
hydrateFromBackend().finally(() => {
  createApp(App).mount('#app')
})
