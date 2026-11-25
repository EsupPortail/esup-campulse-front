<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import type {SelectableLabel} from '#/global'

const {t} = useI18n()

const projectCommission = defineModel<number | null>('projectCommission', {required: true})
const projectCommissionFunds = defineModel<number[]>('projectCommissionFunds', {required: true})

defineProps<{
  commissionOptions: SelectableLabel[],
  fundOptions: SelectableLabel[]
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
    <div
      v-if="!commissionOptions.length"
      class="info-panel info-panel-warning"
    >
      <i
        aria-hidden="true"
        class="bi bi-info-circle"
      ></i>
      <p>{{ t('project.no-commission-available') }}</p>
    </div>

    <template v-else>
      <QField
        :label="t('project.commission-choice') + ' *'"
        :model-value="projectCommission"
        :rules="[val => val !== null || t('forms.select-project-commission-date')]"
        borderless
        color="commission"
        lazy-rules
      >
        <QOptionGroup
          v-model="projectCommission"
          :aria-label="t('project.commission-choice')"
          :options="commissionOptions"
          color="commission"
          name="projectCommission"
          role="radiogroup"
          type="radio"
          @update:model-value="emit('commissionChange')"
        />
        <template #hint>
          <p>{{ t('project.commission-choice-hint') }}</p>
        </template>
      </QField>

      <QField
        :label="t('project.commission-funds-choice') + ' *'"
        :model-value="projectCommissionFunds"
        :rules="[val => val.length || t('forms.select-project-commission-member')]"
        borderless
        color="commission"
        lazy-rules
        stack-label
      >
        <QOptionGroup
          v-model="projectCommissionFunds"
          :aria-label="t('project.commission-funds-choice')"
          :disable="projectCommission === null"
          :options="fundOptions"
          color="commission"
          name="projectCommissionFunds"
          role="group"
          type="checkbox"
        />
        <template #hint>
          <p>{{ t('project.commission-funds-choice-hint') }}</p>
        </template>
      </QField>
    </template>

    <div class="flex-row-center padding-top padding-bottom">
      <QBtn
        :label="t('back')"
        class="btn-lg"
        color="commission"
        icon="bi-chevron-left"
        @click="emit('back')"
      />
      <QBtn
        :disable="!commissionOptions.length"
        :label="t('continue')"
        class="btn-lg"
        color="commission"
        icon="bi-check2"
        type="submit"
      />
    </div>
  </QForm>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms";
@import "@/assets/_variables.scss";

.q-option-group {
  :deep(.q-radio__label),
  :deep(.q-checkbox__label) {
    font: inherit;
    color: $textColor1;
  }

  :deep(.q-radio__inner--truthy ~ .q-radio__label),
  :deep(.q-checkbox__inner--truthy ~ .q-checkbox__label) {
    color: $commissionColor;
  }

  :deep(.q-radio.disabled),
  :deep(.q-checkbox.disabled) {

    .q-radio__label,
    .q-checkbox__label,
    .q-radio__inner,
    .q-checkbox__inner {
      color: $textColor2;
    }
  }
}
</style>
