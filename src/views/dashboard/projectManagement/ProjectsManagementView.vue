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
import type {SelectCommissionDateLabel} from '#/commissions'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {useUserStore} from '@/stores/useUserStore'
import ProjectStatusIndicator from '@/components/table/ProjectStatusIndicator.vue'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const projectStore = useProjectStore()
const {formatDate} = useUtility()
const {
    getCommissionDates,
    commissionDatesLabels,
    initCommissionDatesLabels,
    commissionDates,
    getCommissions
} = useCommissions()
const associationStore = useAssociationStore()
const userManagerStore = useUserManagerStore()
const userStore = useUserStore()


onMounted(async () => {
    loading.show()
    await onGetCommissionDates()
    initManagedCommissionDates()
    await onGetProjects(managedCommissionDates.value)
    await onGetApplicants()
    loading.hide()
})

const managedCommissionDates = ref<number[]>([])

const initManagedCommissionDates = () => {
    commissionDates.value.forEach((commissionDate) => {
        if (userStore.userCommissions?.includes(commissionDate.commission)) {
            managedCommissionDates.value.push(commissionDate.id)
        }
    })
}

const projects = ref<ProjectList[]>([])
watch(() => projectStore.projects, () => {
    projects.value = projectStore.projects
})

const commission = ref<SelectCommissionDateLabel>()
watch(() => commission.value, async () => {
    loading.show()
    if (commission.value?.value) {
        await onGetProjects([commission.value?.value])
    } else {
        await onGetProjects(managedCommissionDates.value)
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

async function onGetCommissionDates() {
    try {
        await getCommissions()
        await getCommissionDates(false, true, true)
        initCommissionDatesLabels(undefined)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onGetProjects(commissionsDates: number[]) {
    try {
        await projectStore.getProjects(false, commissionsDates)
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
                await associationStore.getAssociationNames(true, false)
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
    {name: 'edition', align: 'center', label: t('manage'), field: 'edition', sortable: false},
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
                                {{ formatDate(props.row.editionDate)?.split('-').reverse().join('/') }}
                            </QTd>
                            <QTd
                                key="status"
                                :props="props"
                                class="state-cell"
                            >
                                <ProjectStatusIndicator
                                    :project-status="props.row.projectStatus"
                                    :show-draft="false"
                                />
                            </QTd>
                            <QTd
                                key="edition"
                                :props="props"
                                class="actions-cell-compact"
                            >
                                <div class="button-container">
                                    <QBtn
                                        :label="t('project.project')"
                                        icon="bi-pencil"
                                    />
                                    <QBtn
                                        :disable="props.row.projectStatus !== 'PROJECT_VALIDATED' ||
                                            props.row.projectStatus !== 'PROJECT_REVIEW_DRAFT' ||
                                            props.row.projectStatus !== 'PROJECT_REVIEW_REJECTED' ||
                                            props.row.projectStatus !== 'PROJECT_REVIEW_PROCESSING' ||
                                            props.row.projectStatus !== 'PROJECT_REVIEW_VALIDATED'"
                                        :label="t('project.review')"
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
