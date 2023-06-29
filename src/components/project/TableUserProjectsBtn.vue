<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {onMounted, ref, watch} from 'vue'
import type {ProjectStatus} from '#/project'
import router from '@/router'
import {useUserStore} from '@/stores/useUserStore'
import {useProjectStore} from '@/stores/useProjectStore'
import ProjectDelete from '@/components/project/ProjectDelete.vue'

const {t} = useI18n()
const userStore = useUserStore()
const projectStore = useProjectStore()

const props = defineProps<{
    project: number,
    projectStatus: ProjectStatus,
    association: number | null,
}>()

const canModifyProjectAndReview = ref<boolean>(false)

const initCanModifyProjectAndReview = () => {
    let perm = false
    if (props.association) {
        const projectAssociationUserId = projectStore.projects.find(x => x.id === props.project)?.associationUser
        const associationUserId = userStore.userAssociations.find(x => x.association.id === props.association)?.id
        if (userStore.hasPresidentStatus(props.association) || projectAssociationUserId === associationUserId) {
            perm = true
        }
    } else {
        perm = true
    }
    canModifyProjectAndReview.value = perm
}

interface Option {
    icon: 'bi-eye' | 'bi-pencil' | 'bi-trash',
    label: string,
    to?: {
        name: 'SubmitProjectAssociation' | 'SubmitProjectIndividual' | 'ProjectDetail' | 'SubmitProjectReview',
        params: { associationId?: number, projectId: number }
    },
    action?: 'delete'
}

const options = ref<Option[]>([])

const initOptions = () => {
    options.value = []
    initCanModifyProjectAndReview()
    if (props.projectStatus === 'PROJECT_DRAFT') {
        if (canModifyProjectAndReview.value) {
            options.value.push({
                icon: 'bi-pencil',
                label: t('project.modify'),
                to: props.association ? {
                    name: 'SubmitProjectAssociation',
                    params: {associationId: props.association, projectId: props.project}
                } :
                    {name: 'SubmitProjectIndividual', params: {projectId: props.project}}
            })
            options.value.push({
                icon: 'bi-trash',
                label: t('project.delete'),
                action: 'delete'
            })
        }
    }
    if (props.projectStatus !== 'PROJECT_DRAFT') {
        options.value.push({
            icon: 'bi-eye',
            label: t('project.view'),
            to: {name: 'ProjectDetail', params: {projectId: props.project}}
        })
    }
    if (props.projectStatus === 'PROJECT_REVIEW_DRAFT') {
        if (canModifyProjectAndReview.value) {
            options.value.push({
                icon: 'bi-pencil',
                label: t('project.modify-review'),
                to: {name: 'SubmitProjectReview', params: {projectId: props.project}}
            })
        }
    }
    if (props.projectStatus === 'PROJECT_REVIEW_PROCESSING' || props.projectStatus === 'PROJECT_REVIEW_VALIDATED'
        || props.projectStatus === 'PROJECT_REVIEW_REJECTED') {
        options.value.push({
            icon: 'bi-eye',
            label: t('project.view-review')
        })
    }
}

watch(() => userStore.user, initOptions)

onMounted(initOptions)

const openDelete = ref<boolean>(false)

function onOptionClick(option: Option) {
    if (option.to) router.push(option.to)
    else if (option.action) {
        if (option.action === 'delete') {
            openDelete.value = true
        }
    }
}

</script>

<template>
    <div class="q-pa-md">
        <QBtnDropdown
            v-if="options.length"
            :label="t('manage')"
            color="commission"
            outline
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
        <span
            v-else
            class="no-presidency"
        >{{ t('forbidden') }}</span>
    </div>
    <ProjectDelete
        :open-dialog="openDelete"
        :project="props.project"
        @close-dialog="openDelete = false"
    />
</template>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
@import '@/assets/styles/documents.scss';

.no-presidency {
    color: $textColor2;
}
</style>
