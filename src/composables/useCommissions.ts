import {ref, watch} from 'vue'
import type {Commission, SelectCommissionDateLabel} from '#/commissions'
import {useAxios} from '@/composables/useAxios'
import type {SelectLabel} from '#/index'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import type {CommissionDate} from '#/project'

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

    const {axiosPublic} = useAxios()
    const userManagerStore = useUserManagerStore()

    // GET COMMISSION INFOS
    async function getCommissions() {
        if (commissions.value.length === 0) {
            commissions.value = (await axiosPublic.get<Commission[]>('/commissions/')).data
        }
    }

    async function getCommissionDates() {
        commissionDates.value = (await axiosPublic.get<CommissionDate[]>('/commissions/commission_dates')).data
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

    const initCommissionDates = async (isSite: boolean | undefined) => {
        await getCommissions()
        commissionDatesLabels.value = []
        commissionDates.value.forEach((commissionDate) => {
            const commission = commissions.value.find(obj => obj.id === commissionDate.commission)
            if (commission && commission.isSite === isSite) {
                commissionDatesLabels.value.push({
                    value: commissionDate.id,
                    label: `${commission.acronym} (${commissionDate.commissionDate.split('-').reverse().join('/')})`,
                    commission: commission.id as number,
                    disable: false
                })
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
        initCommissionDates
    }
}
