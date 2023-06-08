<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {onMounted, ref} from 'vue'
import type {ProjectStatus} from '#/project'
import router from '@/router'

const {t} = useI18n()

const props = defineProps<{
    project: number,
    projectStatus: ProjectStatus
}>()

interface Option {
    icon: 'bi-eye' | 'bi-check-lg',
    label: string,
    to?: { name: 'ProjectDetail' | 'ProjectReviewDetail', params: { projectId: number } }
}

const options = ref<Option[]>([])

const initOptions = () => {
    options.value = []
    options.value.push({
        icon: props.projectStatus === 'PROJECT_PROCESSING' ? 'bi-check-lg' : 'bi-eye',
        label: props.projectStatus === 'PROJECT_PROCESSING' ? t('project.validate') : t('project.view'),
        to: {name: 'ProjectDetail', params: {projectId: props.project}}
    })
    if (props.projectStatus === 'PROJECT_REVIEW_PROCESSING') {
        options.value.push({
            icon: 'bi-check-lg',
            label: t('project.validate-review'),
            to: {name: 'ProjectReviewDetail', params: {projectId: props.project}}
        })
    } else if (props.projectStatus === 'PROJECT_REVIEW_VALIDATED' || props.projectStatus === 'PROJECT_REVIEW_REJECTED') {
        options.value.push({
            icon: 'bi-eye',
            label: t('project.view-review'),
            to: {name: 'ProjectReviewDetail', params: {projectId: props.project}}
        })
    }
}

onMounted(initOptions)

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
                    @click="() => router.push(option.to)"
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