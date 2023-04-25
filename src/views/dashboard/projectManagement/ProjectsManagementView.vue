<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import axios from 'axios'
import {useProjectStore} from '@/stores/useProjectStore'
import type {ProjectList} from '#/project'
import useUtility from '@/composables/useUtility'
import useCommissions from '@/composables/useCommissions'
import useSecurity from '@/composables/useSecurity'
import type {SelectCommissionDateLabel} from '#/commissions'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useUserManagerStore} from '@/stores/useUserManagerStore'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const projectStore = useProjectStore()
const {formatDate} = useUtility()
const {getCommissionDates, commissionDatesLabels, initCommissionDates} = useCommissions()
const {hasPerm} = useSecurity()
const associationStore = useAssociationStore()
const userManagerStore = useUserManagerStore()


onMounted(async () => {
    loading.show()
    await onGetProjects()
    await onGetApplicants()
    await onGetCommissionDates()
    loading.hide()
})

const projects = ref<ProjectList[]>([])
watch(() => projectStore.projects, () => {
    projects.value = projectStore.projects
})

const commission = ref<SelectCommissionDateLabel>()
watch(() => commission.value, async () => {
    loading.show()
    if (commission.value?.value) {
        await onGetProjectCommissionDates(commission.value?.value)
        if (projectStore.projects.length) {
            projects.value = []
            const commissionProjects = projectStore.projectCommissionDates.map(project => project.project)
            projectStore.projects.forEach((project) => {
                if (commissionProjects.includes(project.id)) {
                    projects.value.push(project)
                }
            })
        }
    } else {
        projects.value = projectStore.projects
    }
    loading.hide()
})

const applicant = (association: number | null, user: number | null) => {
    if (association) {
        return associationStore.associationNames.find(obj => obj.id === association)?.name
    } else {
        const userObj = userManagerStore.users.find(obj => obj.id === user)
        return `${userObj?.firstName} ${userObj?.lastName}`
    }
}

async function onGetProjects() {
    try {
        await projectStore.getProjects()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onGetCommissionDates() {
    try {
        await getCommissionDates(false, true)
        await initCommissionDates(hasPerm('view_project_any_commission'))
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onGetProjectCommissionDates(commissionDate: number) {
    try {
        await projectStore.getProjectCommissionDates(true, commissionDate)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onGetApplicants() {
    try {
        if (projectStore.projects.length) {
            if (projectStore.projects.find(obj => obj.association !== null)) {
                await associationStore.getAssociationNames(false, false)
            }
            if (projectStore.projects.find(obj => obj.user !== null)) {
                await userManagerStore.getUsers('validated')
            }
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

const columns: QTableProps['columns'] = [
    {name: 'name', align: 'left', label: t('project.name'), field: 'name', sortable: true},
    {name: 'applicant', align: 'left', label: t('project.applicant'), field: 'applicant', sortable: true},
    {name: 'lastModifiedDate', align: 'left', label: t('project.last-modified-date'), field: 'email', sortable: true},
    {name: 'status', align: 'left', label: t('status'), field: 'status', sortable: true},
    {name: 'edition', align: 'left', label: t('manage'), field: 'edition', sortable: false},
]

</script>

<template>
    <section class="dashboard-section">
        <div class="form-container">
            <div class="form">
                <h3 class="section-title">
                    <i
                        aria-hidden="true"
                        class="bi bi-card-text"
                    ></i>
                    {{ t('commission.select-date') }}
                </h3>
                <QSelect
                    v-model="commission"
                    :label="t('commissions')"
                    :options="commissionDatesLabels"
                    clearable
                    filled
                />
                <QTable
                    :columns="columns"
                    :loading="!projects"
                    :rows="projects"
                    :rows-per-page-options="[10, 20, 50, 0]"
                    :title="t('project.list')"
                    row-key="name"
                >
                    <template v-slot:body="props">
                        <QTr :props="props">
                            <QTd
                                key="name"
                                :props="props"
                            >
                                {{ props.row.name }}
                            </QTd>
                            <QTd
                                key="applicant"
                                :props="props"
                            >
                                {{ applicant(props.row.association, props.row.user) }}
                            </QTd>
                            <QTd
                                key="lastModifiedDate"
                                :props="props"
                            >
                                {{ formatDate(props.row.editionDate).split('-').reverse().join('/') }}
                            </QTd>
                            <QTd
                                key="status"
                                :props="props"
                                class="state-cell"
                            >
                                <span
                                    v-if="props.row.projectStatus === 'PROJECT_REJECTED'"
                                    class="form-state"
                                >
                                    {{ t('project.status.rejected') }}
                                    <span
                                        aria-hidden="true"
                                        class="form-state-icon form-state-red"
                                    ><i class="bi bi-x"></i></span>
                                </span>
                                <span
                                    v-if="props.row.projectStatus === 'PROJECT_PROCESSING'"
                                    class="form-state"
                                >
                                    {{ t('project.status.processing') }}
                                    <span
                                        aria-hidden="true"
                                        class="form-state-icon form-state-orange"
                                    ><i class="bi bi-dash"></i></span>
                                </span>
                                <span
                                    v-if="props.row.projectStatus === 'PROJECT_VALIDATED'"
                                    class="form-state"
                                >
                                    {{ t('project.status.validated') }}
                                    <span
                                        aria-hidden="true"
                                        class="form-state-icon form-state-green"
                                    ><i class="bi bi-check"></i></span>
                                </span>
                                <span
                                    v-if="props.row.projectStatus === 'PROJECT_REVIEW_DRAFT' ||
                                        props.row.projectStatus === 'PROJECT_REVIEW_PROCESSING'"
                                    class="form-state"
                                >
                                    {{ t('project.status.review-processing') }}
                                    <span
                                        aria-hidden="true"
                                        class="form-state-icon form-state-orange"
                                    ><i class="bi bi-dash"></i></span>
                                </span>
                                <span
                                    v-if="props.row.projectStatus === 'PROJECT_REVIEW_REJECTED'"
                                    class="form-state"
                                >
                                    {{ t('project.status.review-rejected') }}
                                    <span
                                        aria-hidden="true"
                                        class="form-state-icon form-state-red"
                                    ><i class="bi bi-x"></i></span>
                                </span>
                                <span
                                    v-if="props.row.projectStatus === 'PROJECT_REVIEW_VALIDATED'"
                                    class="form-state"
                                >
                                    {{ t('project.status.archived') }}
                                    <span
                                        aria-hidden="true"
                                        class="form-state-icon form-state-grey"
                                    ><i class="bi bi-check"></i></span>
                                </span>
                            </QTd>
                            <QTd
                                key="edition"
                                :props="props"
                                class="actions-cell-compact"
                            >
                                <div class="button-container">
                                    <QBtn
                                        :label="t('project.project')"
                                        disable
                                        icon="bi-pencil"
                                    />
                                    <QBtn
                                        :label="t('project.review')"
                                        disable
                                        icon="bi-pencil"
                                    />
                                </div>
                            </QTd>
                        </QTr>
                    </template>
                </QTable>
            </div>
        </div>
    </section>
</template>

<style lang="scss">
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';
</style>
