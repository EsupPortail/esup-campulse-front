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
        let result = true
        if (from === '' || to === '') return result
        const splitFrom = from.split('-')
        const splitTo = to.split('-')
        for (let i = 0; i < splitFrom.length; i++) {
            if (splitFrom[i] > splitTo[i]) {
                result = false
                break
            }
        }
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
