import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [
    svgr({
      exportAsDefault: true
    }),
    react()
  ],
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
      { find: 'components', replacement: '/src/components' },
      { find: 'partials', replacement: '/src/partials' },
      { find: 'store', replacement: '/src/store/store.ts' },
      { find: 'settings', replacement: '/src/settings.ts' },
      { find: 'styles', replacement: '/src/styles' },
      { find: 'hooks', replacement: '/src/hooks' },
      { find: 'utils', replacement: '/src/utils' },
      { find: 'gsap', replacement: '/src/vendor/gsap' }
    ]
  },
  css: {
    modules: {
      generateScopedName: '[folder]-[local]_[hash:base64:5]'
    }
  }
})
