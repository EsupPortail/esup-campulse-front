import {createApp} from 'vue'
import {createPinia} from 'pinia'
import {Loading, Notify, Quasar} from 'quasar'
import quasarLang from 'quasar/lang/fr'
import quasarIconSet from 'quasar/icon-set/svg-mdi-v6'
import '@quasar/extras/mdi-v6/mdi-v6.css'
import 'quasar/dist/quasar.css'
import * as Sentry from '@sentry/vue'
import {BrowserTracing} from '@sentry/tracing'
import App from '@/App.vue'
import router from '@/router'
import i18n from '@/plugins/i18n'
import {CasAuthentication} from "@vue-unistra/cas-authentication";
import axios from "axios";


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
            new BrowserTracing({
                routingInstrumentation: Sentry.vueRouterInstrumentation(router),
                tracingOrigins: ['localhost', import.meta.env.VITE_APP_FRONT_URL, /^\//]
            }),
        ],
        tracesSampleRate: 1.0,
    })
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
        notify: {},
    },
    lang: quasarLang,
    iconSet: quasarIconSet
})
console.log(CasAuthentication)
app.use(CasAuthentication, {
    router,
    axios: axios.create({
        baseURL: import.meta.env.VITE_APP_BASE_URL as string,
    }),
    options: {
        hasFreeAPI: true,
        jwtServerUrl: import.meta.env.VITE_APP_BASE_URL,
        loginRoute: {name: 'Login'},
        loginRouteIsInternal: true,
        serverCAS: import.meta.env.VITE_APP_CAS_URL,
    }
})

app.mount('#app')

