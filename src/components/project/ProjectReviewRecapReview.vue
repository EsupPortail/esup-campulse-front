<script lang="ts" setup>
import useSubmitReview from '@/composables/useSubmitReview'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const {projectReview} = useSubmitReview()
</script>

<template>
    <div class="flex-column">
        <div class="display-row">
            <p class="row-title">{{ t('project.review') }}</p>
            <p>{{ projectReview.review }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.impact-students') }}</p>
            <p>{{ projectReview.impactStudents }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.description') }}</p>
            <p>{{ projectReview.description }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.difficulties') }}</p>
            <p>{{ projectReview.difficulties }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.improvements') }}</p>
            <p>{{ projectReview.improvements }}</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
</style>
