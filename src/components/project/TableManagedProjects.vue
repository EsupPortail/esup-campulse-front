<script lang="ts" setup>
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useUtility from '@/composables/useUtility'
import ProjectStatusIndicator from '@/components/project/ProjectStatusIndicator.vue'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import type {ProjectList} from '#/project'
import axios from 'axios'
import {useProjectStore} from '@/stores/useProjectStore'
import useErrors from '@/composables/useErrors'
import {onMounted, ref, watch} from 'vue'
import TableManageProjectsBtn from '@/components/project/TableManageProjectsBtn.vue'
import ProjectFundValidationIndicator from '@/components/project/ProjectFundValidationIndicator.vue'
import useCommissions from '@/composables/useCommissions'
import CommissionExport from '@/components/commissions/CommissionExport.vue'


const {t} = useI18n()
const {formatDate} = useUtility()
const associationStore = useAssociationStore()
const userManagerStore = useUserManagerStore()
const projectStore = useProjectStore()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {getFunds, getCommissionFunds} = useCommissions()

const props = defineProps<{
    commissionId: number,
    commissionName: string,
    projectStatus: 'all' | 'validated' | 'archived',
    title: string,
    flat: boolean
}>()

const isLoaded = ref<boolean>(false)

const projects = ref<ProjectList[]>([])

const selected = ref<QTableProps['selected']>([])

const applicant = (association: number | null, user: number | null) => {
    if (association) {
        const obj = associationStore.associations.find(x => x.id === association)
        if (obj) return obj.name
    } else {
        const userObj = userManagerStore.users.find(obj => obj.id === user)
        if (userObj) return `${userObj.firstName} ${userObj.lastName}`
    }
}

const isSite = (association: number | null) => {
    if (!association) return false
    const obj = associationStore.associations.find(x => x.id === association)
    if (obj) return obj.isSite
}

const initProjects = () => {
    if (props.projectStatus === 'validated') {
        projects.value = projectStore.managedProjects.filter(obj => obj.projectStatus === 'PROJECT_VALIDATED'
            || obj.projectStatus === 'PROJECT_REVIEW_PROCESSING' || obj.projectStatus === 'PROJECT_REVIEW_VALIDATED')
    } else if (props.projectStatus === 'archived') {
        projects.value = projectStore.managedProjects.filter(obj => obj.projectStatus === 'PROJECT_REJECTED'
            || obj.projectStatus === 'PROJECT_CANCELLED' || obj.projectStatus === 'PROJECT_REVIEW_VALIDATED')
    } else {
        projects.value = projectStore.managedProjects
    }
}

watch(() => projectStore.managedProjects, initProjects)

onMounted(async () => {
    loading.show()
    await onGetProjects()
    await onGetApplicants()
    initProjects()
    isLoaded.value = true
    loading.hide()
})

