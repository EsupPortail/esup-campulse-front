import type {RouteLocationMatched, RouteParams} from 'vue-router'

const urlRegex = /^(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?$/

export default function () {
    function formatDate(date: string) {
        if (date) {
            const timeStamp = Date.parse(date)
            const formatDate = new Date(timeStamp)
            const month = formatDate.getMonth() + 1
            const day = formatDate.getDate()
            return formatDate.getFullYear() + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day)
        }
    }

    // To test
    function fromDateIsAnterior(from: string, to: string) {
        const splitFrom = from.split('-')
        const splitTo = to.split('-')
        const splitNow = (new Date().toJSON().slice(0, 10)).split('-')

        if (splitFrom[0] !== splitNow[0]) return false
        if (splitFrom[1] !== splitNow[1]) return false
        if (splitFrom[2] !== splitNow[2]) return false

        if (from === '' || to === '') return true

        if (splitFrom[0] > splitTo[0]) return false
        if (splitFrom[1] > splitTo[1]) return false
        if (splitFrom[2] > splitTo[2]) return false
        return true
    }

    /*function fromDateIsAnterior(from: string, to: string) {
        let dateFrom = from
        let dateTo = to
        if (from !== '') {
            dateFrom = new Date(from)
        }
        if (to !== '') {
            dateTo = new Date(to)
        }
        const dateToday = (new Date()).setHours(0, 0, 0, 0)
        let result = true
        if ((dateFrom < dateToday) || (dateTo !== '' && dateTo < dateToday)) result = false
        else if (dateTo !== '' && dateFrom > dateTo) result = false
        return result
    }*/

    /**
     * It simply checks if 2 arrays are equal.
     * Useful to compare if the user's groups have changed for example.
     */
    function arraysAreEqual(a: number[], b: number[]) {
        if (a.length === b.length) {
            return a.every(element => {
                return b.includes(element)
            })
        }
        return false
    }

    /**
     * It takes an array of RouteLocationMatched objects and returns an array of objects with a label and to property
     * @param {RouteLocationMatched[]} routeMatched - RouteLocationMatched[]
     * @param routeParams
     * @returns An array of objects with a label and to property.
     */
    // To re test
    function initBreadcrumbs(routeMatched: RouteLocationMatched[], routeParams: RouteParams) {
        const breadcrumbs: { label: string, to: string }[] = []
        for (let i = 0; i < routeMatched.length; i++) {
            if (routeMatched[i].meta.breadcrumb) {
                let path = ''
                if (routeMatched[i].path.includes(':id')) {
                    const id = routeParams.id as string
                    path = routeMatched[i].path.replace(':id', id)
                } else {
                    path = routeMatched[i].path
                }
                breadcrumbs.push({
                    label: routeMatched[i].meta.breadcrumb as string,
                    to: path
                })
            }
        }
        return breadcrumbs
    }

    return {formatDate, arraysAreEqual, urlRegex, initBreadcrumbs, fromDateIsAnterior}
}
