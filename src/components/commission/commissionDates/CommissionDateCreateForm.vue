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
  datesAreLegal: boolean
}>()

const emit = defineEmits<{
  submit: []
}>()

const form = ref<InstanceType<typeof QForm> | null>(null)

function resetValidation(): void {
  form.value?.resetValidation()
}

defineExpose({resetValidation})
</script>

<template>
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
          <QToggle
            v-model="newCommission.isOpenToProjects"
            :label="t('commission.is-open-to-projects')"
            color="commission"
          />
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
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/dashboard";
@import "@/assets/styles/forms";
</style>
