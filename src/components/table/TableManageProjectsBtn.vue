<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {onMounted, ref} from 'vue'
import type {ProjectStatus} from '#/project'
import router from '@/router'
import useUserGroups from '@/composables/useUserGroups'
import useSecurity from '@/composables/useSecurity'
import ProjectUpdateDates from '@/components/project/ProjectUpdateDates.vue'

const {t} = useI18n()
const {isStaff} = useUserGroups()
const {hasPerm} = useSecurity()

const props = defineProps<{
    project: number,
    projectStatus: ProjectStatus
}>()

const updateProjectDates = ref<boolean>(false)

interface Option {
    icon: 'bi-eye' | 'bi-check-lg' | 'bi-calendar',
    label: string,
    to?: { name: 'ProjectDetail' | 'ProjectReviewDetail', params: { projectId: number } }
    action?: 'updateProjectDates'
}

const options = ref<Option[]>([])

const initOptions = () => {
    options.value = []
    options.value.push({
        icon: props.projectStatus === 'PROJECT_PROCESSING' ? 'bi-check-lg' : 'bi-eye',
        label: props.projectStatus === 'PROJECT_PROCESSING' ? t('project.validate') : t('project.view'),
        to: {name: 'ProjectDetail', params: {projectId: props.project}}
    })
    if (isStaff.value && hasPerm('change_project')) {
        options.value.push({
            icon: 'bi-calendar',
            label: t('project.edit-dates'),
            action: 'updateProjectDates'
        })
    }
    if (props.projectStatus === 'PROJECT_REVIEW_PROCESSING') {
        options.value.push({
            icon: 'bi-check-lg',
            label: t('project.validate-review'),
            to: {name: 'ProjectReviewDetail', params: {projectId: props.project}}
        })
    }
    if (props.projectStatus === 'PROJECT_REVIEW_VALIDATED' || props.projectStatus === 'PROJECT_REVIEW_REJECTED') {
        options.value.push({
            icon: 'bi-eye',
            label: t('project.view-review'),
            to: {name: 'ProjectReviewDetail', params: {projectId: props.project}}
        })
    }
}

onMounted(initOptions)

function onOptionClick(option: Option) {
    if (option.to) router.push(option.to)
    else if (option.action) {
        if (option.action === 'updateProjectDates') {
            updateProjectDates.value = true
        }
    }
}

</script>

<template>
    <div class="q-pa-md">
        <QBtnDropdown
            v-if="options.length"
            :label="t('manage')"
        >
            <QList>
                <QItem
                    v-for="(option, index) in options"
                    :key="index"
                    v-close-popup
                    clickable
                    @click="onOptionClick(option)"
                >
                    <QItemSection avatar>
                        <QAvatar
                            :icon="option.icon"
                        />
                    </QItemSection>
                    <QItemSection>
                        <QItemLabel>{{ option.label }}</QItemLabel>
                    </QItemSection>
                </QItem>
            </QList>
        </QBtnDropdown>
    </div>
    <ProjectUpdateDates
        :open-dialog="updateProjectDates"
        :project="props.project"
        @close-dialog="updateProjectDates = false"
    />
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';
@import '@/assets/_variables.scss';

.q-item {
    color: $capeColorText;
}

.no-presidency {
    color: $textColor2;
}
</style>