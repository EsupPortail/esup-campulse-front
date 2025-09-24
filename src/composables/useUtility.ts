import type {RouteLocationMatched, RouteParams} from 'vue-router'
import {ref} from 'vue'

// Used to display dynamic title on certain pages like association detail
const dynamicTitle = ref<string | undefined>(undefined)

const CURRENCY = '€'

const urlRegex = /^(https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%\-/]))?$/

const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/

const openMenu = ref<boolean>(false)

export default function () {
    function formatDate(date: string): string {
        if (!date) return ''
        const timeStamp = Date.parse(date)
        const formatDate = new Date(timeStamp)
        const month = formatDate.getMonth() + 1
        const day = formatDate.getDate()
        return formatDate.getFullYear() + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day)
    }

    // To test
    function fromDateIsAnterior(from: string, to: string, enablePastDate: boolean) {
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
        if ((dateFrom < dateToday && !enablePastDate) || (dateTo !== '' && dateTo < dateToday && !enablePastDate)) result = false
        else if (dateTo !== '' && dateFrom > dateTo) result = false
        return result
    }

    function arraysAreEqual(a: number[], b: number[]) {
        if (a.length === b.length) {
            return a.every(element => {
                return b.includes(element)
            })
        }
        return false
    }

    // To re test
    function initBreadcrumbs(routeMatched: RouteLocationMatched[], routeParams: RouteParams) {
        const breadcrumbs: { label: string, to: string }[] = []
        for (const route of routeMatched) {
            if (!route.meta.breadcrumb) continue
            let path = ''
            if (route.path.includes(':id') || route.path.includes(':associationId') ||
                route.path.includes(':projectId')) {
                const id = routeParams.id as string
                const associationId = routeParams.associationId as string
                const projectId = routeParams.projectId as string
                path = route.path.replace(':id', id).replace(':associationId', associationId).replace(':projectId', projectId)
            } else {
                path = route.path
            }
            breadcrumbs.push({
                label: route.meta.breadcrumb as string,
                to: path
            })
        }
        return breadcrumbs
    }

    function filterizeSearch(stringToFilterize: string) {
        return stringToFilterize.replace(/ /g, '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    }

    return {
        formatDate,
        arraysAreEqual,
        urlRegex,
        initBreadcrumbs,
        fromDateIsAnterior,
        CURRENCY,
        phoneRegex,
        dynamicTitle,
        filterizeSearch,
        openMenu
    }
}
