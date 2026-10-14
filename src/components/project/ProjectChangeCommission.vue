<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useError'
import {useProjectStore} from '@/stores/useProjectStore'
import useProject from '@/composables/useProject'
import {useCommissionStore} from '@/stores/useCommissionStore'
import {useFundStore} from '@/stores/useFundStore'
import useCommissionFund from '@/composables/useCommissionFund'

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
const commissionStore = useCommissionStore()
const fundStore = useFundStore()

const {
  projectCommission,
  projectCommissionFunds,
} = useProject()

const {commissionFundLabels} = useCommissionFund()

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

const initFundLabels = () => {
  const originalCommissionFunds = new Set<number>(projectStore.projectCommissionFunds.map(projectCommissionFund => projectCommissionFund.commissionFund))
  const originalFunds = new Set<number>(commissionStore.commissionFunds
    .filter(commissionFund => originalCommissionFunds.has(commissionFund.id))
    .map(commissionFund => commissionFund.fund))

  projectCommissionFunds.value = commissionStore.commissionFunds
    .filter(commissionFund => commissionFund.commission === projectCommission.value && originalFunds.has(commissionFund.fund))
    .map(commissionFund => commissionFund.id)
}

async function onGetCommissionDates() {
  try {
    await Promise.all([
      await projectStore.getProjectDetail(props.project),
      commissionStore.getCommissionsToPostponeProject(props.project),
      projectStore.getProjectCommissionFunds(false, props.project),
      fundStore.getFunds(),
      commissionStore.getCommissionFunds()
    ])
    initFundLabels()
  } catch (error) {
    await handleError(error)
  }
}

async function onChangeCommission() {
  loading.show()
  try {
    await projectStore.postponeProject(props.project, projectCommission.value)
    projectCommission.value = null
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

async function handleError(error: unknown) {
  if (axios.isAxiosError(error) && error.response) {
    notify({
      type: 'negative',
      message: await catchHTTPError(error.response)
    })
  }
}
</script>

<template>
  <QDialog v-model="open">
    <QCard class="variant-space-3">
      <QCardSection>
        <h3>{{ t('project.change-commission') }}</h3>

        <div
          v-if="isLoaded && commissionStore.commissionLabels.length < 2"
          class="info-panel info-panel-warning"
        >
          <i
            aria-hidden="true"
            class="bi bi-exclamation-lg"
          ></i>
          <p>{{ t('project.change-commission-info') }}</p>
        </div>

        <QForm @submit="onChangeCommission()">
          <QSelect
            v-model="projectCommission"
            :hint="t('project.commission-choice-hint')"
            :label="t('project.commission-choice') + ' *'"
            :options="commissionStore.commissionLabels"
            :rules="[val => !!val || t('forms.required-commission')]"
            clearable
            color="commission"
            emit-value
            filled
            lazy-rules
            map-options
            @update:model-value="initFundLabels()"
          />

          <QSelect
            v-model="projectCommissionFunds"
            :hint="t('project.commission-funds-choice-hint')"
            :label="t('project.commission-funds-choice') + ' *'"
            :options="commissionFundLabels"
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
              v-close-popup
              :disable="!projectCommission"
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