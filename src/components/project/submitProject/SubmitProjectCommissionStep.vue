<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import type {SelectLabel} from '#/global'

const {t} = useI18n()

const projectCommission = defineModel<number | null>('projectCommission', {required: true})
const projectCommissionFunds = defineModel<number[]>('projectCommissionFunds', {required: true})

const props = defineProps<{
  commissionLabels: SelectLabel[],
  fundsLabels: SelectLabel[]
}>()

const emit = defineEmits<{
  submit: [],
  back: [],
  commissionChange: []
}>()
</script>

<template>
  <QForm
    class="flex-column"
    @submit.prevent="emit('submit')"
  >
    <QSelect
      v-model="projectCommission"
      :label="t('project.commission-choice') + ' *'"
      :options="props.commissionLabels"
      :rules="[val => val !== null || t('forms.select-project-commission-date')]"
      clearable
      color="commission"
      emit-value
      filled
      for="projectCommission"
      lazy-rules
      map-options
      @update:model-value="emit('commissionChange')"
    >
      <template #hint>
        <p aria-describedby="projectCommission">
          {{ t('project.commission-choice-hint') }}
        </p>
      </template>
    </QSelect>

    <QSelect
      v-model="projectCommissionFunds"
      :label="t('project.commission-funds-choice') + ' *'"
      :options="props.fundsLabels"
      :readonly="projectCommission === null"
      :rules="[val => val.length || t('forms.select-project-commission-member')]"
      clearable
      color="commission"
      emit-value
      filled
      for="projectCommissionFunds"
      lazy-rules
      map-options
      multiple
      stack-label
      use-chips
    >
      <template #hint>
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
        icon="bi-chevron-left"
        @click="emit('back')"
      />
      <QBtn
        :label="t('continue')"
        class="btn-lg"
        color="commission"
        icon="bi-check2"
        type="submit"
      />
    </div>
  </QForm>
</template>
