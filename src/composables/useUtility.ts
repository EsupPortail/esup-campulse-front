export default function () {
    function formatDate(date: string) {
        if (date) {
            const timeStamp = Date.parse(date)
            const formatDate = new Date(timeStamp)
            return formatDate.getDate() + '/' + (formatDate.getMonth() + 1) + '/' + formatDate.getFullYear()
        }
    }

    return {formatDate}
}