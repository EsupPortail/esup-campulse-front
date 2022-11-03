import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { Quasar } from 'quasar'
import quasarLang from 'quasar/lang/fr'
import quasarIconSet from 'quasar/icon-set/svg-mdi-v6'
import '@quasar/extras/mdi-v6/mdi-v6.css'
import 'quasar/dist/quasar.css'

import App from '@/App.vue'
import router from '@/router'
import i18n from '@/plugins/i18n'

/**
 * App initialisation
 */
const pinia = createPinia()
const app = createApp(App)

app.use(i18n)
app.use(pinia)
app.use(router)
app.use(Quasar, {
    plugins: {},
    lang: quasarLang,
    iconSet: quasarIconSet
})

app.mount('#app')

