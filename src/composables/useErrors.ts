export default function () {

    function catchHTTPError(code: number) {
        const HTTP_ERROR_CODES = [400, 401, 403, 404, 405, 413, 415]
        let notification = ''
        if (HTTP_ERROR_CODES.includes(code)) {
            notification = code.toString() + '-'
        } else if (code >= 500) {
            notification = '500-'
        }
        notification += 'error'
        return notification
    }

    return {
        catchHTTPError
    }
}
