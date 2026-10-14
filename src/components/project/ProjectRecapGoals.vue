<script lang="ts" setup>
import useProject from '@/composables/useProject'
import {useI18n} from 'vue-i18n'

const {projectGoals} = useProject()
const {t} = useI18n()
</script>

<template>
  <div class="flex-column">
    <div class="display-row">
      <h4>{{ t('project.goals') }}</h4>
      <p>{{ projectGoals.goals }}</p>
    </div>

    <div class="display-row">
      <h4>{{ t('project.summary') }}</h4>
      <p>{{ projectGoals.summary }}</p>
    </div>

    <div class="display-row">
      <h4>{{ t('project.planned-activities') }}</h4>
      <p>{{ projectGoals.plannedActivities }}</p>
    </div>

    <div class="display-row">
      <h4>{{ t('project.prevention-safety') }}</h4>
      <p>{{ projectGoals.preventionSafety }}</p>
    </div>

    <div class="display-row">
      <h4>{{ t('project.marketing-campaign') }}</h4>
      <p>{{ projectGoals.marketingCampaign }}</p>
    </div>

    <div class="display-row">
      <h4>{{ t('project.sustainable-development') }}</h4>
      <p>{{ projectGoals.sustainableDevelopment }}</p>
    </div>
  </div>
</template>

