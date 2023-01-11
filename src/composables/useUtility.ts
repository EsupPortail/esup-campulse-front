const urlRegex = /^(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?$/
const dateRegex = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/

export default function () {
    function formatDate(date: string) {
        if (date) {
            const timeStamp = Date.parse(date)
            const formatDate = new Date(timeStamp)
            return formatDate.getDate() + '/' + (formatDate.getMonth() + 1) + '/' + formatDate.getFullYear()
        }
    }

    function arraysAreEqual(a: number[], b: number[]) {
        if (a.length === b.length) {
            return a.every(element => {
                return b.includes(element)
            })
        }
        return false
    }

    return {formatDate, arraysAreEqual, urlRegex, dateRegex}
}