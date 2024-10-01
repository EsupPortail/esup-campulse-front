<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {onMounted, ref} from 'vue'
import {QForm, useQuasar} from 'quasar'
import useCommissions from '@/composables/useCommissions'
import useUtility from '@/composables/useUtility'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import AlertConfirmCommissionDateUpdateOrDelete from '@/components/alert/AlertConfirmCommissionDateUpdateOrDelete.vue'
import type {NewCommission, UpdateCommission} from '#/commissions'

const {t} = useI18n()
const {loading, notify} = useQuasar()
const {fromDateIsAnterior, arraysAreEqual} = useUtility()
const {
    getFunds,
    getCommissionsForManagers,
    getCommissionFunds,
    commissions,
    commissionFunds,
    updateCommission,
    deleteCommission,
    initFundsLabels,
    fundsLabels,
    postNewCommission
} = useCommissions()
const {catchHTTPError} = useErrors()


const updateCommissions = ref<UpdateCommission[]>([])


const newCommission = ref<NewCommission>({
    commissionDate: '',
    submissionDate: '',
    datesAreLegal: undefined,
    commission: null,
    funds: [],
    isOpenToProjects: false,
    name: ''
})

const newCommissionForm = ref(QForm)

onMounted(async () => {
    loading.show()
    await onGetCommissions()
    loading.hide()
})

async function onGetCommissions() {
    try {
        await getFunds()
        await getCommissionsForManagers(
            true,
            undefined,
            undefined,
            undefined,
            undefined)
        initFundsLabels()
        await getCommissionFunds(true)
        initDates()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }

    }
}

const initDates = () => {
    updateCommissions.value = []
    commissions.value.forEach((commission) => {
        updateCommissions.value.push({
            id: commission.id,
            oldName: commission.name,
            newName: commission.name,
            oldCommissionDate: commission.commissionDate,
            newCommissionDate: commission.commissionDate,
            oldSubmissionDate: commission.submissionDate,
            newSubmissionDate: commission.submissionDate,
            datesAreLegal: undefined,
            oldFunds: commissionFunds.value.filter(obj => obj.commission === commission.id).map(fund => fund.fund),
            newFunds: commissionFunds.value.filter(obj => obj.commission === commission.id).map(fund => fund.fund),
            oldIsOpenToProjects: commission.isOpenToProjects,
            newIsOpenToProjects: commission.isOpenToProjects,
            open: false
        })
    })
}

