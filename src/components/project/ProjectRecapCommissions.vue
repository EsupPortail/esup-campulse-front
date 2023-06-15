<script lang="ts" setup>
import {useProjectStore} from '@/stores/useProjectStore'
import useCommissions from '@/composables/useCommissions'
import axios from 'axios'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {onMounted, ref, watch} from 'vue'

const projectStore = useProjectStore()
const {
    fundsLabels,
    getCommissionFunds,
    getFunds,
    initChosenCommissionFundsLabels,
    getAllCommissions,
    initCommissionLabels,
    commissionLabels
} = useCommissions()
const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()

const projectCommissionLabel = ref<string | undefined>(undefined)

const initProjectCommissionLabel = () => {
    projectCommissionLabel.value = commissionLabels.value
        .find(x => x.value === projectStore.projectCommission)?.label
}

onMounted(() => {
    if (projectStore.project) onGetProjectCommissions()
})

watch(() => projectStore.project, async () => {
    loading.show()
    await onGetProjectCommissions()
    loading.hide()
})

async function onGetProjectCommissions() {
    try {
        await getAllCommissions()
        await getCommissionFunds()
        await projectStore.getProjectCommissionFunds(false, undefined)
        await getFunds()
        initCommissionLabels()
        initChosenCommissionFundsLabels(projectStore.projectCommission as number, true)
        initProjectCommissionLabel()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}
</script>

<template>
    <section class="flex-section">
        <div class="display-row">
            <p class="row-title">{{ t('commission.name') }}</p>
            <p>{{ projectCommissionLabel }}</p>
        </div>
        <div class="display-row">
            <p class="row-title">{{ t('commission.funds') }}</p>
            <p>
                <QChip
                    v-for="commissionFund in projectStore.projectCommissionFunds"
                    :key="commissionFund.id"
                >
                    {{
                        fundsLabels.find(x => x.value === commissionFund.commissionFund)?.label
                    }}
                </QChip>
            </p>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

.display-row {
    width: 100% !important;
}

.flex-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
}
</style>