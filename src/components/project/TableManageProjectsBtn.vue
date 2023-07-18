<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {onMounted, ref} from 'vue'
import type {ProjectCommissionFund, ProjectStatus} from '#/project'
import router from '@/router'
import useUserGroups from '@/composables/useUserGroups'
import useSecurity from '@/composables/useSecurity'
import ProjectUpdateDates from '@/components/project/ProjectUpdateDates.vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useProjectStore} from '@/stores/useProjectStore'
import useErrors from '@/composables/useErrors'
import ProjectChangeCommission from '@/components/project/ProjectChangeCommission.vue'
import useCommissions from '@/composables/useCommissions'
import {useUserStore} from '@/stores/useUserStore'

const {t} = useI18n()
const {isStaff} = useUserGroups()
const {hasPerm} = useSecurity()
const {notify, loading} = useQuasar()
const projectStore = useProjectStore()
const {catchHTTPError} = useErrors()
const {commissionFunds, funds} = useCommissions()
const userStore = useUserStore()

const props = defineProps<{
    projectId: number,
    projectName: string,
    projectStatus: ProjectStatus,
    isSite: boolean,
    projectCommissionFunds: ProjectCommissionFund[]
}>()

const emit = defineEmits(['refreshProjects'])

const updateProjectDates = ref<boolean>(false)
const changeCommission = ref<boolean>(false)


interface Option {
    icon: 'bi-eye' | 'bi-check-lg' | 'bi-calendar' | 'bi-filetype-pdf' | 'bi-signpost',
    label: string,
    to?: { name: 'ViewProject' | 'ManageProject' | 'ProjectReviewDetail', params: { projectId: number } }
    action?: 'updateProjectDates' | 'download-pdf' | 'changeCommission'
}

const canChangeProject = () => {
    let perm = false
    const institutions: number[] = []
    console.log(props.projectCommissionFunds)
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

    // View project
    options.value.push({
        icon: 'bi-eye',
        label: t('project.view'),
        to: {name: 'ViewProject', params: {projectId: props.projectId}}
    })

    // Manage project
    if (props.projectStatus === 'PROJECT_PROCESSING' && isStaff.value && hasPerm('change_project') && canChangeProject()) {
        options.value.push({
            icon: 'bi-check-lg',
            label: t('project.process'),
            to: {name: 'ManageProject', params: {projectId: props.projectId}}
        })
    }

    // Update project dates
    if (isStaff.value && hasPerm('change_project')) {
        options.value.push({
            icon: 'bi-calendar',
            label: t('project.edit-dates'),
            action: 'updateProjectDates'
        })
    }

    // Change commission
    if (props.projectStatus === 'PROJECT_PROCESSING' || props.projectStatus === 'PROJECT_VALIDATED') {
        options.value.push({
            icon: 'bi-signpost',
            label: t('project.change-commission'),
            action: 'changeCommission'
        })
    }

    // View review
    if (props.projectStatus === 'PROJECT_REVIEW_VALIDATED' || props.projectStatus === 'PROJECT_REVIEW_CANCELLED') {
        options.value.push({
            icon: 'bi-eye',
            label: t('project.view-review'),
            to: {name: 'ProjectReviewDetail', params: {projectId: props.projectId}}
        })
    }

    // Manage review
    if (props.projectStatus === 'PROJECT_REVIEW_PROCESSING' && isStaff.value && hasPerm('change_project') && canChangeProject()) {
        options.value.push({
            icon: 'bi-check-lg',
            label: t('project.process-review'),
            to: {name: 'ProjectReviewDetail', params: {projectId: props.projectId}}
        })
    }

    // Download PDF
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
        } else if (option.action === 'changeCommission') {
            changeCommission.value = true
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
</template>