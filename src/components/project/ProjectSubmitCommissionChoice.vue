<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import useSubmitProject from '@/composables/useSubmitProject'
import useCommissions from '@/composables/useCommissions'
import {useQuasar} from 'quasar'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import {onMounted} from 'vue'
import {useProjectStore} from '@/stores/useProjectStore'

const {t} = useI18n()
const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()
const {
    projectCommission,
    updateProjectCommission,
    projectCommissionFunds,
    reInitProjectCommissionFunds,
} = useSubmitProject()
const {
    commissionLabels,
    fundsLabels,
    getFunds,
    getCommissionFunds,
    getCommissionsForStudents,
    initCommissionLabels,
    initChosenCommissionFundsLabels,
    commissionFunds
} = useCommissions()
const projectStore = useProjectStore()

const props = defineProps<{
    isSite: boolean,
    newProject: boolean
}>()

const emit = defineEmits(['updateStep'])

// GET DATA
onMounted(async () => {
    loading.show()
    await onGetCommissionDates()
    loading.hide()
})

async function onGetCommissionDates() {
    loading.show()
    try {
        await getCommissionsForStudents(true, props.isSite)
        initCommissionLabels()
        await getFunds()
        await getCommissionFunds()
        if (!props.newProject) {
            await projectStore.getProjectCommissionFunds(false, undefined)
            projectCommission.value = commissionFunds.value
                .find(obj => obj.id === projectStore.projectCommissionFunds[0].commissionFund)?.commission as number
            if (projectCommission.value) {
                initChosenCommissionFundsLabels(projectCommission.value as number, props.isSite)
                projectCommissionFunds.value = projectStore.projectCommissionFunds
                    .map(x => x.commissionFund)
            }
        }
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
async function onSubmitCommission(nextStep: number) {
    loading.show()
    try {
        await updateProjectCommission()
        emit('updateStep', nextStep)
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
    <QForm
        class="flex-column"
        @submit="onSubmitCommission(3)"
    >
        <QSelect
            v-model="projectCommission"
            :label="t('project.commission-choice') + ' *'"
            :options="commissionLabels"
            :rules="[val => val || t('forms.select-project-commission-date')]"
            clearable
            color="commission"
            data-test="commission-select"
            emit-value
            filled
            for="projectCommission"
            lazy-rules
            map-options
            @update:model-value="reInitProjectCommissionFunds(props.isSite)"
        >
            <template v-slot:hint>
                <p aria-describedby="projectCommission">
                    {{
                        t('project.commission-choice-hint')
                    }}
                </p>
            </template>
        </QSelect>

        <QSelect
            v-model="projectCommissionFunds"
            :label="t('project.commission-funds-choice') + ' *'"
            :options="fundsLabels"
            :readonly="!projectCommission"
            :rules="[val => val || t('forms.select-project-commission-member')]"
            clearable
            color="commission"
            data-test="commission-funds-select"
            emit-value
            filled
            for="projectCommissionFunds"
            lazy-rules
            map-options
            multiple
            stack-label
            use-chips
        >
            <template v-slot:hint>
                <p aria-describedby="projectCommissionFunds">
                    {{ t('project.commission-funds-choice-hint') }}
                </p>
            </template>
        </QSelect>

        <div class="flex-row-center padding-top padding-bottom">
            <QBtn
                :label="t('back')"
                class="btn-lg"
                color="commission"
                data-test="back-button"
                icon="bi-chevron-left"
                @click="onSubmitCommission(1)"
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