import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [vue()]

  // `npm run dev:https`: phones only allow camera/GPS on https (or localhost),
  // so serve the LAN dev server with a self-signed certificate.
  if (mode === 'https') {
    const { default: basicSsl } = await import('@vitejs/plugin-basic-ssl')
    plugins.push(basicSsl())
  }

  return {
    plugins,
    optimizeDeps: {
      entries: ['index.html']
    },
    server: {
      host: true,
      port: 5173
    }
  }
})
