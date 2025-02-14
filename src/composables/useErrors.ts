import i18n from '@/plugins/i18n'
import type {Error} from '#/index'

export default function () {
    async function catchHTTPError(error: Error) {
        let notification = ''
        if (import.meta.env.VITE_APP_ENABLE_BACKEND_ERRORS === 'true' && (error.data.error !== '')) {
            notification = `${error.status} : ${JSON.stringify(error.data)}`
        } else {
            notification = i18n.global.t(`notifications.negative.error-${error.status}`)
        }
        return notification
    }

    return {
        catchHTTPError
    }
}
