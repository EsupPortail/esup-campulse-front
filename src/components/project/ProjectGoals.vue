<script lang="ts" setup>
import useProject from '@/composables/useProject'
import {useI18n} from 'vue-i18n'
import GlobalDefinition from '@/components/global/GlobalDefinition.vue'

const {projectGoals} = useProject()
const {t} = useI18n()
</script>

<template>
  <div class="flex-column">
    <GlobalDefinition :title="t('project.goals')">
      {{ projectGoals.goals }}
    </GlobalDefinition>

    <GlobalDefinition :title="t('project.summary')">
      {{ projectGoals.summary }}
    </GlobalDefinition>

    <GlobalDefinition :title="t('project.planned-activities')">
      {{ projectGoals.plannedActivities }}
    </GlobalDefinition>

    <GlobalDefinition :title="t('project.prevention-safety')">
      {{ projectGoals.preventionSafety }}
    </GlobalDefinition>

    <GlobalDefinition :title="t('project.marketing-campaign')">
      {{ projectGoals.marketingCampaign }}
    </GlobalDefinition>

    <GlobalDefinition :title="t('project.sustainable-development')">
      {{ projectGoals.sustainableDevelopment }}
    </GlobalDefinition>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
</style>
