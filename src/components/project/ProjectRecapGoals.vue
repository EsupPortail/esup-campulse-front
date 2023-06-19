<script lang="ts" setup>
import useSubmitProject from '@/composables/useSubmitProject'
import {useI18n} from 'vue-i18n'

const {projectGoals} = useSubmitProject()
const {t} = useI18n()
</script>

<template>
    <section class="flex-section">
        <div class="display-row">
            <p class="row-title">{{ t('project.goals-title') }}</p>
            <p>{{ projectGoals.goals }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.summary') }}</p>
            <p>{{ projectGoals.summary }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.planned-activities') }}</p>
            <p>{{ projectGoals.plannedActivities }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.prevention-safety') }}</p>
            <p>{{ projectGoals.preventionSafety }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.marketing-campaign') }}</p>
            <p>{{ projectGoals.marketingCampaign }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.sustainable-development') }}</p>
            <p>{{ projectGoals.sustainableDevelopment }}</p>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

.display-row {
    width: 100% !important;
}

.flex-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
}
</style>
