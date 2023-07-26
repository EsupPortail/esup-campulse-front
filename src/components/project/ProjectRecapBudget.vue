<script lang="ts" setup>
import useSubmitProject from '@/composables/useSubmitProject'
import useUtility from '@/composables/useUtility'
import {useProjectStore} from '@/stores/useProjectStore'
import useCommissions from '@/composables/useCommissions'
import axios from 'axios'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {onMounted, watch} from 'vue'

const {t} = useI18n()
const {projectBudget} = useSubmitProject()
const {CURRENCY} = useUtility()
const projectStore = useProjectStore()
const {
    getCommissionFunds,
    getFunds,
    initChosenCommissionFundsLabels,
    getAllCommissions,
    initCommissionLabels,
    getFundLabel
} = useCommissions()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()

const props = defineProps<{
    loadData: boolean
}>()

onMounted(() => {
    if (projectStore.project && props.loadData) onGetProjectCommissions()
})

watch(() => projectStore.project, async () => {
    if (props.loadData) {
        loading.show()
        await onGetProjectCommissions()
        loading.hide()
    }
})

async function onGetProjectCommissions() {
    try {
        await getAllCommissions()
        await getCommissionFunds()
        await projectStore.getProjectCommissionFunds(false, undefined)
        await getFunds()
        initCommissionLabels()
        initChosenCommissionFundsLabels(projectStore.projectCommission as number, true)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

const projectIsFirstEdition = () => {
    let perm = true
    if (projectStore.projectCommissionFunds.find(obj => obj.isFirstEdition === false)) perm = false
    return perm
}
</script>

<template>
    <div class="flex-column">
        <div class="display-row">
            <h4>{{ t('project.re-edition') }}</h4>
            <p>
                {{
                    !projectIsFirstEdition ? t('yes') : t('no')
                }}
            </p>
        </div>

        <div
            v-if="!projectIsFirstEdition"
            class="display-row"
        >
            <h4>{{ t('project.budget-previous-edition') }}</h4>
            <p>{{ projectBudget.budgetPreviousEdition + CURRENCY }}</p>
        </div>

        <div class="display-row">
            <h4>{{ t('project.target-audience') }}</h4>
            <p>{{ projectBudget.targetAudience }}</p>
        </div>

        <div class="display-row">
            <h4>{{ t('project.target-students-amount') }}</h4>
            <p>{{ projectBudget.amountStudentsAudience }}</p>
        </div>

        <div class="display-row">
            <h4>{{ t('project.target-all-amount') }}</h4>
            <p>{{ projectBudget.amountAllAudience }}</p>
        </div>

        <div class="display-row">
            <h4>{{ t('project.ticket-price') }}</h4>
            <p>{{ projectBudget.ticketPrice + CURRENCY }}</p>
        </div>

        <div class="display-row">
            <h4>{{ t('project.individual-cost') }}</h4>
            <p>{{ projectBudget.individualCost + CURRENCY }}</p>
        </div>

        <div
            v-for="projectCommissionFund in projectStore.projectCommissionFunds"
            :key="projectCommissionFund.id"
            class="flex-column padding-top"
        >
            <h3>{{ getFundLabel(projectCommissionFund.commissionFund) }}</h3>

            <div
                v-if="!projectIsFirstEdition"
                class="flex-row"
            >
                <div class="display-row">
                    <h4>{{ t('project.previous-asked') }}</h4>
                    <p>{{ projectCommissionFund.amountAskedPreviousEdition + CURRENCY }}</p>
                </div>

                <div class="display-row">
                    <h4>{{ t('project.previous-earned') }}</h4>
                    <p>{{ projectCommissionFund.amountEarnedPreviousEdition + CURRENCY }}</p>
                </div>
            </div>

            <div class="flex-row">
                <div class="display-row">
                    <h4>{{ t('project.amount-asked') }}</h4>
                    <p>{{ projectCommissionFund.amountAsked + CURRENCY }}</p>
                </div>

                <div
                    v-if="projectCommissionFund.amountEarned"
                    class="display-row"
                >
                    <h4>{{ t('project.amount-earned') }}</h4>
                    <p>{{ projectCommissionFund.amountEarned + CURRENCY }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

.flex-row > * {
  width: $fullSize;
}
</style>
