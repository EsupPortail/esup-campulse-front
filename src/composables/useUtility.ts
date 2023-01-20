const urlRegex = /^(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?$/

export default function() {
    function formatDate(date: string) {
        if (date) {
            const timeStamp = Date.parse(date)
            const formatDate = new Date(timeStamp)
            return formatDate.getFullYear() + '-' + (formatDate.getMonth() + 1) + '-' + formatDate.getDate()
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

    return { formatDate, arraysAreEqual, urlRegex }
}
