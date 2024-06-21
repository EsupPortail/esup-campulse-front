import {fileURLToPath, URL} from 'url'
import {defineConfig, loadEnv} from 'vite'
import {resolve, dirname} from 'node:path'
import {quasar, transformAssetUrls} from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import {visualizer} from 'rollup-plugin-visualizer'


// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
    if (command) {
        const env = loadEnv(mode, process.cwd(), '')
        return {
            build: {
                sourcemap: true,
                rollupOptions: {
                    output: {
                        manualChunks: {
                            zxcvbn: [
                                'zxcvbn'
                            ]
                        }
                    }
                }
            },
            define: {
                __APP_ENV__: JSON.stringify(env.APP_ENV),
            },
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
                visualizer()
            ],
            publicDir: env.PUBLIC_FOLDER,
            resolve: {
                alias: {
                    '@': fileURLToPath(new URL('./src', import.meta.url)),
                    '#': fileURLToPath(new URL('./types', import.meta.url)),
                    '~': fileURLToPath(new URL('./tests', import.meta.url)),
                    // These lines are used to disable script unsafe-eval in Nginx CSP config.
                    'vue': fileURLToPath(new URL('./node_modules/vue/dist/vue.runtime.esm-bundler.js', import.meta.url)),
                    'vue-i18n': fileURLToPath(new URL('./node_modules/vue-i18n/dist/vue-i18n.runtime.esm-bundler.js', import.meta.url)),
                },
            },
            server: {
                port: 3000,
            },
            test: {
                environment: 'jsdom',
                coverage: {
                    extension: ['.ts'],
                    include: ['src/composables', 'src/plugins', 'src/stores'],
                    exclude: ['src/composables/useAxios.ts', 'src/composables/useColorVariants.ts'],
                }
            }
        }
    } else {
        return {}
    }
})
