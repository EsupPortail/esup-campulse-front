import i18n from '@/plugins/i18n'
import type {Error} from '#/index'
import {useRoute} from 'vue-router'
import router from '@/router'

export default function () {
    const route = useRoute()

    async function catchHTTPError(error: Error) {
        let notification = ''
        if (import.meta.env.VITE_APP_ENABLE_BACKEND_ERRORS === 'true' && (error.data.error !== '')) {
            notification = `${error.status} : ${JSON.stringify(error.data)}`
        } else {
            switch (error.status) {
            case 400:
                notification = i18n.global.t('notifications.negative.error-400')
                break
            case 401:
                notification = i18n.global.t('notifications.negative.error-401')
                break
            case 403:
                notification = i18n.global.t('notifications.negative.error-403')
                break
            case 404:
                notification = i18n.global.t('notifications.negative.error-404')
                break
            case 405:
                notification = i18n.global.t('notifications.negative.error-405')
                break
            case 413:
                notification = i18n.global.t('notifications.negative.error-413')
                break
            case 415:
                notification = i18n.global.t('notifications.negative.error-415')
                break
            case 503:
                if (route.name !== 'Maintenance') {
                    await router.push({name: 'Maintenance'})
                }
                notification = i18n.global.t('notifications.negative.error-503')
                break
            default:
                notification = i18n.global.t('notifications.negative.error-500')
                break
            }
        }
        return notification
    }

    return {
        catchHTTPError
    }
}
