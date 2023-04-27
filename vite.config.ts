import {fileURLToPath, URL} from 'url'

import {defineConfig} from 'vite'
import {resolve, dirname} from 'node:path'
import {quasar, transformAssetUrls} from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            template: {transformAssetUrls}
        }),
        quasar({
            autoImportComponentCase: 'pascal'
        }),
        // See https://vue-i18n.intlify.dev/guide/advanced/optimization.html
        VueI18nPlugin({
            include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**'),
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '#': fileURLToPath(new URL('./types', import.meta.url)),
            '~': fileURLToPath(new URL('./tests', import.meta.url)),
            // Enable these lines to disable script unsafe-eval in Nginx config.
            'vue': fileURLToPath(new URL('./node_modules/vue/dist/vue.runtime.esm-bundler.js', import.meta.url)),
            'vue-i18n': fileURLToPath(new URL('./node_modules/vue-i18n/dist/vue-i18n.runtime.esm-bundler.prod.js', import.meta.url)),
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
