import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { hydrateFromBackend } from './services/hydrate.js'
import { capturePendingToken } from './services/deeplink.js'

// Si se abrió desde una placa QR (/q/<token>), guarda el token y limpia la URL
capturePendingToken()

// Carga datos de Supabase (si está configurado) antes de montar; ver services/hydrate.js
hydrateFromBackend().finally(() => {
  createApp(App).mount('#app')
})
