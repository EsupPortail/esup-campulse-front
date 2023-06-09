<script lang="ts" setup>
import type {QTableProps} from 'quasar'
import {useI18n} from 'vue-i18n'
import useUtility from '@/composables/useUtility'
import ProjectStatusIndicator from '@/components/table/ProjectStatusIndicator.vue'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import type {ProjectList} from '#/project'
import axios from 'axios'
import {useProjectStore} from '@/stores/useProjectStore'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {onMounted, ref} from 'vue'
import TableManageProjectsBtn from '@/components/table/TableManageProjectsBtn.vue'
import useCommissions from '@/composables/useCommissions'

const {t} = useI18n()
const {formatDate} = useUtility()
const associationStore = useAssociationStore()
const userManagerStore = useUserManagerStore()
const projectStore = useProjectStore()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {commissionFunds} = useCommissions()

const props = defineProps<{
    commission: number,
    projectStatus: 'all' | 'validated'
}>()

const projects = ref<ProjectList[]>([])

const applicant = (association: number | null, user: number | null) => {
    if (association) {
        return associationStore.associationNames.find(obj => obj.id === association)?.name
    } else {
        const userObj = userManagerStore.users.find(obj => obj.id === user)
        return `${userObj?.firstName} ${userObj?.lastName}`
    }
}

const initProjects = () => {
    if (props.projectStatus === 'validated') {
        projects.value = projectStore.projects.filter(obj => obj.projectStatus === 'PROJECT_VALIDATED')
    } else {
        projects.value = projectStore.projects
    }
}

onMounted(async () => {
    loading.show()
    await onGetProjects([props.commission])
    await onGetApplicants()
    initProjects()
    loading.hide()
})


async function onGetProjects(commissions: number[]) {
    try {
        if (commissions.length) {
            await projectStore.getProjects(false, commissions)
        } else {
            projectStore.projects = []
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
    {name: 'status', align: 'right', label: t('status'), field: 'status', sortable: true},
    {name: 'edition', align: 'center', label: t('manage'), field: 'edition', sortable: false},
]

</script>

<template>
    <section>
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
                            <TableManageProjectsBtn
                                :project="props.row.id"
                                :project-status="props.row.projectStatus"
                            />
                        </div>
                    </QTd>
                </QTr>
            </template>
        </QTable>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';
@import "@/assets/_variables.scss";

section {
    padding: 0 1rem
}
</style>
