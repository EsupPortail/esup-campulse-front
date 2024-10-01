<script lang="ts" setup>
import {ref, toRefs, watch} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import {useProjectStore} from '@/stores/useProjectStore'
import useSubmitProject from '@/composables/useSubmitProject'
import useCommissions from '@/composables/useCommissions'

const {notify, loading} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()
const projectStore = useProjectStore()
const {
    projectCommission,
    projectCommissionFunds,
    reInitProjectCommissionFunds,
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

const emit = defineEmits(['closeDialog', 'refreshProjects'])

const props = defineProps<{
    openDialog: boolean,
    project: number,
    isSite: boolean
}>()

const openRef = toRefs(props).openDialog

const open = ref<boolean>(false)

watch(() => openRef.value, () => {
    open.value = openRef.value
})

watch(() => open.value, () => {
    if (!open.value) {
        emit('closeDialog')
    }
})

/*watch(() => open.value, async () => {
    loading.show()
    if (open.value) {
        try {
            await projectStore.getProjectDetail(props.project)
            initProjectBasicInfos()
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: await catchHTTPError(error.response)
                })
            }
        }
    }
    loading.hide()
})*/

watch(() => open.value, async () => {
    if (open.value) {
        loading.show()
        await onGetCommissionDates()
        loading.hide()
    }
})

async function onGetCommissionDates() {
    try {
        await projectStore.getProjectDetail(props.project)
        await projectStore.getProjectCommissionFunds(false, undefined)
        await getFunds()
        await getCommissionFunds()
        projectCommission.value = commissionFunds.value
            .find(obj => obj.id === projectStore.projectCommissionFunds[0].commissionFund)?.commission as number
        const chosenFunds: number[] = []
        if (projectCommission.value) {
            initChosenCommissionFundsLabels(projectCommission.value as number, props.isSite)
            projectCommissionFunds.value = projectStore.projectCommissionFunds
                .map(x => x.commissionFund)
            fundsLabels.value.forEach(x => {
                if (projectCommissionFunds.value.includes(x.value)) {
                    if (x.fund) chosenFunds.push(x.fund)
                }
            })
        }
        await getCommissionsForManagers(undefined, undefined, undefined, !props.isSite ? false : undefined, true, chosenFunds)
        initChangeCommissionLabels(projectCommission.value)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
}

async function onChangeCommission() {
    loading.show()
    try {
        if (projectStore.projectCommissionFunds.length) {
            for (const x of projectStore.projectCommissionFunds) {
                const oldCommissionFund = commissionFunds.value.find(y => y.id === x.commissionFund)
                const fund = funds.value.find(y => y.id === oldCommissionFund?.fund)
                const newCommissionFund = fundsLabels.value.find(y => y.fund === fund?.id)
                if (oldCommissionFund && newCommissionFund && projectCommissionFunds.value.includes(newCommissionFund.value)) {
                    await projectStore.patchProjectCommissionFund(oldCommissionFund.id, newCommissionFund.value)
                }
            }
        }
        emit('closeDialog')
        emit('refreshProjects')
        notify({
            type: 'positive',
            message: t('notifications.positive.project-commission-updated')
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

const onReInitProjectCommissionFunds = () => {
    const oldProjectCommissionFunds = [...projectCommissionFunds.value]
    reInitProjectCommissionFunds(props.isSite)
    oldProjectCommissionFunds.forEach(x => {
        const fund = commissionFunds.value.find(y => y.id === x)?.fund
        if (fund) {
            const fundLabel = fundsLabels.value.find(y => y.fund === fund)
            if (fundLabel) {
                projectCommissionFunds.value.push(fundLabel.value)
            }
        }
    })
}
</script>

<template>
    <QDialog v-model="open">
        <QCard class="variant-space-3">
            <QCardSection>
                <h3>{{ t('project.change-commission') }}</h3>
                <div
                    v-if="!commissionLabels.length || (commissionLabels.length === 1 && commissionLabels[0].value === projectCommission)"
                    class="info-panel info-panel-warning"
                >
                    <i
                        aria-hidden="true"
                        class="bi bi-exclamation-lg"
                    ></i>
                    <p>
                        {{ t('project.change-commission-info') }}
                    </p>
                </div>
                <QForm @submit="onChangeCommission">
                    <QSelect
                        v-model="projectCommission"
                        :hint="t('project.commission-choice-hint')"
                        :label="t('project.commission-choice') + ' *'"
                        :options="commissionLabels"
                        :rules="[val => val || t('forms.required-commission')]"
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
                        :rules="[val => val || t('forms.required-project-commission-fund')]"
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
                            @click="emit('closeDialog')"
                        />
                        <QBtn
                            v-close-popup
                            :disable="!commissionLabels.length || !projectCommissionFunds.length || (commissionLabels.length === 1 && commissionLabels[0].value === projectCommission)"
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
