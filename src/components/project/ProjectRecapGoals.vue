<script lang="ts" setup>
import useSubmitProject from '@/composables/useSubmitProject'
import {useI18n} from 'vue-i18n'

const {projectGoals} = useSubmitProject()
const {t} = useI18n()
</script>

<template>
    <div class="flex-column">
        <div class="display-row">
            <h4 data-test="row-title">{{ t('project.goals-title') }}</h4>
            <p>{{ projectGoals.goals }}</p>
        </div>

        <div class="display-row">
            <h4 data-test="row-title">{{ t('project.summary') }}</h4>
            <p>{{ projectGoals.summary }}</p>
        </div>

        <div class="display-row">
            <h4 data-test="row-title">{{ t('project.planned-activities') }}</h4>
            <p>{{ projectGoals.plannedActivities }}</p>
        </div>

        <div class="display-row">
            <h4 data-test="row-title">{{ t('project.prevention-safety') }}</h4>
            <p>{{ projectGoals.preventionSafety }}</p>
        </div>

        <div class="display-row">
            <h4 data-test="row-title">{{ t('project.marketing-campaign') }}</h4>
            <p>{{ projectGoals.marketingCampaign }}</p>
        </div>

        <div class="display-row">
            <h4 data-test="row-title">{{ t('project.sustainable-development') }}</h4>
            <p>{{ projectGoals.sustainableDevelopment }}</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

/*.display-row {
  width: $fullSize !important;
}

.flex-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
}*/
</style>
