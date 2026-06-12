<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import {useProjectStore} from '@/stores/useProjectStore'
import useSubmitProject from '@/composables/useSubmitProject'
import useCommissions from '@/composables/useCommissions'

const props = defineProps<{
  openDialog: boolean
  project: number
  isSite: boolean
}>()

const emit = defineEmits(['closeDialog', 'refreshProjects'])

const {notify, loading} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()
const projectStore = useProjectStore()

const {
    projectCommission,
    projectCommissionFunds,
} = useSubmitProject()

const {
    getCommissionsForManagers,
    getFunds,
    getCommissionFunds,
    commissionFunds,
    initChosenCommissionFundsLabels,
    commissionLabels,
    fundsLabels,
    funds,
    initChangeCommissionLabels
} = useCommissions()

const open = computed({
    get: () => props.openDialog,
    set: (value) => {
        if (!value) emit('closeDialog')
    }
})

const isLoaded = ref<boolean>(false)

watch(() => props.openDialog, async (isOpen) => {
    if (isOpen) {
        loading.show()
        await onGetCommissionDates()
        isLoaded.value = true
        loading.hide()
    }
})

const oldProjectCommission = ref<number>()

const possibleFunds = ref<number[]>([])

async function onGetCommissionDates() {
    try {
        await projectStore.getProjectDetail(props.project)

        await Promise.all([
            projectStore.getProjectCommissionFunds(false, props.project),
            getFunds(),
            getCommissionFunds()
        ])

        // Initialize project commission
        const firstProjectFund = projectStore.projectCommissionFunds[0]
        if (!firstProjectFund) return
        const matchedCommission = commissionFunds.value.find(obj => obj.id === firstProjectFund.commissionFund)
        projectCommission.value = matchedCommission?.commission as number
        oldProjectCommission.value = projectCommission.value
        if (!projectCommission.value) return

        // Initialize commission funds
        initChosenCommissionFundsLabels(projectCommission.value, props.isSite)
        projectCommissionFunds.value = projectStore.projectCommissionFunds.map(x => x.commissionFund)

        const chosenFunds = fundsLabels.value
            .filter(x => projectCommissionFunds.value.includes(x.value) && x.fund)
            .map(x => x.fund as number)

        possibleFunds.value = [...chosenFunds]

        onReInitProjectCommissionFunds(oldProjectCommission.value)

        // Initialize commissions
        await getCommissionsForManagers(undefined, undefined, undefined, props.isSite ? undefined : false, true, chosenFunds)
        initChangeCommissionLabels(projectCommission.value, possibleFunds.value)
    } catch (error) {
        await handleError(error)
    }
}

async function onChangeCommission() {
    loading.show()
    try {
        for (const x of projectStore.projectCommissionFunds) {
            const oldCommissionFund = commissionFunds.value.find(y => y.id === x.commissionFund)
            const fund = funds.value.find(y => y.id === oldCommissionFund?.fund)
            const newCommissionFund = fundsLabels.value.find(y => y.fund === fund?.id)
            await projectStore.patchProjectCommissionFund(oldCommissionFund.id, newCommissionFund.value)
        }
        emit('closeDialog')
        emit('refreshProjects')
        notify({
            type: 'positive',
            message: t('notifications.positive.project-commission-updated')
        })
    } catch (error) {
        await handleError(error)
    } finally {
        loading.hide()
    }
}

const onReInitProjectCommissionFunds = (newCommissionId: number | null) => {
    projectCommission.value = newCommissionId

    if (!newCommissionId) {
        projectCommissionFunds.value = []
        fundsLabels.value = []
        return
    }

    initChosenCommissionFundsLabels(newCommissionId, props.isSite)
    fundsLabels.value = fundsLabels.value.filter(option => possibleFunds.value.includes(option.fund))

    projectCommissionFunds.value = fundsLabels.value.map(option => option.value)
}

async function handleError(error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
        notify({
            type: 'negative',
            message: await catchHTTPError(error.response)
        })
    }
}

const canChangeCommission = computed<boolean>(() => {
    return projectCommission.value !== oldProjectCommission.value
})
</script>

<template>
    <QDialog v-model="open">
        <QCard class="variant-space-3">
            <QCardSection>
                <h3>{{ t('project.change-commission') }}</h3>

                <div
                    v-if="isLoaded && commissionLabels.length < 2"
                    class="info-panel info-panel-warning"
                >
                    <i
                        aria-hidden="true"
                        class="bi bi-exclamation-lg"
                    ></i>
                    <p>{{ t('project.change-commission-info') }}</p>
                </div>

                <QForm @submit="onChangeCommission">
                    <QSelect
                        v-model="projectCommission"
                        :hint="t('project.commission-choice-hint')"
                        :label="t('project.commission-choice') + ' *'"
                        :options="commissionLabels"
                        :rules="[val => !!val || t('forms.required-commission')]"
                        clearable
                        color="commission"
                        emit-value
                        filled
                        lazy-rules
                        map-options
                        @update:model-value="onReInitProjectCommissionFunds"
                    />

                    <QSelect
                        v-model="projectCommissionFunds"
                        :hint="t('project.commission-funds-choice-hint')"
                        :label="t('project.commission-funds-choice') + ' *'"
                        :options="fundsLabels"
                        :rules="[val => !!val || t('forms.required-project-commission-fund')]"
                        clearable
                        color="commission"
                        emit-value
                        filled
                        lazy-rules
                        map-options
                        multiple
                        readonly
                        stack-label
                        use-chips
                    />

                    <div class="flex-row-center">
                        <QBtn
                            v-close-popup
                            :label="t('cancel')"
                            class="btn-lg"
                            color="commission"
                            icon="bi-x-lg"
                        />
                        <QBtn
                            :disable="!canChangeCommission"
                            :label="t('validate')"
                            class="btn-lg"
                            color="commission"
                            icon="bi-check-lg"
                            type="submit"
                        />
                    </div>
                </QForm>
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

h3 {
  padding-bottom: 1rem;
}

.q-select + .q-select {
  margin-top: 2rem;
}

.flex-row-center {
  margin-top: 3.5rem;
}
</style>