import {describe, expect, it, vi} from 'vitest'
import type {RouteLocationNormalizedLoaded} from 'vue-router'
import {useRoute} from 'vue-router'
import useUtility from '@/composables/useUtility'

vi.mock('vue-router', () => ({useRoute: vi.fn()}))

describe('useUtility', () => {

    describe('formatDate', () => {
        const {formatDate} = useUtility()

        it('should return formatted date', () => {
            expect(formatDate('2022-10-27 13:45:35.000000 +00:00')).toEqual('2022-10-27')
        })

        it('should not return a date with an error', () => {
            expect(formatDate('2022-10-27 13:45:35.000000 +00:00')).not.toEqual('2022-10-28')
        })

        it('should return nothing if no date in arg', () => {
            expect(formatDate('')).toBeUndefined()
        })
    })

    describe('arraysAreEqual', () => {
        const {arraysAreEqual} = useUtility()
        const a = [1, 2, 3]
        const b = [3, 1, 2]
        const c = [1, 2, 4]
        const d = [4, 5, 6, 7]

        it('should be false if arrays have not the same length', () => {
            expect(arraysAreEqual(a, d)).toBeFalsy()
        })

        it('should be false if arrays do not contain the same values', () => {
            expect(arraysAreEqual(a, c)).toBeFalsy()
        })

        it('should be true if arrays contain the same values', () => {
            expect(arraysAreEqual(a, b)).toBeTruthy()
        })
    })

    describe('initBreadcrumbs', () => {
        const {initBreadcrumbs} = useUtility()

        it('should return an array of breadcrumb with label and to based on the route', () => {
            vi.mocked(useRoute).mockReturnValue({
                name: 'ValidateUsers', matched: [
                    {
                        path: '/',
                        meta: {}
                    },
                    {
                        path: '/dashboard',
                        meta: {breadcrumb: 'Tableau de bord'}
                    },
                    {
                        path: '/dashboard/validate-users',
                        meta: {breadcrumb: 'Valider des comptes'}
                    }
                ]
            } as RouteLocationNormalizedLoaded)
            const route = useRoute()
            initBreadcrumbs(route.matched, route.params)
            expect(initBreadcrumbs(route.matched, route.params)).toEqual([
                {
                    label: 'Tableau de bord',
                    to: '/dashboard'
                },
                {
                    label: 'Valider des comptes',
                    to: '/dashboard/validate-users'
                }
            ])
        })

        it('should get an id from params if there is an id in the route path', () => {
            vi.mocked(useRoute).mockReturnValue({
                name: 'AssociationDetail',
                matched: [
                    {
                        path: '/',
                        meta: {}
                    },
                    {
                        path: '/associations',
                        meta: {breadcrumb: 'Annuaire des associations'}
                    },
                    {
                        path: '/associations/1',
                        meta: {breadcrumb: 'Fiche association'},
                    }
                ]
            } as RouteLocationNormalizedLoaded)
            const route = useRoute()
            initBreadcrumbs(route.matched, route.params)
            expect(initBreadcrumbs(route.matched, route.params)).toEqual([
                {
                    label: 'Annuaire des associations',
                    to: '/associations'
                },
                {
                    label: 'Fiche association',
                    to: '/associations/1'
                }
            ])
        })
    })

    describe('filterizeSearch', () => {
        it('should return a string with no spaces, lowercase, and without accents', () => {
            const {filterizeSearch} = useUtility()
            const unfilterized = 'association des étudiants du site Alsace'
            const filterized = 'associationdesetudiantsdusitealsace'
            expect(filterizeSearch(unfilterized)).toEqual(filterized)
        })
    })
})
