<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import useSubmitProject from '@/composables/useSubmitProject'
import useUtility from '@/composables/useUtility'
import useCommissions from '@/composables/useCommissions'
import useErrors from '@/composables/useErrors'
import {useQuasar} from 'quasar'
import {useProjectStore} from '@/stores/useProjectStore'
import {onMounted, ref, watch} from 'vue'
import axios from 'axios'

const {t} = useI18n()
const {
    projectBudget,
    patchProjectBudget,
    patchProjectCommissionFunds,
    projectCommissionFundsDetail,
    initProjectBudget,
} = useSubmitProject()
const {CURRENCY} = useUtility()
const {
    funds,
    commissionFunds,
} = useCommissions()
const {catchHTTPError} = useErrors()
const {loading, notify} = useQuasar()
const projectStore = useProjectStore()

const props = defineProps<{
    projectReEdition: boolean
}>()

const emit = defineEmits(['updateReEditionStatus', 'updateStep'])

onMounted(async () => {
    loading.show()
    await onGetProjectBudget()
    loading.hide()
})

const projectReEditionRef = ref<boolean>(props.projectReEdition)

// GET DATA
async function onGetProjectBudget() {
    loading.show()
    try {
        await projectStore.getProjectCommissionFunds(false, undefined)
        initProjectBudget()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
    loading.hide()
}

// SUBMIT
async function onSubmitBudget(nextStep: number) {
    loading.show()
    if (projectStore.project) {
        try {
            await patchProjectBudget(!projectReEditionRef.value)
            await patchProjectCommissionFunds(!projectReEditionRef.value)
            emit('updateReEditionStatus', projectReEditionRef.value)
            emit('updateStep', nextStep)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: catchHTTPError(error.response)
                })
            }
        }
    }
    loading.hide()
}

// CHECKING IF PROJECT AUDIENCE AMOUNT NUMBERS ARE POSSIBLE
const correctAudienceAmount = ref<boolean>(false)
watch(() => projectBudget.value.amountStudentsAudience, () => {
    correctAudienceAmount.value = parseInt(projectBudget.value.amountStudentsAudience as string) <= parseInt(projectBudget.value.amountAllAudience as string)
})
watch(() => projectBudget.value.amountAllAudience, () => {
    correctAudienceAmount.value = parseInt(projectBudget.value.amountStudentsAudience as string) <= parseInt(projectBudget.value.amountAllAudience as string)
})
</script>

