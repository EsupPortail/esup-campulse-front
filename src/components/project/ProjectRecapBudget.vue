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
const {fundsLabels} = useCommissions()


const projectStore = useProjectStore()
const {
    getCommissionFunds,
    getFunds,
    initChosenCommissionFundsLabels,
    getAllCommissions,
    initCommissionLabels
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
</script>

<template>
    <section class="flex-section">
        <div class="display-row">
            <p class="row-title">{{ t('project.re-edition') }}</p>
            <p>
                {{
                    projectStore.projectCommissionFunds.find(obj => obj.isFirstEdition === false) ? t('yes') : t('no')
                }}
            </p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.target-audience') }}</p>
            <p>{{ projectBudget.targetAudience }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.target-students-amount') }}</p>
            <p>{{ projectBudget.amountStudentsAudience }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.target-all-amount') }}</p>
            <p>{{ projectBudget.amountAllAudience }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.ticket-price') }}</p>
            <p>{{ projectBudget.ticketPrice + CURRENCY }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.individual-cost') }}</p>
            <p>{{ projectBudget.individualCost + CURRENCY }}</p>
        </div>

        <div
            v-for="commissionFund in projectStore.projectCommissionFunds"
            :key="commissionFund.id"
            class="display-row"
        >
            <p class="row-title">
                {{
                    `${t('project.amount-asked')}
                                    (${fundsLabels.find(obj => obj.value === commissionFund.commissionFund)?.label})`
                }}
            </p>
            <p>{{ commissionFund.amountAsked + CURRENCY }}</p>
        </div>

        <section
            v-if="projectStore.projectCommissionFunds.find(obj => obj.isFirstEdition === false)"
            class="flex-section"
        >
            <h5 class="title-4">{{ t('project.previous-edition') }}</h5>

            <div
                v-for="commissionFund in projectStore.projectCommissionFunds"
                :key="commissionFund.id"
                class="display-row"
            >
                <p class="row-title">
                    {{
                        `${t('project.previous-asked')}
                                        (${fundsLabels.find(obj => obj.value === commissionFund.commissionFund)?.label})`
                    }}
                </p>
                <p>{{ commissionFund.amountAskedPreviousEdition + CURRENCY }}</p>
            </div>

            <div
                v-for="commissionFund in projectStore.projectCommissionFunds"
                :key="commissionFund.id"
                class="display-row"
            >
                <p class="row-title">
                    {{
                        `${t('project.previous-earned')}
                                        (${fundsLabels.find(obj => obj.value === commissionFund.commissionFund)?.label})`
                    }}
                </p>
                <p>{{ commissionFund.amountEarnedPreviousEdition + CURRENCY }}</p>
            </div>

            <div class="display-row">
                <p class="row-title">{{ t('project.budget-previous-edition') }}</p>
                <p>{{ projectBudget.budgetPreviousEdition + CURRENCY }}</p>
            </div>
        </section>
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