<script lang="ts" setup>
import {ref, toRefs, watch} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import useUtility from '@/composables/useUtility'
import type {ProjectCommissionFund} from '#/project'
import useManageProjects from '@/composables/useManageProjects'
import InfoFormRequiredFields from '@/components/infoPanel/InfoFormRequiredFields.vue'
import useProjectComments from '@/composables/useProjectComments'
import useCommissions from '@/composables/useCommissions'

const {notify, loading} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()
const {canManageProjectCommissionFund, patchAmountAsked} = useManageProjects()
const {postNewProjectComment} = useProjectComments()
const {CURRENCY} = useUtility()
const {getFundLabel} = useCommissions()


const emit = defineEmits(['closeDialog', 'refreshProjects'])

const props = defineProps<{
    openDialog: boolean,
    project: number,
    projectName: string,
    projectCommissionFunds: ProjectCommissionFund[]
}>()

const openRef = toRefs(props).openDialog

const open = ref<boolean>(false)

watch(() => openRef.value, () => {
    open.value = openRef.value
})

watch(() => open.value, () => {
    if (!open.value) {
        editProjectCommissionFunds.value = []
        emit('closeDialog')
    }
})

watch(() => open.value, () => {
    loading.show()
    initValues()
    loading.hide()
})

interface EditProjectCommissionFund {
    commissionFundId: number,
    fundLabel: string,
    amountAsked: number | string,
    amountAskedPreviousEdition: number | string,
    amountEarned: number | string | null,
    amountEarnedPreviousEdition: number | string,
    isFirstEdition: boolean,
    comment: {
        text: string,
        isVisible: boolean
    },
    needComment: boolean,
    amountEarnedIsValidatedByAdmin: boolean
}

const editProjectCommissionFunds = ref<EditProjectCommissionFund[]>([])

const initValues = () => {
    editProjectCommissionFunds.value = []
    props.projectCommissionFunds.forEach(projectCommissionFund => {
        if (projectCommissionFund.isValidatedByAdmin
            && canManageProjectCommissionFund(projectCommissionFund.commissionFund)) {
            editProjectCommissionFunds.value.push({
                commissionFundId: projectCommissionFund.commissionFund,
                fundLabel: getFundLabel(projectCommissionFund.commissionFund) ?? '',
                amountAsked: projectCommissionFund.amountAsked?.toString() ?? '0',
                amountAskedPreviousEdition: projectCommissionFund.amountAskedPreviousEdition?.toString() ?? '0',
                amountEarned: projectCommissionFund.amountEarned ?
                    projectCommissionFund.amountEarned.toString() : null,
                amountEarnedPreviousEdition: projectCommissionFund.amountEarnedPreviousEdition?.toString() ?? '0',
                isFirstEdition: projectCommissionFund.isFirstEdition as boolean,
                comment: {
                    text: '',
                    isVisible: false
                },
                needComment: false,
                amountEarnedIsValidatedByAdmin: !!projectCommissionFund.amountEarned
            })
        }
    })
}

