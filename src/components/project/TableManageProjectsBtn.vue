<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {onMounted, ref} from 'vue'
import type {ProjectStatus} from '#/project'
import router from '@/router'
import useUserGroups from '@/composables/useUserGroups'
import useSecurity from '@/composables/useSecurity'
import ProjectUpdateDates from '@/components/project/ProjectUpdateDates.vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useProjectStore} from '@/stores/useProjectStore'
import useErrors from '@/composables/useErrors'

const {t} = useI18n()
const {isStaff} = useUserGroups()
const {hasPerm} = useSecurity()
const {notify, loading} = useQuasar()
const projectStore = useProjectStore()
const {catchHTTPError} = useErrors()

const props = defineProps<{
    projectId: number,
    projectName: string,
    projectStatus: ProjectStatus
}>()

const emit = defineEmits(['refreshProjects'])

const updateProjectDates = ref<boolean>(false)

interface Option {
    icon: 'bi-eye' | 'bi-check-lg' | 'bi-calendar' | 'bi-filetype-pdf',
    label: string,
    to?: { name: 'ProjectDetail' | 'ProjectReviewDetail', params: { projectId: number } }
    action?: 'updateProjectDates' | 'download-pdf'
}

const options = ref<Option[]>([])

const initOptions = () => {
    options.value = []
    options.value.push({
        icon: props.projectStatus === 'PROJECT_PROCESSING' ? 'bi-check-lg' : 'bi-eye',
        label: props.projectStatus === 'PROJECT_PROCESSING' ? t('project.process') : t('project.view'),
        to: {name: 'ProjectDetail', params: {projectId: props.projectId}}
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
            label: t('project.process-review'),
            to: {name: 'ProjectReviewDetail', params: {projectId: props.projectId}}
        })
    }
    if (props.projectStatus === 'PROJECT_REVIEW_VALIDATED' || props.projectStatus === 'PROJECT_REVIEW_CANCELLED') {
        options.value.push({
            icon: 'bi-eye',
            label: t('project.view-review'),
            to: {name: 'ProjectReviewDetail', params: {projectId: props.projectId}}
        })
    }
    options.value.push({
        icon: 'bi-filetype-pdf',
        label: t('project.download-recap'),
        action: 'download-pdf'
    })
}

onMounted(initOptions)

async function onOptionClick(option: Option) {
    if (option.to) await router.push(option.to)
    else if (option.action) {
        if (option.action === 'updateProjectDates') {
            updateProjectDates.value = true
        } else if (option.action === 'download-pdf') {
            await onGetProjectPdf(props.projectId, props.projectName)
        }
    }
}

async function onGetProjectPdf(projectId: number, projectName: string) {
    loading.show()
    try {
        const file = await projectStore.getProjectPdf(projectId)
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(new Blob([file]))
        link.download = `${t('project.pdf-name')}${encodeURI(projectName)}.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
    loading.hide()
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
    </div>
    <ProjectUpdateDates
        :open-dialog="updateProjectDates"
        :project="props.project"
        @close-dialog="updateProjectDates = false"
        @refresh-projects="emit('refreshProjects')"
    />
</template>