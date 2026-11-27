<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import type {ProjectGoals} from '#/project'
import GlobalEditor from '@/components/global/GlobalEditor.vue'

const {t} = useI18n()

const projectGoals = defineModel<ProjectGoals>('projectGoals', {required: true})

const emit = defineEmits<{
  submit: [],
  back: []
}>()

const requiredRichText = (message: string) => (value: string): boolean | string =>
  value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().length > 0 || message
</script>

<template>
  <QForm
    class="flex-column"
    @submit.prevent="emit('submit')"
  >
    <GlobalEditor
      v-model="projectGoals.goals"
      :label="t('project.goals')"
      :rules="[requiredRichText(t('forms.required-project-goals'))]"
      color="commission"
      required
    />

    <GlobalEditor
      v-model="projectGoals.summary"
      :label="t('project.summary')"
      :rules="[requiredRichText(t('forms.required-project-summary'))]"
      color="commission"
      required
    />

    <GlobalEditor
      v-model="projectGoals.plannedActivities"
      :label="t('project.planned-activities')"
      :rules="[requiredRichText(t('forms.required-project-activities'))]"
      color="commission"
      required
    />

    <GlobalEditor
      v-model="projectGoals.preventionSafety"
      :label="t('project.prevention-safety')"
      :rules="[requiredRichText(t('forms.required-project-safety'))]"
      color="commission"
      required
    />

    <GlobalEditor
      v-model="projectGoals.marketingCampaign"
      :label="t('project.marketing-campaign')"
      :rules="[requiredRichText(t('forms.required-project-marketing'))]"
      color="commission"
      required
    />

    <GlobalEditor
      v-model="projectGoals.sustainableDevelopment"
      :label="t('project.sustainable-development')"
      :rules="[requiredRichText(t('forms.required-project-sustainable'))]"
      color="commission"
      required
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
