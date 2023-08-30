import {ref} from 'vue'
import type {Commission, CommissionFund, Fund, NewCommission, SelectLabelFund, UpdateCommission} from '#/commissions'
import {useAxios} from '@/composables/useAxios'
import type {SelectLabel} from '#/index'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import useUtility from '@/composables/useUtility'

// Funds
const funds = ref<Fund[]>([])
const fundsLabels = ref<SelectLabelFund[]>([])
const userFunds = ref<number[]>([])

// Commissions
const commissions = ref<Commission[]>([])
const commission = ref<Commission | undefined>(undefined)
const commissionFunds = ref<CommissionFund[]>([])
const commissionLabels = ref<SelectLabel[]>([])

export default function () {

    const {axiosPublic, axiosAuthenticated} = useAxios()
    const userManagerStore = useUserManagerStore()
    const {arraysAreEqual} = useUtility()

    // Funds
    async function getFunds() {
        if (!funds.value.length) {
            funds.value = (await axiosPublic.get<Fund[]>('/commissions/funds/names')).data
        }
    }

    const initFundsLabels = () => {
        fundsLabels.value = funds.value.map(fund => ({
            value: fund.id,
            label: fund.acronym
        }))
    }

    const initChosenCommissionFundsLabels = (commission: number, isSite: boolean) => {
        fundsLabels.value = []
        commissionFunds.value.filter(obj => obj.commission === commission).forEach(x => {
            const fund = funds.value.find(obj => obj.id === x.fund)
            if (isSite || (!isSite && !fund?.isSite))
                fundsLabels.value.push({
                    value: x.id,
                    label: fund?.acronym as string,
                    fund: fund?.id
                })
        })
    }

    const initUserFunds = () => {
        userFunds.value = []
        userManagerStore.user?.groups?.forEach((group) => {
            if (group.fundId) userFunds.value.push(group.fundId)
        })
    }

    const getFundLabel = (commissionFund: number) => {
        return funds.value
            .find(obj => obj.id === (commissionFunds.value
                .find(obj => obj.id === commissionFund)?.fund))?.acronym
    }

    // Commissions
    async function getCommissionsForManagers(
        withActiveProjects: boolean | undefined,
        onlyWithActiveProjects: boolean | undefined,
        isOpenToProjects: boolean | undefined,
        isSite: boolean | undefined,
        managedProjects: boolean | undefined,
        funds?: number[]) {

        let urlString = '/commissions/'
        const urlArray = []

        if (withActiveProjects !== undefined) urlArray.push(`with_active_projects=${withActiveProjects}`)
        if (onlyWithActiveProjects !== undefined) urlArray.push(`only_with_active_projects=${onlyWithActiveProjects}`)
        if (isOpenToProjects !== undefined) urlArray.push(`is_open_to_projects=${isOpenToProjects}`)
        if (isSite !== undefined) urlArray.push(`is_site=${isSite}`)
        if (managedProjects !== undefined) urlArray.push(`managed_projects=${managedProjects}`)
        if (funds?.length) urlArray.push(`funds=${funds.join(',')}`)

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

    async function getCommission(id: number) {
        commission.value = (await axiosPublic.get<Commission>(`/commissions/${id}`)).data
    }

    const initCommissionLabels = () => {
        commissionLabels.value = commissions.value.map(commission => ({
            value: commission.id,
            label: commission.name + ' ('
                + commission.commissionDate.split('-').reverse().join('/') + ')'
        }))
    }

    async function getNextCommission() {
        const openCommissions = (await axiosPublic.get<Commission[]>('/commissions/?is_open_to_projects=true')).data
        commission.value = openCommissions[0]
    }

    async function getAllCommissions() {
        commissions.value = (await axiosPublic.get<Commission[]>('/commissions/')).data
    }

    async function getCommissionFunds() {
        if (!commissionFunds.value.length) {
            commissionFunds.value = (await axiosPublic.get<CommissionFund[]>('/commissions/funds')).data
        }
    }

    async function postNewCommission(commission: NewCommission) {
        const newCommission: Commission = (await axiosAuthenticated.post('/commissions/', {
            commissionDate: commission.commissionDate,
            submissionDate: commission.submissionDate,
            isOpenToProjects: commission.isOpenToProjects,
            name: commission.name
        })).data
        for (const fund of commission.funds) {
            await axiosAuthenticated.post('/commissions/funds', {
                commission: newCommission.id,
                fund
            })
        }
    }

    async function updateCommission(commission: UpdateCommission) {
        let dataToPatch = {}
        if (commission.newName !== commission.oldName)
            dataToPatch = Object.assign(dataToPatch, {name: commission.newName})
        if (commission.newCommissionDate !== commission.oldCommissionDate)
            dataToPatch = Object.assign(dataToPatch, {commissionDate: commission.newCommissionDate})
        if (commission.newSubmissionDate !== commission.oldSubmissionDate)
            dataToPatch = Object.assign(dataToPatch, {submissionDate: commission.newSubmissionDate})
        if (commission.newIsOpenToProjects !== commission.oldIsOpenToProjects)
            dataToPatch = Object.assign(dataToPatch, {isOpenToProjects: commission.newIsOpenToProjects})
        if (Object.entries(dataToPatch).length) {
            await axiosAuthenticated.patch(`/commissions/${commission.id}`, dataToPatch)
        }
        if (!arraysAreEqual(commission.oldFunds, commission.newFunds)) {
            const newFundsToPost = commission.newFunds.filter(x => commission.oldFunds.indexOf(x) === -1)
            const oldFundsToDelete = commission.oldFunds.filter(x => commission.newFunds.indexOf(x) === -1)

            for (let i = 0; i < newFundsToPost.length; i++) {
                await axiosAuthenticated.post('/commissions/funds', {
                    commission: commission.id,
                    fund: newFundsToPost[i]
                })
            }
            for (let i = 0; i < oldFundsToDelete.length; i++) {
                await axiosAuthenticated.delete(`/commissions/${commission.id}/funds/${oldFundsToDelete[i]}`)
            }
        }
    }

    async function deleteCommission(id: number) {
        await axiosAuthenticated.delete(`/commissions/${id}`)
    }

    // TODO test
    async function getCommissionExport(id: number, mode: 'csv' | 'pdf', projects: number[]) {
        const url = `/commissions/${id}/export?mode=${mode}&project_ids=${projects.join(',')}`
        return (await axiosAuthenticated.get<Blob>(url, {responseType: 'blob'})).data
    }

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
        getCommissionFunds,
        initCommissionLabels,
        initChosenCommissionFundsLabels,
        getAllCommissions,
        getCommission,
        commission,
        getNextCommission,
        getCommissionExport,
        getFundLabel
    }
}