async function onPatchProjectCommissionFunds(projectCommissionFund: EditProjectCommissionFund) {
    loading.show()
    try {
        if (!projectCommissionFund.amountEarnedIsValidatedByAdmin) {
            await postNewProjectComment(props.project, projectCommissionFund.comment)
            await patchAmountAsked(props.project, projectCommissionFund.commissionFundId,
                parseInt(projectCommissionFund.amountEarned as string))
        }
        emit('closeDialog')
        emit('refreshProjects')
        notify({
            type: 'positive',
            message: t('notifications.positive.project-amount-asked-updated')
        })
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
</script>

<template>
    <QDialog v-model="open">
        <QCard class="variant-space-3">
            <QCardSection>
                <h2>{{ props.projectName }}</h2>
                <QList
                    bordered
                    class="rounded-borders"
                >
                    <QExpansionItem
                        v-for="(projectCommissionFund, index) in editProjectCommissionFunds"
                        :key="index"
                        :caption="projectCommissionFund.amountEarnedIsValidatedByAdmin ?
                            t('project.amount-earned-validated') : t('project.amount-earned-pending')"
                        :header-class="`text-custom-${projectCommissionFund.amountEarnedIsValidatedByAdmin ?
                            'green' : 'red'}`"
                        :label="projectCommissionFund.fundLabel"
                        expand-separator
                        icon="bi-bank"
                    >
                        <QForm
                            class="flex-column"
                            @submit="onPatchProjectCommissionFunds(projectCommissionFund)"
                        >
                            <QCard flat>
                                <QCardSection class="flex-column">
                                    <InfoFormRequiredFields/>
                                    <h4>{{ t('project.amount-asked') }}</h4>
                                    <QInput
                                        v-if="!projectCommissionFund.isFirstEdition"
                                        v-model="projectCommissionFund.amountAskedPreviousEdition"
                                        :label="`${t('project.previous-asked')} (${projectCommissionFund.fundLabel})`"
                                        color="commission"
                                        filled
                                        readonly
                                        type="number"
                                    />
                                    <QInput
                                        v-model="projectCommissionFund.amountAsked"
                                        :label="`${t('project.amount-asked')} (${projectCommissionFund.fundLabel})`"
                                        color="commission"
                                        filled
                                        readonly
                                        type="number"
                                    />
                                    <h4>{{ t('project.amount-earned') }}</h4>
                                    <QInput
                                        v-if="!projectCommissionFund.isFirstEdition"
                                        v-model="projectCommissionFund.amountEarnedPreviousEdition"
                                        :label="`${t('project.previous-earned')} (${projectCommissionFund.fundLabel})`"
                                        color="commission"
                                        filled
                                        readonly
                                        type="number"
                                    />
                                    <QInput
                                        v-model="projectCommissionFund.amountEarned"
                                        :aria-required="!projectCommissionFund.amountEarnedIsValidatedByAdmin"
                                        :label="`${t('project.amount-earned')} (${projectCommissionFund.fundLabel})` +
                                            (!projectCommissionFund.amountEarnedIsValidatedByAdmin ? ' *' : '')"
                                        :readonly="projectCommissionFund.amountEarnedIsValidatedByAdmin"
                                        :rules="[val => val && val.length > 0
                                            || t('forms.required-field', {
                                                label: `${t('project.amount-earned')} (${projectCommissionFund.fundLabel
                                                })`
                                            })]"
                                        :shadow-text="` ${CURRENCY}`"
                                        clearable
                                        color="commission"
                                        filled
                                        lazy-rules
                                        min="0"
                                        type="number"
                                        @update:model-value="projectCommissionFund.amountEarned === '0' ?
                                            projectCommissionFund.needComment = true : projectCommissionFund.needComment = false"
                                    />
                                    <QInput
                                        v-model="projectCommissionFund.comment.text"
                                        :aria-required="projectCommissionFund.needComment"
                                        :hint="!projectCommissionFund.amountEarnedIsValidatedByAdmin
                                            && projectCommissionFund.needComment ?
                                                t('project.no-amount-earned-comment-hint') : ''"
                                        :label="`${t('project.new-comment')} (${projectCommissionFund.fundLabel})
                                                ${projectCommissionFund.needComment ? ' *' : ''}`"
                                        :readonly="projectCommissionFund.amountEarnedIsValidatedByAdmin"
                                        :rules="[val => (!projectCommissionFund.needComment || val && val.length > 0) || t('forms.required-field', {
                                            label: `${t('project.new-comment')} (${projectCommissionFund.fundLabel})`
                                        })]"
                                        clearable
                                        color="commission"
                                        filled
                                        reactive-rules
                                        type="textarea"
                                    />
                                    <QToggle
                                        v-model="projectCommissionFund.comment.isVisible"
                                        :disable="!projectCommissionFund.comment.text"
                                        :label="t('forms.comment-visibility')"
                                        color="commission"
                                    />
                                </QCardSection>
                            </QCard>
                            <div class="flex-row-center padding-bottom">
                                <QBtn
                                    v-close-popup
                                    :label="t('cancel')"
                                    class="btn-lg"
                                    color="commission"
                                    icon="bi-box-arrow-left"
                                    @click="emit('closeDialog')"
                                />
                                <QBtn
                                    :disable="!projectCommissionFund.amountEarned"
                                    :label="t('validate')"
                                    class="btn-lg"
                                    color="commission"
                                    icon="bi-check-lg"
                                    type="submit"
                                />
                            </div>
                        </QForm>
                    </QExpansionItem>
                </QList>
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';
@import '@/assets/_variables.scss';

.q-card {
    padding: 1rem;
}

.flex-row > * {
    width: $fullSize;
}
</style>
