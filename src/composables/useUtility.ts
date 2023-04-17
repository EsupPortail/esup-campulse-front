import type {RouteLocationMatched, RouteParams} from 'vue-router'

const CURRENCY = '€'

const urlRegex = /^(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?$/

const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/

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
        let dateFrom: string | Date = from
        let dateTo: string | Date = to
        if (from !== '') {
            dateFrom = new Date(from)
        }
        if (to !== '') {
            dateTo = new Date(to)
        }
        const dateToday = new Date()
        dateToday.setHours(0, 0, 0, 0)
        let result = true
        if ((dateFrom < dateToday) || (dateTo !== '' && dateTo < dateToday)) result = false
        else if (dateTo !== '' && dateFrom > dateTo) result = false
        return result
    }

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
                if (routeMatched[i].path.includes(':id') || routeMatched[i].path.includes(':associationId') ||
                    routeMatched[i].path.includes(':projectId')) {
                    const id = routeParams.id as string
                    const associationId = routeParams.associationId as string
                    const projectId = routeParams.projectId as string
                    path = routeMatched[i].path.replace(':id', id).replace(':associationId', associationId).replace(':projectId', projectId)
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

    return {formatDate, arraysAreEqual, urlRegex, initBreadcrumbs, fromDateIsAnterior, CURRENCY, phoneRegex}
}
