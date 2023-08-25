import {createI18n} from 'vue-i18n'

const appLocale = import.meta.env.VITE_APP_I18N_LOCALE
const {default: localeFile} = await import(`../locales/${import.meta.env.VITE_APP_I18N_LOCALE}.json`)

// localStorage.getItem('octantLocale') || navigator.language.split('-')[0] || appLocale

const locale = import.meta.env.NODE_ENV === 'test'
    ? appLocale
    : navigator.language.split('-')[0] || appLocale

export default createI18n({
    legacy: false,
    locale,
    fallbackLocale: appLocale,
    messages: {
        fr: localeFile,
    },
})
