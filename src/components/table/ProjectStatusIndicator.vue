<script lang="ts" setup>
import type {ProjectStatus} from '#/project'
import {useI18n} from 'vue-i18n'

const props = defineProps<{
    showDraft: boolean,
    projectStatus: ProjectStatus
}>()

const {t} = useI18n()
</script>

<template>
    <span
        v-if="props.projectStatus === 'PROJECT_DRAFT' && showDraft"
        class="form-state"
    >
        {{ t('project.status.draft') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-grey"
        ><i class="bi bi-dash"></i></span>
    </span>
    <span
        v-if="props.projectStatus === 'PROJECT_REJECTED'"
        class="form-state"
    >
        {{ t('project.status.rejected') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-red"
        ><i class="bi bi-x"></i></span>
    </span>
    <span
        v-if="props.projectStatus === 'PROJECT_PROCESSING'"
        class="form-state"
    >
        {{ t('project.status.processing') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-orange"
        ><i class="bi bi-dash"></i></span>
    </span>
    <span
        v-if="props.projectStatus === 'PROJECT_VALIDATED'"
        class="form-state"
    >
        {{ t('project.status.validated') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-green"
        ><i class="bi bi-check"></i></span>
    </span>
    <span
        v-if="props.projectStatus === 'PROJECT_REVIEW_DRAFT' ||
            props.projectStatus === 'PROJECT_REVIEW_PROCESSING'"
        class="form-state"
    >
        {{ t('project.status.review-processing') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-orange"
        ><i class="bi bi-dash"></i></span>
    </span>
    <span
        v-if="props.projectStatus === 'PROJECT_REVIEW_REJECTED'"
        class="form-state"
    >
        {{ t('project.status.review-rejected') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-red"
        ><i class="bi bi-x"></i></span>
    </span>
    <span
        v-if="props.projectStatus === 'PROJECT_REVIEW_VALIDATED'"
        class="form-state"
    >
        {{ t('project.status.archived') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-grey"
        ><i class="bi bi-check"></i></span>
    </span>
</template>