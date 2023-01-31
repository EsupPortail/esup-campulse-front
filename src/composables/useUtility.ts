import {ref} from 'vue'
import type {RouteLocationMatched} from 'vue-router'


const urlRegex = /^(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?$/

const breadcrumbs = ref<{ label: string, to: string }[]>([])


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

    function arraysAreEqual(a: number[], b: number[]) {
        if (a.length === b.length) {
            return a.every(element => {
                return b.includes(element)
            })
        }
        return false
    }

    function initBreadcrumbs(routeMatched: RouteLocationMatched[]) {
        breadcrumbs.value = []
        for (let i = 0; i < routeMatched.length; i++) {
            if (routeMatched[i].meta.breadcrumb) {
                breadcrumbs.value.push({
                    label: routeMatched[i].meta.breadcrumb as string,
                    to: routeMatched[i].path
                })
            }
        }
    }

    return {formatDate, arraysAreEqual, urlRegex, initBreadcrumbs, breadcrumbs}
}
