<script lang="ts" setup>
import useProject from '@/composables/useProject'
import {useI18n} from 'vue-i18n'

const {projectGoals} = useProject()
const {t} = useI18n()
</script>

<template>
  <div class="flex-column">
    <div class="display-row">
      <h5>{{ t('project.goals') }}</h5>
      <p>{{ projectGoals.goals }}</p>
    </div>

    <div class="display-row">
      <h5>{{ t('project.summary') }}</h5>
      <p>{{ projectGoals.summary }}</p>
    </div>

    <div class="display-row">
      <h5>{{ t('project.planned-activities') }}</h5>
      <p>{{ projectGoals.plannedActivities }}</p>
    </div>

    <div class="display-row">
      <h5>{{ t('project.prevention-safety') }}</h5>
      <p>{{ projectGoals.preventionSafety }}</p>
    </div>

    <div class="display-row">
      <h5>{{ t('project.marketing-campaign') }}</h5>
      <p>{{ projectGoals.marketingCampaign }}</p>
    </div>

    <div class="display-row">
      <h5>{{ t('project.sustainable-development') }}</h5>
      <p>{{ projectGoals.sustainableDevelopment }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
</style>
