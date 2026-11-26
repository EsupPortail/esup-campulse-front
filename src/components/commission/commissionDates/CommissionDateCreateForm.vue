<script lang="ts" setup>
import {ref} from 'vue'
import {QForm} from 'quasar'
import {useI18n} from 'vue-i18n'
import type {CreateCommission} from '#/commission'
import {useFundStore} from '@/stores/useFundStore'

const {t} = useI18n()
const fundStore = useFundStore()

const newCommission = defineModel<CreateCommission>({required: true})

defineProps<{
  canSubmit: boolean,
  datesAreLegal: boolean,
  editionDateIsLegal: boolean
}>()

const emit = defineEmits<{
  submit: []
}>()

const form = ref<InstanceType<typeof QForm> | null>(null)
const openInfos = ref<boolean>(false)

function resetForm(): void {
  openInfos.value = false
  form.value?.resetValidation()
}

defineExpose({resetForm})
</script>

<template>
  <QForm
    ref="form"
    @submit.prevent="emit('submit')"
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
        () => datesAreLegal || t('forms.commission-date-must-be-posterior-to-submission-date')
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
      v-model="newCommission.submissionDate"
      :label="t('commission.submission')"
      :rules="[
        val => val && val.length > 0 || t('forms.required-commission-submission-date'),
        () => datesAreLegal || t('forms.commission-date-must-be-posterior-to-submission-date')
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
      v-model="newCommission.editionDate"
      :label="t('commission.edition-date')"
      :rules="[
        val => val && val.length > 0 || t('forms.required-commission-edition-date'),
        () => editionDateIsLegal
          || t('forms.commission-edition-date-must-be-between-submission-and-commission-dates')
      ]"
      clearable
      color="commission"
      filled
      max="2120-01-01"
      min="1970-01-01"
      reactive-rules
      type="date"
    />
    <QSelect
      v-model="newCommission.funds"
      :label="t('commission.funds')"
      :options="fundStore.fundLabels"
      :rules="[val => val && val.length > 0 || t('forms.required-commission-funds')]"
      clearable
      color="commission"
      emit-value
      filled
      map-options
      multiple
      use-chips
    />
    <div>
      <QToggle
        v-model="newCommission.isOpenToProjects"
        :label="t('commission.is-open-to-projects')"
        color="commission"
      />
    </div>
    <div>
      <QToggle
        v-model="openInfos"
        :label="t('commission.informations')"
        color="commission"
      />
    </div>
    <div
      v-if="openInfos"
      class="flex-column gap-m padding-top"
    >
      <QInput
        v-model="newCommission.scheduledTime"
        :label="t('commission.scheduled-time')"
        clearable
        color="commission"
        filled
        type="time"
      />
      <QInput
        v-model="newCommission.building"
        :label="t('commission.building')"
        clearable
        color="commission"
        filled
      />
      <QInput
        v-model="newCommission.room"
        :label="t('commission.room')"
        clearable
        color="commission"
        filled
      />
      <QInput
        v-model="newCommission.address"
        :label="t('commission.address')"
        clearable
        color="commission"
        filled
      />
    </div>
    <div class="flex-btn padding-top">
      <QBtn
        :disable="!canSubmit"
        :label="t('add')"
        class="btn-lg"
        color="commission"
        icon="bi-plus-circle"
        type="submit"
      />
    </div>
  </QForm>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/dashboard";
@import "@/assets/styles/forms";
</style>
