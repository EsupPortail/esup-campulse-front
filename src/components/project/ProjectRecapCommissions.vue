<script lang="ts" setup>
import {useProjectStore} from '@/stores/useProjectStore'
import useCommissions from '@/composables/useCommissions'
import axios from 'axios'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {onMounted, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
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
const route = useRoute()
const {CURRENCY} = useUtility()

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
    <section
        v-if="route.name !== 'SubmitProjectReview'"
        class="flex-section"
    >
        <div class="display-row">
            <p class="row-title">{{ t('commission.name') }}</p>
            <p>{{ projectCommissionLabel }}</p>
        </div>
        <div
            class="display-row"
        >
            <p class="row-title">{{ t('commission.funds') }}</p>
            <p>
                <QChip
                    v-for="projectCommissionFund in projectStore.projectCommissionFunds"
                    :key="projectCommissionFund.id"
                >
                    {{
                        fundsLabels.find(x => x.value === projectCommissionFund.commissionFund)?.label
                    }}
                </QChip>
            </p>
        </div>
    </section>
    <div v-else>
        <QInput
            v-model="projectCommissionLabel"
            :label="t('project.commission')"
            filled
            readonly
        />
        <div
            v-for="projectCommissionFund in projectStore.projectCommissionFunds"
            :key="projectCommissionFund.id"
            class="flex-section"
        >
            <h4 class="title-5">
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