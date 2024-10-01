<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {onMounted, ref, watch} from 'vue'
import type {ProjectCommissionFund, ProjectStatus} from '#/project'
import router from '@/router'
import useSecurity from '@/composables/useSecurity'
import ProjectUpdateDates from '@/components/project/ProjectUpdateDates.vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useProjectStore} from '@/stores/useProjectStore'
import useErrors from '@/composables/useErrors'
import ProjectEditCommissionFundsAmounts from '@/components/project/ProjectEditAmountsEarned.vue'
import ProjectChangeCommission from '@/components/project/ProjectChangeCommission.vue'
import useCommissions from '@/composables/useCommissions'
import useDocumentUploads from '@/composables/useDocumentUploads'
import {useUserStore} from '@/stores/useUserStore'

const {t} = useI18n()
const {hasPerm} = useSecurity()
const {notify, loading} = useQuasar()
const projectStore = useProjectStore()
const {catchHTTPError} = useErrors()
const {commissionFunds, funds} = useCommissions()
const userStore = useUserStore()
const {createUploadedFileLink} = useDocumentUploads()

const props = defineProps<{
    projectId: number,
    projectName: string,
    projectStatus: ProjectStatus,
    isSite: boolean | undefined,
    projectCommissionFunds: ProjectCommissionFund[],
    budgetFile: string | null,
}>()

const emit = defineEmits(['refreshProjects'])

const updateProjectDates = ref<boolean>(false)
const editCommissionFundsAmounts = ref<boolean>(false)
const changeCommission = ref<boolean>(false)


interface Option {
    icon: 'bi-eye' | 'bi-cash-stack' | 'bi-check-lg' | 'bi-calendar' | 'bi-filetype-pdf' | 'bi-file-earmark-zip' | 'bi-signpost' | 'bi-piggy-bank',
    label: string,
    to?: {
        name: 'ViewProject' | 'ManageProject' | 'ViewProjectReview' | 'ManageProjectReview',
        params: { projectId: number }
    }
    action?: 'updateProjectDates' | 'download-pdf' | 'download-review-pdf' | 'download-budget' | 'download-files' | 'changeCommission' | 'editCommissionFundsAmounts'
}

const canChangeProject = () => {
    let perm = false
    const institutions: number[] = []
    props.projectCommissionFunds.forEach(projectCommissionFund => {
        const commissionFund = commissionFunds.value.find(obj => obj.id === projectCommissionFund.commissionFund)
        const fund = funds.value.find(obj => obj.id === commissionFund?.fund)
        if (fund) institutions.push(fund.institution)
    })
    userStore.user?.groups.forEach(group => {
        if (group && group.institutionId && institutions.includes(group.institutionId)) perm = true
    })
    return perm
}

const options = ref<Option[]>([])

