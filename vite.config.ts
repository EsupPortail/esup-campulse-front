import {fileURLToPath, URL} from 'url'

import {defineConfig} from 'vite'
import {quasar, transformAssetUrls} from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            template: {transformAssetUrls}
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
            'vue': fileURLToPath(new URL('./node_modules/vue/dist/vue.runtime.esm-bundler.js', import.meta.url)),
        },
    },
    server: {
        port: 3000,
    },
    test: {
        environment: 'jsdom'
    }
    /*
    // Enable coverage for untested files.
    test: {
      coverage: {
        all: true
      }
    },
    */
})
