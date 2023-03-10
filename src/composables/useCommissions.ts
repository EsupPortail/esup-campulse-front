import {ref, watch} from 'vue'
import type {Commission} from '#/commissions'
import {useAxios} from '@/composables/useAxios'


const commissions = ref<Commission[]>([])

const commissionOptions = ref<string[]>([])

const userCommissions = ref<string[]>([])

export default function () {

    const {axiosPublic} = useAxios()

    async function getCommissions() {
        if (commissions.value.length === 0) {
            commissions.value = (await axiosPublic.get<Commission[]>('/commissions/')).data
        }
    }

    const initCommissionLabels = () => {
        commissionOptions.value = []
        commissions.value.forEach(function (commission) {
            commissionOptions.value.push(commission.acronym)
        })
    }
    watch(() => commissions.value, initCommissionLabels)

    return {
        getCommissions,
        commissions,
        commissionOptions,
        userCommissions
    }
}
