<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import type {ProjectGoals} from '#/project'

const {t} = useI18n()

const projectGoals = defineModel<ProjectGoals>('projectGoals', {required: true})

const emit = defineEmits<{
  submit: [],
  back: []
}>()
</script>

<template>
  <QForm
    class="flex-column"
    @submit.prevent="emit('submit')"
  >
    <QInput
      v-model="projectGoals.goals"
      :label="t('project.goals') + ' *'"
      :rules="[val => val && val.length > 0 || t('forms.required-project-goals')]"
      aria-required="true"
      color="commission"
      filled
      lazy-rules
      type="textarea"
    />

    <QInput
      v-model="projectGoals.summary"
      :label="t('project.summary') + ' *'"
      :rules="[val => val && val.length > 0 || t('forms.required-project-summary')]"
      aria-required="true"
      color="commission"
      filled
      lazy-rules
      type="textarea"
    />

    <QInput
      v-model="projectGoals.plannedActivities"
      :label="t('project.planned-activities') + ' *'"
      :rules="[val => val && val.length > 0 || t('forms.required-project-activities')]"
      aria-required="true"
      color="commission"
      filled
      lazy-rules
      type="textarea"
    />

    <QInput
      v-model="projectGoals.preventionSafety"
      :label="t('project.prevention-safety') + ' *'"
      :rules="[val => val && val.length > 0 || t('forms.required-project-safety')]"
      aria-required="true"
      color="commission"
      filled
      lazy-rules
      type="textarea"
    />

    <QInput
      v-model="projectGoals.marketingCampaign"
      :label="t('project.marketing-campaign') + ' *'"
      :rules="[val => val && val.length > 0 || t('forms.required-project-marketing')]"
      aria-required="true"
      color="commission"
      filled
      lazy-rules
      type="textarea"
    />

    <QInput
      v-model="projectGoals.sustainableDevelopment"
      :label="t('project.sustainable-development') + ' *'"
      :rules="[val => val && val.length > 0 || t('forms.required-project-sustainable')]"
      aria-required="true"
      color="commission"
      filled
      lazy-rules
      type="textarea"
    />

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
