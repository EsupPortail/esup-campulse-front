import {createI18n} from 'vue-i18n'

import fr from '@/locales/fr.json'

const appLocale = import.meta.env.VITE_APP_I18N_LOCALE

// localStorage.getItem('octantLocale') || navigator.language.split('-')[0] || appLocale

const locale = import.meta.env.NODE_ENV === 'test'
    ? appLocale
    : navigator.language.split('-')[0] || appLocale

export default createI18n({
    legacy: false,
    locale,
    fallbackLocale: appLocale,
    messages: {
        fr,
    },
})
