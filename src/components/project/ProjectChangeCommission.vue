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
    initProjectBasicInfos,
    projectCommission,
    projectCommissionFunds,
    reInitProjectCommissionFunds,
    patchProjectCommissionFunds
} = useSubmitProject()
const {
    getCommissionsForManagers,
    initCommissionLabels,
    getFunds,
    getCommissionFunds,
    commissionFunds,
    initChosenCommissionFundsLabels,
    commissionLabels,
    fundsLabels
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

watch(() => open.value, async () => {
    loading.show()
    if (open.value) {
        try {
            await projectStore.getProjectDetail(props.project)
            initProjectBasicInfos()
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
                })
            }
        }
    }
    loading.hide()
})

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
        if (projectCommission.value) {
            initChosenCommissionFundsLabels(projectCommission.value as number, props.isSite)
            projectCommissionFunds.value = projectStore.projectCommissionFunds
                .map(x => x.commissionFund)
        }
        await getCommissionsForManagers(undefined, true, props.isSite, true, projectCommissionFunds.value)
        initCommissionLabels()

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onChangeCommission() {
    loading.show()
    try {
        if (projectStore.projectCommissionFunds.length) {
            await patchProjectCommissionFunds(projectStore.projectCommissionFunds[0].isFirstEdition ?? false)
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
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
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
                <h3>{{ t('project.change-commission') }}</h3>
                <div
                    v-if="commissionLabels.length < 2"
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
                <QForm
                    @submit="onChangeCommission"
                >
                    <QSelect
                        v-model="projectCommission"
                        :hint="t('project.commission-choice-hint')"
                        :label="t('project.commission-choice') + ' *'"
                        :options="commissionLabels"
                        :rules="[ val => val || t('forms.fill-field')]"
                        clearable
                        color="commission"
                        emit-value
                        filled
                        lazy-rules
                        map-options
                        @update:model-value="reInitProjectCommissionFunds(props.isSite)"
                    />

                    <QSelect
                        v-model="projectCommissionFunds"
                        :hint="t('project.commission-funds-choice-hint')"
                        :label="t('project.commission-funds-choice') + ' *'"
                        :options="fundsLabels"
                        :readonly="!projectCommission"
                        :rules="[ val => val || t('forms.fill-field')]"
                        clearable
                        color="commission"
                        emit-value
                        filled
                        lazy-rules
                        map-options
                        multiple
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
                            :disable="commissionLabels.length < 2 || !projectCommissionFunds.length"
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