<template>
    <QForm
        class="flex-column"
        @submit="onSubmitBudget(4)"
    >
        <QCheckbox
            v-model="projectReEditionRef"
            :label="t('project.re-edition')"
            color="commission"
            data-test="first-edition-checkbox"
        />

        <!-- Previous amounts -->
        <div v-if="projectReEdition">
            <div class="flex-column">
                <h3>{{ t('project.previous-asked') }}</h3>
                <QInput
                    v-for="commissionFund in projectCommissionFundsDetail"
                    :key="commissionFund.id"
                    v-model="commissionFund.amountAskedPreviousEdition"
                    :data-test="funds.find(obj => obj.id === (commissionFunds
                        .find(obj => obj.id === commissionFund.commissionFund)?.fund))?.acronym + '-amount-asked-previous-edition-input'"
                    :label="funds.find(obj => obj.id === (commissionFunds
                        .find(obj => obj.id === commissionFund.commissionFund)?.fund))?.acronym + ' *'"
                    :rules="projectReEdition ? [val => val && val.length > 0 || t('forms.required-project-amount-asked-previous')] : []"
                    :shadow-text="` ${CURRENCY}`"
                    color="commission"
                    filled
                    inputmode="numeric"
                    min="0"
                    type="number"
                />
            </div>

            <div class="flex-column">
                <h3>{{ t('project.previous-earned') }}</h3>
                <QInput
                    v-for="commissionFund in projectCommissionFundsDetail"
                    :key="commissionFund.id"
                    v-model="commissionFund.amountEarnedPreviousEdition"
                    :data-test="funds.find(obj => obj.id === (commissionFunds
                        .find(obj => obj.id === commissionFund.commissionFund)?.fund))?.acronym + '-amount-earned-previous-edition-input'"
                    :label="funds.find(obj => obj.id === (commissionFunds
                        .find(obj => obj.id === commissionFund.commissionFund)?.fund))?.acronym + ' *'"
                    :rules="projectReEdition ? [val => val && val.length > 0 || t('forms.required-project-amount-earned-previous')] : []"
                    :shadow-text="` ${CURRENCY}`"
                    color="commission"
                    filled
                    inputmode="numeric"
                    min="0"
                    type="number"
                />
            </div>

            <QInput
                v-model="projectBudget.budgetPreviousEdition"
                :label="t('project.budget-previous-edition') + ' *'"
                :rules="[val => val && val.length > 0 || t('forms.required-project-budget-previous')]"
                :shadow-text="` ${CURRENCY}`"
                aria-required="true"
                color="commission"
                data-test="budget-previous-edition-input"
                filled
                inputmode="numeric"
                lazy-rules
                min="0"
                type="number"
            />

            <QSeparator
                aria-hidden="true"
                class="margin-bottom"
            />
        </div>

        <QInput
            v-model="projectBudget.targetAudience"
            :label="t('project.target-audience') + ' *'"
            :rules="[val => val && val.length > 0 || t('forms.required-project-audience')]"
            aria-required="true"
            color="commission"
            data-test="target-audience-textarea"
            filled
            reactive-rules
            type="textarea"
        />

        <QInput
            v-model="projectBudget.amountStudentsAudience"
            :label="t('project.target-students-amount') + ' *'"
            :rules="[val => val && val.length > 0 || t('forms.required-project-amount-students-audience'), val => val && correctAudienceAmount || t('forms.correct-amount-audience')]"
            aria-required="true"
            color="commission"
            data-test="amount-students-audience-input"
            filled
            inputmode="numeric"
            min="0"
            reactive-rules
            type="number"
        />

        <QInput
            v-model="projectBudget.amountAllAudience"
            :label="t('project.target-all-amount') + ' *'"
            :rules="[val => val && val.length > 1 || t('forms.required-project-amount-audience'), val => val && correctAudienceAmount || t('forms.correct-amount-audience')]"
            aria-required="true"
            color="commission"
            data-test="amount-all-audience-input"
            filled
            inputmode="numeric"
            lazy-rules
            min="1"
            type="number"
        />

        <QInput
            v-model="projectBudget.ticketPrice"
            :label="t('project.ticket-price') + ' *'"
            :rules="[val => val && val.length > 0 || t('forms.required-project-ticket')]"
            :shadow-text="` ${CURRENCY}`"
            aria-required="true"
            color="commission"
            data-test="ticket-price-input"
            filled
            inputmode="numeric"
            lazy-rules
            min="0"
            type="number"
        />

        <QInput
            v-model="projectBudget.studentTicketPrice"
            :label="t('project.student-ticket-price') + ' *'"
            :rules="[val => val && val.length > 0 || t('forms.required-project-ticket')]"
            :shadow-text="` ${CURRENCY}`"
            aria-required="true"
            color="commission"
            data-test="student-ticket-price-input"
            filled
            inputmode="numeric"
            lazy-rules
            min="0"
            type="number"
        />

        <QInput
            v-model="projectBudget.individualCost"
            :label="t('project.individual-cost') + ' *'"
            :rules="[val => val && val.length > 1 || t('forms.required-project-individual-cost'),
                     val => val !== '0' || t('forms.required-project-individual-cost-not-null')]"
            :shadow-text="` ${CURRENCY}`"
            aria-required="true"
            color="commission"
            data-test="individual-cost-input"
            filled
            inputmode="numeric"
            lazy-rules
            min="1"
            type="number"
        />

        <QSeparator
            aria-hidden="true"
            class="margin-bottom"
        />

        <section class="flex-column">
            <h4>{{ t('project.amounts-asked') }}</h4>
            <QInput
                v-for="commissionFund in projectCommissionFundsDetail"
                :key="commissionFund.id"
                v-model="commissionFund.amountAsked"
                :data-test="funds.find(obj => obj.id === (commissionFunds
                    .find(obj => obj.id === commissionFund.commissionFund)?.fund))?.acronym + '-amount-asked-input'"
                :label="funds.find(obj => obj.id === (commissionFunds
                    .find(obj => obj.id === commissionFund.commissionFund)?.fund))?.acronym + ' *'"
                :rules="[val => val && val.length > 0 || t('forms.required-project-budget')]"
                :shadow-text="` ${CURRENCY}`"
                color="commission"
                filled
                inputmode="numeric"
                min="0"
                type="number"
            />
        </section>

        <div class="flex-row-center padding-top padding-bottom">
            <QBtn
                :label="t('back')"
                class="btn-lg"
                color="commission"
                data-test="back-button"
                icon="bi-chevron-left"
                @click="onSubmitBudget(2)"
            />
            <QBtn
                :label="t('continue')"
                class="btn-lg"
                color="commission"
                data-test="continue-button"
                icon="bi-check2"
                type="submit"
            />
        </div>
    </QForm>
</template>