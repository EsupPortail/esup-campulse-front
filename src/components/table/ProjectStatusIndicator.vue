<script lang="ts" setup>
import type {ProjectStatus} from '#/project'
import {useI18n} from 'vue-i18n'
import {onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'

const props = defineProps<{
    showDraft: boolean,
    projectStatus: ProjectStatus
}>()

const {t} = useI18n()
const route = useRoute()

const spanClasses = ref('')

const initSpanClasses = () => {
    spanClasses.value = 'form-state' + ' ' + (route.name === 'Commission' ? 'form-state-cape' : '')
}

onMounted(initSpanClasses)

</script>

<template>
    <span
        v-if="props.projectStatus === 'PROJECT_DRAFT' && showDraft"
        :class="spanClasses"
    >
        {{ t('project.status.draft') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-grey"
        ><i class="bi bi-dash"></i></span>
    </span>
    <span
        v-if="props.projectStatus === 'PROJECT_REJECTED'"
        :class="spanClasses"
    >
        {{ t('project.status.rejected') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-red"
        ><i class="bi bi-x"></i></span>
    </span>
    <span
        v-if="props.projectStatus === 'PROJECT_PROCESSING'"
        :class="spanClasses"
    >
        {{ t('project.status.processing') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-orange"
        ><i class="bi bi-dash"></i></span>
    </span>
    <span
        v-if="props.projectStatus === 'PROJECT_VALIDATED'"
        :class="spanClasses"
    >
        {{ t('project.status.validated') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-green"
        ><i class="bi bi-check"></i></span>
    </span>
    <span
        v-if="props.projectStatus === 'PROJECT_REVIEW_DRAFT'"
        :class="spanClasses"
    >
        {{ t('project.status.review-draft') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-orange"
        ><i class="bi bi-dash"></i></span>
    </span>
    <span
        v-if="props.projectStatus === 'PROJECT_REVIEW_PROCESSING'"
        :class="spanClasses"
    >
        {{ t('project.status.review-processing') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-orange"
        ><i class="bi bi-dash"></i></span>
    </span>
    <span
        v-if="props.projectStatus === 'PROJECT_REVIEW_REJECTED'"
        :class="spanClasses"
    >
        {{ t('project.status.review-rejected') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-red"
        ><i class="bi bi-x"></i></span>
    </span>
    <span
        v-if="props.projectStatus === 'PROJECT_REVIEW_VALIDATED'"
        :class="spanClasses"
    >
        {{ t('project.status.archived') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-grey"
        ><i class="bi bi-check"></i></span>
    </span>
</template>

<style lang="sass" scoped>
@import '@/assets/_variables.scss'

.form-state-cape
    color: $capeColorText
</style>