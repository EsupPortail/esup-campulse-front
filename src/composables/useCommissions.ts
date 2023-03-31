import {ref, watch} from 'vue'
import type {Commission} from '#/commissions'
import {useAxios} from '@/composables/useAxios'
import type {SelectLabel} from '#/index'
import {useUserManagerStore} from '@/stores/useUserManagerStore'


const commissions = ref<Commission[]>([])

const commissionOptions = ref<SelectLabel[]>([])

const userCommissions = ref<number[]>([])

export default function () {

    const {axiosPublic} = useAxios()
    const userManagerStore = useUserManagerStore()

    async function getCommissions() {
        if (commissions.value.length === 0) {
            commissions.value = (await axiosPublic.get<Commission[]>('/commissions/')).data
        }
    }

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

    return {
        getCommissions,
        commissions,
        commissionOptions,
        userCommissions,
        initUserCommissions
    }
}
