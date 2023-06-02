import {ref, watch} from 'vue'
import type {CommissionFund, SelectCommissionDateLabel} from '#/commissions'
import {useAxios} from '@/composables/useAxios'
import type {SelectLabel} from '#/index'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import type {CommissionDate} from '#/project'
import type {AxiosInstance} from 'axios'

// Used to store commissionFunds from /commissions/funds/
const commissionFunds = ref<CommissionFund[]>([])

// Used to create labels to register user commissionsFunds
const commissionFundsLabels = ref<SelectLabel[]>([])

// Used to store the commissionFunds of a user
const userCommissionFunds = ref<number[]>([])

// Used to store commission dates
const commissionDates = ref<CommissionDate[]>([])

// Used to store commission dates labels for project submission
const commissionDatesLabels = ref<SelectCommissionDateLabel[]>([])

export default function () {

    const {axiosPublic, axiosAuthenticated} = useAxios()
    const userManagerStore = useUserManagerStore()

    // GET COMMISSION INFOS
    async function getCommissions() {
        if (commissionFunds.value.length === 0) {
            commissionFunds.value = (await axiosPublic.get<CommissionFund[]>('/commissions/funds/')).data
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

    // INIT COMMISSION FUNDS DATA
    const initCommissionFundsLabels = () => {
        commissionFundsLabels.value = []
        commissionFunds.value.forEach(function (commission) {
            commissionFundsLabels.value.push({
                value: commission.id,
                label: commission.acronym
            })
        })
    }
    watch(() => commissionFunds.value.length, initCommissionFundsLabels)

    const initManagedUserCommissionFunds = () => {
        userCommissionFunds.value = []
        userManagerStore.user?.groups?.forEach((group) => {
            if (group.fundId) userCommissionFunds.value.push(group.fundId)
        })
    }
    watch(() => userManagerStore.user, initManagedUserCommissionFunds)

    const initCommissionDatesLabels = (isSite: boolean | undefined) => {
        commissionDatesLabels.value = []
        commissionDates.value.forEach((commissionDate) => {
            const fund = commissionFunds.value.find(obj => obj.id === commissionDate.commission)
            if (fund) {
                // 1st option : We simply initialize commissionDates based on isSite param
                // 2nd option : We initialize labels based on what we got from GET request
                if (isSite || (isSite === false && !fund.isSite) || isSite === undefined) {
                    commissionDatesLabels.value.push({
                        value: commissionDate.id,
                        label: `${fund.acronym} (${commissionDate.commissionDate.split('-').reverse().join('/')})`,
                        commission: fund.id as number
                    })
                }
            }
        })
    }

    return {
        getCommissions,
        commissionFunds,
        commissionFundsLabels,
        userCommissionFunds,
        initManagedUserCommissionFunds,
        commissionDates,
        getCommissionDates,
        commissionDatesLabels,
        initCommissionDatesLabels,
        postCommissionDate,
        deleteCommissionDate,
        patchCommissionDate
    }
}
