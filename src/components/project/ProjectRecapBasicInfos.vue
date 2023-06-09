<script lang="ts" setup>
import useSubmitProject from '@/composables/useSubmitProject'
import {useI18n} from 'vue-i18n'

const {projectBasicInfos} = useSubmitProject()
const {t} = useI18n()
</script>

<template>
    <section class="flex-section">
        <div class="display-row">
            <p class="row-title">{{ t('project.name') }}</p>
            <p>{{ projectBasicInfos.name }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.planned-start-date') }}</p>
            <p>
                {{
                    projectBasicInfos.plannedStartDate.split('-').reverse().join('/')
                }}
            </p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.planned-end-date') }}</p>
            <p>{{ projectBasicInfos.plannedEndDate.split('-').reverse().join('/') }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.planned-location') }}</p>
            <p>{{ projectBasicInfos.plannedLocation }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.contact-first-name') }}</p>
            <p>{{ projectBasicInfos.contactFirstName }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.contact-last-name') }}</p>
            <p>{{ projectBasicInfos.contactLastName }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.contact-email') }}</p>
            <p>{{ projectBasicInfos.contactEmail }}</p>
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