const initOptions = () => {
    options.value = []

    // Manage project
    if (props.projectStatus === 'PROJECT_PROCESSING' &&
        hasPerm('change_project_as_validator') && canChangeProject()) {
        options.value.push({
            icon: 'bi-check-lg',
            label: t('project.process'),
            to: {name: 'ManageProject', params: {projectId: props.projectId}}
        })
    }

    if ((props.projectStatus !== 'PROJECT_DRAFT')) {
        // View project
        options.value.push({
            icon: 'bi-eye',
            label: t('project.view'),
            to: {name: 'ViewProject', params: {projectId: props.projectId}}
        })

        // Download project budget file
        options.value.push({
            icon: 'bi-cash-stack',
            label: t('project.download-budget'),
            action: 'download-budget'
        })

        // Download project files
        options.value.push({
            icon: 'bi-file-earmark-zip',
            label: t('project.download-files'),
            action: 'download-files'
        })

        // Download project pdf
        options.value.push({
            icon: 'bi-filetype-pdf',
            label: t('project.download-recap'),
            action: 'download-pdf'
        })
    }

    // Give money $$$
    if (props.projectStatus === 'PROJECT_VALIDATED' &&
        hasPerm('change_projectcommissionfund_as_validator')) {
        options.value.push({
            icon: 'bi-piggy-bank',
            label: t('project.edit-commission-funds-amounts'),
            action: 'editCommissionFundsAmounts'
        })
    }

    // Update project dates
    if ((props.projectStatus === 'PROJECT_DRAFT_PROCESSED' ||
            props.projectStatus === 'PROJECT_PROCESSING' ||
            props.projectStatus === 'PROJECT_VALIDATED' ||
            props.projectStatus === 'PROJECT_REVIEW_DRAFT' ||
            props.projectStatus === 'PROJECT_REVIEW_PROCESSING') &&
        hasPerm('change_project_as_validator')) {
        options.value.push({
            icon: 'bi-calendar',
            label: t('project.edit-dates'),
            action: 'updateProjectDates'
        })
    }

    // Change commission
    if ((props.projectStatus === 'PROJECT_PROCESSING' ||
            props.projectStatus === 'PROJECT_VALIDATED') &&
        hasPerm('change_projectcommissionfund_as_validator')) {
        options.value.push({
            icon: 'bi-signpost',
            label: t('project.change-commission'),
            action: 'changeCommission'
        })
    }

    // Manage review
    if (props.projectStatus === 'PROJECT_REVIEW_PROCESSING' &&
        hasPerm('change_project_as_validator') && canChangeProject()) {
        options.value.push({
            icon: 'bi-check-lg',
            label: t('project.process-review'),
            to: {name: 'ManageProjectReview', params: {projectId: props.projectId}}
        })
    }


    if (props.projectStatus === 'PROJECT_REVIEW_PROCESSING' || props.projectStatus === 'PROJECT_REVIEW_VALIDATED'
        || props.projectStatus === 'PROJECT_CANCELED') {
        // View review
        options.value.push({
            icon: 'bi-eye',
            label: t('project.view-review'),
            to: {name: 'ViewProjectReview', params: {projectId: props.projectId}}
        })

        // Download review pdf
        options.value.push({
            icon: 'bi-filetype-pdf',
            label: t('project.download-review-recap'),
            action: 'download-review-pdf'
        })
    }
}

onMounted(initOptions)
watch(() => props.projectId, initOptions)

async function onOptionClick(option: Option) {
    if (option.to) await router.push(option.to)
    else if (option.action) {
        if (option.action === 'updateProjectDates') {
            updateProjectDates.value = true
        } else if (option.action === 'changeCommission') {
            changeCommission.value = true
        } else if (option.action === 'download-pdf') {
            await onGetProjectPdf(props.projectId, props.projectName, false)
        } else if (option.action === 'download-review-pdf') {
            await onGetProjectPdf(props.projectId, props.projectName, true)
        } else if (option.action === 'download-budget') {
            await onGetProjectBudget(props.budgetFile, props.projectName)
        } else if (option.action === 'download-files') {
            await onGetProjectFiles(props.projectId, props.projectName)
        } else {
            editCommissionFundsAmounts.value = true
        }
    }
}

async function onGetProjectPdf(projectId: number, projectName: string, isReview: boolean) {
    loading.show()
    try {
        const file = !isReview ? await projectStore.getProjectPdf(projectId) : await projectStore.getProjectReviewPdf(projectId)
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
                message: await catchHTTPError(error.response)
            })
        }
    }
    loading.hide()
}

async function onGetProjectBudget(budgetFile: string | null, projectName: string) {
    loading.show()
    if (budgetFile) {
        try {
            await createUploadedFileLink(budgetFile as string, `${t('project.document-budget')}${projectName}`)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: await catchHTTPError(error.response)
                })
            }
        }
    }
    loading.hide()
}

async function onGetProjectFiles(projectId: number, projectName: string) {
    loading.show()
    try {
        const file = await projectStore.getProjectFiles(projectId)
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(new Blob([file]))
        link.download = `${t('project.documents-name')}${encodeURI(projectName)}.zip`
        document.body.appendChild(link)
        link.click()
        link.remove()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
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
                        <QAvatar :icon="option.icon"/>
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
        :project="props.projectId"
        @close-dialog="updateProjectDates = false"
        @refresh-projects="emit('refreshProjects')"
    />
    <ProjectChangeCommission
        :is-site="props.isSite"
        :open-dialog="changeCommission"
        :project="props.projectId"
        @close-dialog="changeCommission = false"
        @refresh-projects="emit('refreshProjects')"
    />
    <ProjectEditCommissionFundsAmounts
        :open-dialog="editCommissionFundsAmounts"
        :project="props.projectId"
        :project-commission-funds="props.projectCommissionFunds"
        :project-name="props.projectName"
        @close-dialog="editCommissionFundsAmounts = false"
        @refresh-projects="emit('refreshProjects')"
    />
</template>
