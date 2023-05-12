import {ref, watch} from 'vue'
import type {Commission, SelectCommissionDateLabel} from '#/commissions'
import {useAxios} from '@/composables/useAxios'
import type {SelectLabel} from '#/index'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import type {CommissionDate} from '#/project'
import type {AxiosInstance} from 'axios'

// Used to store commissions from /commissions/
const commissions = ref<Commission[]>([])

// Used to create labels to register user commissions
const commissionOptions = ref<SelectLabel[]>([])

// Used to store the commissions of the user
const userCommissions = ref<number[]>([])

// Used to store commission dates
const commissionDates = ref<CommissionDate[]>([])

// Used to store commission dates labels for project submission
const commissionDatesLabels = ref<SelectCommissionDateLabel[]>([])

export default function () {

    const {axiosPublic, axiosAuthenticated} = useAxios()
    const userManagerStore = useUserManagerStore()

    // GET COMMISSION INFOS
    async function getCommissions() {
        if (commissions.value.length === 0) {
            commissions.value = (await axiosPublic.get<Commission[]>('/commissions/')).data
        }
    }

    async function getCommissionDates(onlyNext: boolean | undefined, onlyActive: boolean | undefined, managedProjects: boolean | undefined) {
        let instance = axiosPublic as AxiosInstance
        let urlString = '/commissions/commission_dates'
        const urlArray = []
        if (onlyNext !== undefined) urlArray.push(`only_next=${onlyNext}`)
        if (onlyActive !== undefined) urlArray.push(`active_projects=${onlyActive}`)
        if (managedProjects !== undefined) {
            urlArray.push(`managed_projects=${managedProjects}`)
            if (managedProjects) instance = axiosAuthenticated
        }
        if (urlArray.length) urlString += `?${urlArray.join('&')}`
        commissionDates.value = (await instance.get<CommissionDate[]>(urlString)).data
    }

    async function postCommissionDate(commission: number, commissionDate: string, submissionDate: string) {
        await axiosAuthenticated.post('/commissions/commission_dates', {
            commission,
            commissionDate,
            submissionDate
        })
    }

    async function patchCommissionDate(id: number, commissionDate: string, submissionDate: string) {
        await axiosAuthenticated.patch(`/commissions/commission_dates/${id}`, {
            commissionDate,
            submissionDate
        })
    }

    async function deleteCommissionDate(id: number) {
        await axiosAuthenticated.delete(`/commissions/commission_dates/${id}`)
    }

    // INIT COMMISSION DATA
    const initCommissionLabels = () => {
        commissionOptions.value = []
        commissions.value.forEach(function (commission) {
            commissionOptions.value.push({
                value: commission.id,
                label: commission.acronym
            })
        })
    }
    watch(() => commissions.value.length, initCommissionLabels)

    const initUserCommissions = () => {
        userCommissions.value = []
        userManagerStore.user?.groups.forEach((group) => {
            if (group.commissionId) userCommissions.value.push(group.commissionId)
        })
    }
    watch(() => userManagerStore.user, initUserCommissions)

    const initCommissionDatesLabels = (isSite: boolean | undefined) => {
        commissionDatesLabels.value = []
        commissionDates.value.forEach((commissionDate) => {
            const commission = commissions.value.find(obj => obj.id === commissionDate.commission)
            if (commission) {
                // 1st option : We simply initialize commissionDates based on isSite param
                // 2nd option : We initialize labels based on what we got from GET request
                if (isSite || (isSite === false && !commission.isSite) || isSite === undefined) {
                    commissionDatesLabels.value.push({
                        value: commissionDate.id,
                        label: `${commission.acronym} (${commissionDate.commissionDate.split('-').reverse().join('/')})`,
                        commission: commissionDate.commission
                    })
                }
            }
        })
    }

    return {
        getCommissions,
        commissions,
        commissionOptions,
        userCommissions,
        initUserCommissions,
        commissionDates,
        getCommissionDates,
        commissionDatesLabels,
        initCommissionDatesLabels,
        postCommissionDate,
        deleteCommissionDate,
        patchCommissionDate
    }
}
