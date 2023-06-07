<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {onMounted, ref} from 'vue'
import {QForm, useQuasar} from 'quasar'
import useCommissions from '@/composables/useCommissions'
import useUtility from '@/composables/useUtility'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import AlertConfirmCommissionDateUpdateOrDelete from '@/components/alert/AlertConfirmCommissionDateUpdateOrDelete.vue'

const {t} = useI18n()
const {loading, notify} = useQuasar()
const {formatDate, fromDateIsAnterior} = useUtility()
const {
    getFunds,
    getCommissionsForManagers,
    getCommissionFunds,
    commissions,
    commissionFunds,
    funds
} = useCommissions()
const {catchHTTPError} = useErrors()

interface UpdateCommissionDate {
    id: number,
    name: string,
    commissionDate: string,
    submissionDate: string,
    datesAreLegal: boolean | undefined,
    oldFunds: number[],
    newFunds: number[],
    open: boolean
}

const updateCommissionDates = ref<UpdateCommissionDate[]>([])

/*interface NewCommissionDate {
    commissionDate: string,
    submissionDate: string,
    datesAreLegal: boolean | undefined,
    commissionId: number | null
}

const newCommissionDate = ref<NewCommissionDate>({
    commissionDate: '',
    submissionDate: '',
    datesAreLegal: undefined,
    commissionId: null
})

const newCommissionDateForm = ref(QForm)*/

onMounted(async () => {
    loading.show()
    await onGetCommissionDates()
    loading.hide()
})

async function onGetCommissionDates() {
    try {
        await getFunds()
        await getCommissionsForManagers(true, undefined, undefined, undefined, undefined)
        await getCommissionFunds()
        initDates()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }

    }
}

const initDates = () => {
    updateCommissionDates.value = []
    commissions.value.forEach((commission) => {
        updateCommissionDates.value.push({
            id: commission.id,
            name: 'Commission',
            commissionDate: commission.commissionDate,
            submissionDate: commission.submissionDate,
            datesAreLegal: undefined,
            oldFunds: commissionFunds.value.filter(obj => obj.commission === commission.id).map(fund => fund.fund),
            newFunds: [],
            open: false
        })
    })
    /*commissionDates.value.forEach((commissionDate) => {
        const commission = commissions.value.find(obj => obj.id === commissionDate.commission)
        if (commission) {
            const label = `${commission.acronym} (${formatDate(commissionDate.commissionDate)?.split('-').reverse().join('/')})`
            manageCommissionDates.value.push({
                id: commissionDate.id,
                label,
                commissionDate: formatDate(commissionDate.commissionDate) as string,
                submissionDate: formatDate(commissionDate.submissionDate) as string,
                datesAreLegal: undefined,
                open: false
            })
        }
    })*/
}

/*async function onUpdateCommissionDate(commissionDate: ManageCommissionDate) {
    loading.show()
    try {
        await patchCommissionDate(commissionDate.id, commissionDate.commissionDate, commissionDate.submissionDate)
        await onGetCommissionDates()
        notify({
            type: 'positive',
            message: t('notifications.positive.commission-date-modified')
        })
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

async function onDeleteCommissionDate(commissionDateId: number) {
    loading.show()
    try {
        await deleteCommissionDate(commissionDateId)
        const index = manageCommissionDates.value.findIndex(obj => obj.id === commissionDateId)
        manageCommissionDates.value.splice(index, 1)
        notify({
            type: 'positive',
            message: t('notifications.positive.commission-date-deleted')
        })
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

async function onAddNewCommissionDate() {
    loading.show()
    try {
        await postCommissionDate(newCommissionDate.value.commissionId as number,
            newCommissionDate.value.commissionDate, newCommissionDate.value.submissionDate)
        newCommissionDateForm.value.reset()
        await onGetCommissionDates()
        notify({
            type: 'positive',
            message: t('notifications.positive.new-commission-date')
        })
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

const onClearValues = () => {
    newCommissionDate.value.commissionId = null
    newCommissionDate.value.commissionDate = ''
    newCommissionDate.value.submissionDate = ''
    newCommissionDate.value.datesAreLegal = undefined
}*/
</script>

