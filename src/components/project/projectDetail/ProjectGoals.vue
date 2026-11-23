<script lang="ts" setup>
import useProject from '@/composables/useProject'
import {useI18n} from 'vue-i18n'
import GlobalDefinition from '@/components/global/GlobalDefinition.vue'

const {projectGoals} = useProject()
const {t} = useI18n()

defineProps<{
  richText?: boolean
}>()
</script>

<template>
  <div class="flex-column">
    <GlobalDefinition
      :rich-text="richText"
      :title="t('project.goals')"
    >
      {{ projectGoals.goals }}
    </GlobalDefinition>

    <GlobalDefinition
      :rich-text="richText"
      :title="t('project.summary')"
    >
      {{ projectGoals.summary }}
    </GlobalDefinition>

    <GlobalDefinition
      :rich-text="richText"
      :title="t('project.planned-activities')"
    >
      {{ projectGoals.plannedActivities }}
    </GlobalDefinition>

    <GlobalDefinition
      :rich-text="richText"
      :title="t('project.prevention-safety')"
    >
      {{ projectGoals.preventionSafety }}
    </GlobalDefinition>

    <GlobalDefinition
      :rich-text="richText"
      :title="t('project.marketing-campaign')"
    >
      {{ projectGoals.marketingCampaign }}
    </GlobalDefinition>

    <GlobalDefinition
      :rich-text="richText"
      :title="t('project.sustainable-development')"
    >
      {{ projectGoals.sustainableDevelopment }}
    </GlobalDefinition>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms";
</style>
