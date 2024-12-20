import {createApp} from 'vue'
import {createPinia} from 'pinia'
import {Loading, Notify, Quasar, setCssVar} from 'quasar'
import type {QuasarPluginOptions} from 'quasar'
import quasarLang from 'quasar/lang/fr'
import quasarIconSet from 'quasar/icon-set/svg-mdi-v6'
import '@quasar/extras/mdi-v6/mdi-v6.css'
import 'quasar/dist/quasar.css'
import * as Sentry from '@sentry/vue'
import App from '@/App.vue'
import router from '@/router'
import i18n from '@/plugins/i18n'
import VueMatomo from 'vue-matomo'


/**
 * App initialisation
 */
const pinia = createPinia()
const app = createApp(App)

// Sentry init
if (import.meta.env.PROD) {
    Sentry.init({
        app,
        dsn: import.meta.env.VITE_APP_SENTRY_DSN,
        integrations: [
            Sentry.browserTracingIntegration({router}),
            Sentry.replayIntegration(),
        ],
        tracesSampleRate: 1.0,
        tracePropagationTargets: ['localhost', import.meta.env.VITE_APP_SENTRY_API_REGEX, /^\//]
    })
}

if (import.meta.env.VITE_APP_MATOMO_SERVER && import.meta.env.VITE_APP_MATOMO_SITE_ID) {
    app.use(
        VueMatomo,
        {
            router,
            host: import.meta.env.VITE_APP_MATOMO_SERVER,
            siteId: import.meta.env.VITE_APP_MATOMO_SITE_ID,
            debug: import.meta.env.VITE_APP_MATOMO_DEBUG || false,
        },
    )
}

app.use(i18n)
app.use(pinia)
app.use(router)
app.use(Quasar, {
    plugins: {
        Notify,
        Loading
    },
    config: {
        notify: {
            timeout: 0,
            actions: [
                {
                    color: 'white',
                    label: i18n.global.t('alerts.close')
                }
            ]
        },
    },
    lang: quasarLang,
    iconSet: quasarIconSet
} as Partial<QuasarPluginOptions>)

// Configure Quasar positive color for accessibility
setCssVar('positive', '#178731')

app.mount('#app')
