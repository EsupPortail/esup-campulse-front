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


const {t} = useI18n()
const {formatDate} = useUtility()
const associationStore = useAssociationStore()
const userManagerStore = useUserManagerStore()
const projectStore = useProjectStore()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {getFunds, getCommissionFunds} = useCommissions()

const props = defineProps<{
    commission: number,
    projectStatus: 'all' | 'validated' | 'archived',
    title: string
}>()

const isLoaded = ref<boolean>(false)

const projects = ref<ProjectList[]>([])

const applicant = (association: number | null, user: number | null) => {
    if (association) {
        const obj = associationStore.associations.find(x => x.id === association)
        if (obj) return obj.name
    } else {
        const userObj = userManagerStore.users.find(obj => obj.id === user)
        return `${userObj?.firstName} ${userObj?.lastName}`
    }
}

const isSite = (association: number | null) => {
    if (!association) return false
    const obj = associationStore.associations.find(x => x.id === association)
    if (obj) return obj.isSite
}

const initProjects = () => {
    if (props.projectStatus === 'validated') {
        projects.value = projectStore.projects.filter(obj => obj.projectStatus === 'PROJECT_VALIDATED'
            || obj.projectStatus === 'PROJECT_REVIEW_PROCESSING' || obj.projectStatus === 'PROJECT_REVIEW_VALIDATED')
    } else if (props.projectStatus === 'archived') {
        projects.value = projectStore.projects.filter(obj => obj.projectStatus === 'PROJECT_REJECTED'
            || obj.projectStatus === 'PROJECT_CANCELLED' || obj.projectStatus === 'PROJECT_REVIEW_VALIDATED')
    } else {
        projects.value = projectStore.projects
    }
}

watch(() => projectStore.projects, initProjects)

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
        await projectStore.getManagedProjects(props.commission)
        await projectStore.getProjectCommissionFunds(true, props.commission)
        await getCommissionFunds()
        await getFunds()
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
                await associationStore.getAssociations(true)
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
    {name: 'funds', align: 'right', label: t('commission.funds'), field: 'funds', sortable: true},
    {name: 'status', align: 'right', label: t('status'), field: 'status', sortable: true},
    {name: 'edition', align: 'center', label: t('manage'), field: 'edition', sortable: false},
]

</script>

<template>
    <div>
        <QTable
            :columns="columns"
            :loading="!projects"
            :rows="projects"
            :rows-per-page-options="[10, 20, 50, 0]"
            :title="props.title"
            role="presentation"
            row-key="name"
        >
            <template v-slot:header="props">
                <QTr :props="props">
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
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';

section {
    padding: 0 1rem
}
</style>
