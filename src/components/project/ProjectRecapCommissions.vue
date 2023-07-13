<script lang="ts" setup>
import {useProjectStore} from '@/stores/useProjectStore'
import useCommissions from '@/composables/useCommissions'
import axios from 'axios'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {onMounted, ref, watch} from 'vue'
import useUtility from '@/composables/useUtility'

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
const {CURRENCY} = useUtility()

const props = defineProps<{
    view: 'projectRecap' | 'submitProjectReview' | 'projectReviewRecap'
}>()

const projectCommissionLabel = ref<string | undefined>(undefined)

const initProjectCommissionLabel = () => {
    projectCommissionLabel.value = commissionLabels.value
        .find(x => x.value === projectStore.projectCommission)?.label
}

onMounted(async () => {
    await onGetProjectCommissions()
})

watch(() => projectStore.project, async () => {
    await onGetProjectCommissions()
})

async function onGetProjectCommissions() {
    if (projectStore.project) {
        loading.show()
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
        loading.hide()
    }
}
</script>

<template>
    <div
        v-if="props.view === 'projectRecap' || props.view === 'projectReviewRecap'"
        class="flex-column"
    >
        <div class="display-row">
            <h4>{{ t('project.commission-choice') }}</h4>
            <p>{{ projectCommissionLabel }}</p>
        </div>

        <div class="display-row">
            <h4>{{ t('commission.funds') }}</h4>
            <p>
                <QChip
                    v-for="projectCommissionFund in projectStore.projectCommissionFunds"
                    :key="projectCommissionFund.id"
                    color="commission"
                    outline
                >
                    {{ fundsLabels.find(x => x.value === projectCommissionFund.commissionFund)?.label }}
                </QChip>
            </p>
        </div>

        <div v-if="props.view === 'projectReviewRecap'">
            <div
                v-for="projectCommissionFund in projectStore.projectCommissionFunds"
                :key="projectCommissionFund.id"
                class="flex-column"
            >
                <div class="display-row">
                    <h4>
                        {{
                            t('project.amount-asked') + ' (' + fundsLabels.find(x => x.value === projectCommissionFund.commissionFund)?.label + ')'
                        }}
                    </h4>
                    <p>{{ projectCommissionFund.amountAsked + CURRENCY }}</p>
                </div>

                <div class="display-row">
                    <h4>
                        {{
                            t('project.amount-earned') + ' (' + fundsLabels.find(x => x.value === projectCommissionFund.commissionFund)?.label + ')'
                        }}
                    </h4>
                    <p>{{ projectCommissionFund.amountEarned + CURRENCY }}</p>
                </div>
            </div>
        </div>
    </div>

    <div
        v-if="props.view === 'submitProjectReview'"
        class="flex-column"
    >
        <QInput
            v-model="projectCommissionLabel"
            :label="t('project.commission-choice')"
            filled
            readonly
        />
        <div
            v-for="projectCommissionFund in projectStore.projectCommissionFunds"
            :key="projectCommissionFund.id"
            class="flex-column"
        >
            <h4>
                {{
                    fundsLabels.find(x => x.value === projectCommissionFund.commissionFund)?.label
                }}
            </h4>
            <QInput
                v-model="projectCommissionFund.amountAsked"
                :label="t('project.amount-asked') + ' (' + fundsLabels.find(x => x.value === projectCommissionFund.commissionFund)?.label + ')'"
                :shadow-text="` ${CURRENCY}`"
                filled
                readonly
            />
            <QInput
                v-model="projectCommissionFund.amountEarned"
                :label="t('project.amount-earned') + ' (' + fundsLabels.find(x => x.value === projectCommissionFund.commissionFund)?.label + ')'"
                :shadow-text="` ${CURRENCY}`"
                filled
                readonly
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
</style>