<template>
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-calendar-check"
            ></i>
            {{ t('commission.ongoing-or-to-come') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <div
                    v-for="commission in updateCommissionDates"
                    :key="commission.id"
                    class="document-input-group"
                >
                    <div class="document-input variant-space-1">
                        <div class="document-input-header">
                            <h4>
                                {{ commission.name }}
                            </h4>

                            <button @click.prevent="commission.open = !commission.open">
                                <i :class="`bi bi-${commission.open ? 'x' : 'pencil'}`"></i>
                            </button>
                        </div>
                    </div>

                    <div v-if="commission.open">
                        <QForm>
                            <QInput
                                v-model="commission.commissionDate"
                                :label="t('commission.date')"
                                :rules="[
                                    val => val && val.length > 0 || t('forms.fill-field'),
                                    val => val && commission.datesAreLegal || t('forms.commission-date-must-be-posterior-to-submission-date')
                                ]"
                                clearable
                                filled
                                reactive-rules
                                type="date"
                                @update:model-value="() => commission.datesAreLegal =
                                    fromDateIsAnterior(commission.submissionDate, commission.commissionDate)"
                            />
                            <QInput
                                v-model="commission.submissionDate"
                                :label="t('commission.submission')"
                                :rules="[
                                    val => val && val.length > 0 || t('forms.fill-field'),
                                    val => val && commission.datesAreLegal || t('forms.commission-date-must-be-posterior-to-submission-date')
                                ]"
                                clearable
                                filled
                                reactive-rules
                                type="date"
                                @update:model-value="() => commission.datesAreLegal =
                                    fromDateIsAnterior(commission.submissionDate, commission.commissionDate)"
                            />
                            <AlertConfirmCommissionDateUpdateOrDelete
                                :commission-date="commission.id"
                                :dates-are-legal="commission.datesAreLegal"
                                @update-commission-date="onUpdateCommissionDate(commissionDate)"
                                @delete-commission-date="onDeleteCommissionDate(commissionDate.id)"
                            />
                        </QForm>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!--    <section class="dashboard-section">
            <h2>
                <i
                    aria-hidden="true"
                    class="bi bi-calendar-plus"
                ></i>
                {{ t('commission.add-new-date') }}
            </h2>
            <div class="form-container">
                <div class="form">
                    <QForm
                        ref="newCommissionDateForm"
                        @reset="onClearValues"
                        @submit.prevent="onAddNewCommissionDate"
                    >
                        <QSelect
                            v-model="newCommissionDate.commissionId"
                            :label="t('commission.choice')"
                            :options="commissionOptions"
                            :rules="[val => val || t('forms.fill-field')]"
                            clearable
                            emit-value
                            filled
                            map-options
                        />
                        <QInput
                            v-model="newCommissionDate.commissionDate"
                            :label="t('commission.date')"
                            :rules="[
                                val => val && val.length > 0 || t('forms.fill-field'),
                                val => val && newCommissionDate.datesAreLegal || t('forms.commission-date-must-be-posterior-to-submission-date')
                            ]"
                            clearable
                            filled
                            reactive-rules
                            type="date"
                            @update:model-value="() => newCommissionDate.datesAreLegal =
                                fromDateIsAnterior(newCommissionDate.submissionDate, newCommissionDate.commissionDate)"
                        />
                        <QInput
                            v-model="newCommissionDate.submissionDate"
                            :label="t('commission.submission')"
                            :rules="[
                                val => val && val.length > 0 || t('forms.fill-field'),
                                val => val && newCommissionDate.datesAreLegal || t('forms.commission-date-must-be-posterior-to-submission-date')
                            ]"
                            clearable
                            filled
                            reactive-rules
                            type="date"
                            @update:model-value="() => newCommissionDate.datesAreLegal =
                                fromDateIsAnterior(newCommissionDate.submissionDate, newCommissionDate.commissionDate)"
                        />
                        <div class="flex-btn">
                            <QBtn
                                :disable="!newCommissionDate.datesAreLegal"
                                :label="t('add')"
                                icon="bi-plus-circle"
                                type="submit"
                            />
                        </div>
                    </QForm>
                </div>
            </div>
        </section>-->
</template>

<style lang="scss" scoped>
@import "@/assets/styles/dashboard.scss";
@import "@/assets/styles/forms.scss";

.flex-btn {
    display: flex;
    gap: 1rem;
    margin: -0.5rem 0 0.5rem 0;
}

.q-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>