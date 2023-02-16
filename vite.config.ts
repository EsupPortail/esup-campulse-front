import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    template: { transformAssetUrls }
  }),

  quasar({
    autoImportComponentCase: 'pascal'
  })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '#': fileURLToPath(new URL('./types', import.meta.url)),
      '~': fileURLToPath(new URL('./tests', import.meta.url)),
    },
  },
})
