import {ref} from 'vue'
import type {Commission, CommissionFund, Fund} from '#/commissions'
import {useAxios} from '@/composables/useAxios'
import type {SelectLabel} from '#/index'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import useUtility from '@/composables/useUtility'

// Funds
const funds = ref<Fund[]>([])
const fundsLabels = ref<SelectLabel[]>([])
const userFunds = ref<number[]>([])

// Commissions
const commissions = ref<Commission[]>([])
const commissionFunds = ref<CommissionFund[]>([])
const commissionLabels = ref<SelectLabel[]>([])

export default function () {

    const {axiosPublic, axiosAuthenticated} = useAxios()
    const userManagerStore = useUserManagerStore()
    const {arraysAreEqual} = useUtility()

    // Funds
    async function getFunds() {
        if (funds.value.length === 0) {
            funds.value = (await axiosPublic.get<Fund[]>('/commissions/funds/')).data
        }
    }

    const initFundsLabels = () => {
        fundsLabels.value = funds.value.map(fund => ({
            value: fund.id,
            label: fund.acronym
        }))
    }

    const initUserFunds = () => {
        userFunds.value = []
        userManagerStore.user?.groups?.forEach((group) => {
            if (group.fundId) userFunds.value.push(group.fundId)
        })
    }

    // Commissions
    async function getCommissionsForManagers(
        activeProjects: boolean | undefined,
        isOpenToProjects: boolean | undefined,
        isSite: boolean | undefined,
        managedCommissions: boolean | undefined,
        managedProjects: boolean | undefined) {

        let urlString = '/commissions/'
        const urlArray = []

        if (activeProjects !== undefined) urlArray.push(`active_projects=${activeProjects}`)
        if (isOpenToProjects !== undefined) urlArray.push(`is_open_to_projects=${isOpenToProjects}`)
        if (isSite !== undefined) urlArray.push(`is_site=${isSite}`)
        if (managedCommissions !== undefined) urlArray.push(`managed_commissions=${managedCommissions}`)
        if (managedProjects !== undefined) urlArray.push(`managed_projects=${managedProjects}`)

        if (urlArray.length) urlString += `?${urlArray.join('&')}`
        commissions.value = (await axiosPublic.get<Commission[]>(urlString)).data
    }

    async function getCommissionsForStudents(isOpenToProjects: boolean | undefined, isSite: boolean | undefined) {
        let urlString = '/commissions/'
        const urlArray = []

        if (isOpenToProjects !== undefined) urlArray.push(`is_open_to_projects=${isOpenToProjects}`)
        if (isSite !== undefined) urlArray.push(`is_site=${isSite}`)

        if (urlArray.length) urlString += `?${urlArray.join('&')}`
        commissions.value = (await axiosPublic.get<Commission[]>(urlString)).data
    }

    async function getCommissionFunds() {
        commissionFunds.value = (await axiosPublic.get<CommissionFund[]>('/commissions/commission_funds/')).data
    }

    async function postNewCommission(commissionDate: string, submissionDate: string, isOpenToProjects: boolean, funds: number[]) {
        const newCommission: Commission = (await axiosAuthenticated.post('/commissions/', {
            commissionDate,
            submissionDate,
            isOpenToProjects
        })).data
        for (const fund of funds) {
            await axiosAuthenticated.post('/commissions/commission_funds/', {
                commission: newCommission.id,
                fund
            })
        }
    }

    async function updateCommission(id: number, commissionDate: string, submissionDate: string, oldFunds: number[], newFunds: number[]) {
        await axiosAuthenticated.patch(`/commissions/${id}`, {
            commissionDate,
            submissionDate
        })
        if (!arraysAreEqual(oldFunds, newFunds)) {
            const newFundsToPost = newFunds.filter(x => oldFunds.indexOf(x) === -1)
            const oldFundsToDelete = oldFunds.filter(x => newFunds.indexOf(x) === -1)

            for (let i = 0; i < newFundsToPost.length; i++) {
                await axiosAuthenticated.post('/commissions/commission_funds/', {
                    commission: id,
                    fund: newFundsToPost[i]
                })
            }
            for (let i = 0; i < oldFundsToDelete.length; i++) {
                await axiosAuthenticated.delete(`/commissions/commission_funds/${id}`)
            }
        }

    }

    async function deleteCommission(id: number) {
        await axiosAuthenticated.delete(`/commissions/${id}`)
    }


    /*const initCommissionFundsLabels = (isSite: boolean | undefined) => {
        commissionDatesLabels.value = []
        commissionDates.value.forEach((commissionDate) => {
            const fund = funds.value.find(obj => obj.id === commissionDate.commission)
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
    }*/

    return {
        funds,
        fundsLabels,
        userFunds,
        deleteCommission,
        updateCommission,
        initFundsLabels,
        getFunds,
        commissions,
        commissionLabels,
        commissionFunds,
        initUserFunds,
        getCommissionsForManagers,
        getCommissionsForStudents,
        postNewCommission,
        getCommissionFunds
    }
}