async function onUpdateCommission(commission: UpdateCommission) {
    loading.show()
    try {
        if (commission.newName !== commission.oldName
            || commission.newCommissionDate !== commission.oldCommissionDate
            || commission.newSubmissionDate !== commission.oldSubmissionDate
            || commission.newIsOpenToProjects !== commission.oldIsOpenToProjects
            || !arraysAreEqual(commission.newFunds, commission.oldFunds)) {
            await updateCommission(commission)
            await onGetCommissions()
            notify({
                type: 'positive',
                message: t('notifications.positive.commission-date-modified')
            })
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
    loading.hide()
}

async function onDeleteCommission(commission: number) {
    loading.show()
    try {
        await deleteCommission(commission)
        const index = updateCommissions.value.findIndex(obj => obj.id === commission)
        updateCommissions.value.splice(index, 1)
        notify({
            type: 'positive',
            message: t('notifications.positive.commission-date-deleted')
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
    loading.hide()
}

async function onAddNewCommission() {
    loading.show()
    try {
        await postNewCommission(newCommission.value)
        newCommissionForm.value.reset()
        await onGetCommissions()
        notify({
            type: 'positive',
            message: t('notifications.positive.new-commission-date')
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
    loading.hide()
}

const onClearValues = () => {
    newCommission.value.commission = null
    newCommission.value.commissionDate = ''
    newCommission.value.submissionDate = ''
    newCommission.value.datesAreLegal = undefined
    newCommission.value.name = ''
    newCommission.value.funds = []
    newCommission.value.isOpenToProjects = false
}
</script>

<template>
    <div class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-calendar-check"
            ></i>
            {{ t('commission.ongoing-or-to-come') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <div
                    v-for="commission in updateCommissions"
                    :key="commission.id"
                    class="document-input-group"
                >
                    <div class="document-input variant-space-1">
                        <div class="document-input-header">
                            <h4>
                                {{ commission.oldName }}
                            </h4>

                            <p class="form-state form-state-cape">
                                <span
                                    v-if="commission.oldIsOpenToProjects"
                                    :aria-label="t('commission.is-open-to-projects')"
                                    class="form-state-icon form-state-green"
                                ><i class="bi bi-check"></i></span>
                                <span
                                    v-else
                                    :aria-label="t('commission.is-closed-to-projects')"
                                    class="form-state-icon form-state-red"
                                ><i class="bi bi-x"></i></span>
                            </p>

                            <button @click.prevent="commission.open = !commission.open">
                                <i
                                    :class="`bi bi-${commission.open ? 'x' : 'pencil'}`"
                                    aria-hidden="true"
                                ></i>
                            </button>
                        </div>
                    </div>

                    <div v-if="commission.open">
                        <QForm>
                            <QInput
                                v-model="commission.newName"
                                :label="t('commission.name')"
                                :rules="[val => val && val.length > 0 || t('forms.required-commission-name')]"
                                clearable
                                color="commission"
                                filled
                                lazy-rules
                            />
                            <QInput
                                v-model="commission.newCommissionDate"
                                :label="t('commission.date')"
                                :rules="[
                                    val => val && val.length > 0 || t('forms.required-commission-date'),
                                    val => val && fromDateIsAnterior(commission.newSubmissionDate, commission.newCommissionDate, false)
                                        || t('forms.commission-date-must-be-posterior-to-submission-date')
                                ]"
                                clearable
                                color="commission"
                                filled
                                max="2120-01-01"
                                min="1970-01-01"
                                reactive-rules
                                type="date"
                            />
                            <QInput
                                v-model="commission.newSubmissionDate"
                                :label="t('commission.submission')"
                                :rules="[
                                    val => val && val.length > 0 || t('forms.required-commission-submission-date'),
                                    val => val && fromDateIsAnterior(commission.newSubmissionDate, commission.newCommissionDate, false)
                                        || t('forms.commission-date-must-be-posterior-to-submission-date')
                                ]"
                                clearable
                                color="commission"
                                filled
                                max="2120-01-01"
                                min="1970-01-01"
                                reactive-rules
                                type="date"
                                @update:model-value="() => commission.datesAreLegal =
                                    fromDateIsAnterior(commission.newSubmissionDate, commission.newCommissionDate, true)"
                            />
                            <QSelect
                                v-model="commission.newFunds"
                                :label="t('commission.funds')"
                                :options="fundsLabels"
                                :rules="[val => val || t('forms.required-commission-funds')]"
                                clearable
                                color="commission"
                                emit-value
                                filled
                                map-options
                                multiple
                                use-chips
                            />
                            <QToggle
                                v-model="commission.newIsOpenToProjects"
                                :label="t('commission.is-open-to-projects')"
                                color="commission"
                            />
                            <AlertConfirmCommissionDateUpdateOrDelete
                                :commission="commission"
                                @update-commission-date="onUpdateCommission(commission)"
                                @delete-commission-date="onDeleteCommission(commission.id)"
                            />
                        </QForm>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-calendar-plus"
            ></i>
            {{ t('commission.add-new-date') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <QForm
                    ref="newCommissionForm"
                    @reset="onClearValues"
                    @submit.prevent="onAddNewCommission"
                >
                    <QInput
                        v-model="newCommission.name"
                        :label="t('commission.name')"
                        :rules="[val => val && val.length > 0 || t('forms.required-commission-name')]"
                        clearable
                        color="commission"
                        filled
                        lazy-rules
                    />
                    <QInput
                        v-model="newCommission.commissionDate"
                        :label="t('commission.date')"
                        :rules="[
                            val => val && val.length > 0 || t('forms.required-commission-date'),
                            val => val && newCommission.datesAreLegal || t('forms.commission-date-must-be-posterior-to-submission-date')
                        ]"
                        clearable
                        color="commission"
                        filled
                        max="2120-01-01"
                        min="1970-01-01"
                        reactive-rules
                        type="date"
                        @update:model-value="() => newCommission.datesAreLegal =
                            fromDateIsAnterior(newCommission.submissionDate, newCommission.commissionDate, false)"
                    />
                    <QInput
                        v-model="newCommission.submissionDate"
                        :label="t('commission.submission')"
                        :rules="[
                            val => val && val.length > 0 || t('forms.required-commission-submission-date'),
                            val => val && newCommission.datesAreLegal || t('forms.commission-date-must-be-posterior-to-submission-date')
                        ]"
                        clearable
                        color="commission"
                        filled
                        max="2120-01-01"
                        min="1970-01-01"
                        reactive-rules
                        type="date"
                        @update:model-value="() => newCommission.datesAreLegal =
                            fromDateIsAnterior(newCommission.submissionDate, newCommission.commissionDate, false)"
                    />
                    <QSelect
                        v-model="newCommission.funds"
                        :label="t('commission.funds')"
                        :options="fundsLabels"
                        :rules="[val => val || t('forms.required-commission-funds')]"
                        clearable
                        color="commission"
                        emit-value
                        filled
                        map-options
                        multiple
                        use-chips
                    />
                    <QToggle
                        v-model="newCommission.isOpenToProjects"
                        :label="t('commission.is-open-to-projects')"
                        color="commission"
                    />
                    <div class="flex-btn">
                        <QBtn
                            :disable="!newCommission.datesAreLegal || !newCommission.funds.length || !newCommission.name"
                            :label="t('add')"
                            class="btn-lg"
                            color="commission"
                            icon="bi-plus-circle"
                            type="submit"
                        />
                    </div>
                </QForm>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/dashboard.scss";
@import "@/assets/styles/forms.scss";

/*
.flex-btn {
  display: flex;
  gap: 1rem;
  margin: -0.5rem 0 0.5rem 0;
}

.q-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}*/
</style>