async function onGetProjects() {
    try {
        await projectStore.getManagedProjects(props.commissionId)
        await projectStore.getProjectCommissionFunds(true, props.commissionId)
        await getCommissionFunds()
        await getFunds()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}

async function onGetApplicants() {
    try {
        if (projectStore.managedProjects.length) {
            if (projectStore.managedProjects.find(obj => obj.association !== null)) {
                await associationStore.getAssociations(false)
            }
            if (projectStore.managedProjects.find(obj => obj.user !== null)) {
                await userManagerStore.getUsers('validated')
            }
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}

const columns: QTableProps['columns'] = [
    {
        name: 'id',
        align: 'left',
        label: t('project.id'),
        field: row => row.manualIdentifier,
        sortable: true,
        format: val => `${val}`
    },
    {name: 'name', align: 'left', label: t('project.name'), field: 'name', sortable: true},
    {
        name: 'applicant',
        align: 'left',
        label: t('project.applicant'),
        field: row => applicant(row.association, row.user),
        sortable: true,
        format: val => `${val}`
    },
    {
        name: 'lastModifiedDate',
        align: 'left',
        label: t('project.last-modified-date'),
        field: row => row.editionDate,
        sortable: true,
        format: val => `${val}`
    },
    {name: 'funds', align: 'right', label: t('commission.funds'), field: 'funds', sortable: true},
    {
        name: 'status',
        align: 'right',
        label: t('status'),
        field: row => row.projectStatus,
        sortable: true,
        format: val => `${val}`
    },
    {name: 'edition', align: 'center', label: t('manage'), field: 'edition', sortable: false},
]

</script>

<template>
    <QTable
        v-model:selected="selected"
        :columns="columns"
        :flat="props.flat"
        :loading="!projects"
        :no-data-label="t('project.no-project-to-show')"
        :rows="projects"
        :rows-per-page-options="[10, 20, 50, 0]"
        :title="props.title"
        role="presentation"
        row-key="id"
        selection="multiple"
    >
        <template v-slot:header="props">
            <QTr :props="props">
                <QTh>
                    <QCheckbox
                        v-model="props.selected"
                        :aria-label="t('table.select-all')"
                        color="commission"
                    />
                </QTh>
                <QTh
                    v-for="col in props.cols"
                    :id="col.name"
                    :key="col.name"
                    :props="props"
                    scope="col"
                >
                    {{ col.label }}
                </QTh>
            </QTr>
        </template>
        <template v-slot:body="props">
            <QTr :props="props">
                <QTd>
                    <QCheckbox
                        v-model="props.selected"
                        :aria-label="props.row.name"
                        color="commission"
                    />
                </QTd>
                <QTd
                    key="id"
                    :props="props"
                    headers="id"
                >
                    {{ props.row.manualIdentifier ?? '00000000' }}
                </QTd>
                <QTd
                    key="name"
                    :props="props"
                    headers="name"
                >
                    {{ props.row.name }}
                </QTd>
                <QTd
                    key="applicant"
                    :props="props"
                    headers="applicant"
                >
                    {{ applicant(props.row.association, props.row.user) }}
                </QTd>
                <QTd
                    key="lastModifiedDate"
                    :props="props"
                    headers="lastModifiedDate"
                >
                    {{ formatDate(props.row.editionDate)?.split('-').reverse().join('/') }}
                </QTd>
                <QTd
                    key="funds"
                    :props="props"
                >
                    <ProjectFundValidationIndicator
                        v-if="isLoaded"
                        :project-commission-funds="projectStore.projectCommissionFunds.filter(x => x.project === props.row.id)"
                    />
                </QTd>
                <QTd
                    key="status"
                    :props="props"
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
                    headers="edition"
                >
                    <div class="button-container">
                        <TableManageProjectsBtn
                            v-if="isLoaded"
                            :is-site="isSite(props.row.association)"
                            :project-commission-funds="projectStore.projectCommissionFunds.filter(x => x.project === props.row.id)"
                            :project-id="props.row.id"
                            :project-name="props.row.name"
                            :project-status="props.row.projectStatus"
                            @refresh-projects="onGetProjects()"
                        />
                    </div>
                </QTd>
            </QTr>
        </template>
        <template v-slot:pagination="scope">
            {{
                t('table.results-amount', {
                    firstResult: scope.pagination.rowsPerPage * (scope.pagination.page - 1) + 1,
                    lastResult: scope.pagination.rowsPerPage * scope.pagination.page,
                    amountResults: scope.pagination.rowsPerPage * scope.pagesNumber
                })
            }}
            <QBtn
                v-if="scope.pagesNumber > 2"
                :aria-label="t('table.first-page')"
                :disable="scope.isFirstPage"
                color="grey-8"
                dense
                flat
                icon="bi-chevron-double-left"
                @click="scope.firstPage"
            />
            <QBtn
                :aria-label="t('table.previous-page')"
                :disable="scope.isFirstPage"
                color="grey-8"
                dense
                flat
                icon="bi-chevron-left"
                @click="scope.prevPage"
            />
            <QBtn
                :aria-label="t('table.next-page')"
                :disable="scope.isLastPage"
                color="grey-8"
                dense
                flat
                icon="bi-chevron-right"
                @click="scope.nextPage"
            />
            <QBtn
                v-if="scope.pagesNumber > 2"
                :aria-label="t('table.last-page')"
                :disable="scope.isLastPage"
                color="grey-8"
                dense
                flat
                icon="bi-chevron-double-right"
                @click="scope.lastPage"
            />
        </template>
    </QTable>
    <CommissionExport
        :commission-id="props.commissionId"
        :commission-name="props.commissionName"
        :selected="selected"
        class="padding-bottom"
    />
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';

section {
    padding: 0 1rem
}
</style>
