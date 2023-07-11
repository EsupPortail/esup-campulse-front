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
    <section class="flex-column">
        <div class="display-row">
            <h4>{{ t('project.re-edition') }}</h4>
            <p>
                {{
                    projectStore.projectCommissionFunds.find(obj => obj.isFirstEdition === false) ? t('yes') : t('no')
                }}
            </p>
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
            v-for="commissionFund in projectStore.projectCommissionFunds"
            :key="commissionFund.id"
            class="display-row"
        >
            <h4>
                {{
                    `${t('project.amount-asked')}
                                    (${fundsLabels.find(obj => obj.value === commissionFund.commissionFund)?.label})`
                }}
            </h4>
            <p>{{ commissionFund.amountAsked + CURRENCY }}</p>
        </div>

        <div
            v-if="projectStore.projectCommissionFunds.find(obj => obj.isFirstEdition === false)"
            class="flex-column padding-top"
        >
            <h3>{{ t('project.previous-edition') }}</h3>

            <div
                v-for="commissionFund in projectStore.projectCommissionFunds"
                :key="commissionFund.id"
                class="display-row"
            >
                <h4>
                    {{
                        `${t('project.previous-asked')}
                                        (${fundsLabels.find(obj => obj.value === commissionFund.commissionFund)?.label})`
                    }}
                </h4>
                <p>{{ commissionFund.amountAskedPreviousEdition + CURRENCY }}</p>
            </div>

            <div
                v-for="commissionFund in projectStore.projectCommissionFunds"
                :key="commissionFund.id"
                class="display-row"
            >
                <h4>
                    {{
                        `${t('project.previous-earned')}
                                        (${fundsLabels.find(obj => obj.value === commissionFund.commissionFund)?.label})`
                    }}
                </h4>
                <p>{{ commissionFund.amountEarnedPreviousEdition + CURRENCY }}</p>
            </div>

            <div class="display-row">
                <h4>{{ t('project.budget-previous-edition') }}</h4>
                <p>{{ projectBudget.budgetPreviousEdition + CURRENCY }}</p>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
</style>