import i18n from '@/plugins/i18n'

export default function() {

    function catchHTTPError(code: number) {
        let notification = ''
        switch (code) {
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
        default:
            notification = i18n.global.t('notifications.negative.error-500')
            break
        }
        return notification
    }

    return {
        catchHTTPError
    }
}
