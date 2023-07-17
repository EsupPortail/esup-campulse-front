<script lang="ts" setup>
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useProjectStore} from '@/stores/useProjectStore'
import type {ProjectList} from '#/project'
import useUtility from '@/composables/useUtility'
import {useI18n} from 'vue-i18n'
import ProjectStatusIndicator from '@/components/project/ProjectStatusIndicator.vue'
import TableUserProjectsBtn from '@/components/project/TableUserProjectsBtn.vue'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import {onMounted, ref} from 'vue'
import useSubmitProject from '@/composables/useSubmitProject'

const importedProps = defineProps<{
    projects: ProjectList[],
    title: string,
    associationId: number | null
}>()

const projectStore = useProjectStore()
const {formatDate} = useUtility()
const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {initProjectAssociationUsersLabels, projectAssociationUsersLabels} = useSubmitProject()

onMounted(async () => {
    loading.show()
    await onGetAssociationUsers()
    loading.hide()
})

async function onGetAssociationUsers() {
    if (importedProps.associationId) {
        try {
            await initProjectAssociationUsersLabels(importedProps.associationId)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
                })
            }
        }
    } else {
        columns.value?.splice(1, 1)
    }
}

const projectAssociationUser = (associationUserId: number) => {
    const member = projectAssociationUsersLabels.value.find(x => x.value === associationUserId)
    if (member) return member.label
}

const columns = ref<QTableProps['columns']>([
    {name: 'name', align: 'left', label: t('project.name'), field: 'name', sortable: true},
    {
        name: 'projectAssociationUser',
        align: 'left',
        label: t('project.contact'),
        field: 'projectAssociationUser',
        sortable: true
    },
    /*{
        name: 'plannedStartDate',
        align: 'left',
        label: t('project.planned-start-date'),
        field: 'plannedStartDate',
        sortable: true
    },
    {
        name: 'plannedEndDate',
        align: 'left',
        label: t('project.planned-end-date'),
        field: 'plannedEndDate',
        sortable: true
    },*/
    {
        name: 'commissionDate',
        align: 'left',
        label: t('commission.date'),
        field: 'commissionDate',
        sortable: true
    },
    {name: 'status', align: 'right', label: t('status'), field: 'status', sortable: true},
    {name: 'edition', align: 'center', label: t('manage'), field: 'edition', sortable: false},
])
</script>

<template>
    <QTable
        :columns="columns"
        :loading="!projectStore.projects"
        :no-data-label="t('project.no-project-to-show')"
        :rows="importedProps.projects"
        :rows-per-page-options="[10, 20, 50, 0]"
        :title="importedProps.title"
        row-key="name"
        role="presentation"
    >
        <template v-slot:header="props">
            <QTr :props="props">
                <QTh
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    scope="col"
                    :id="col.name"
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
                    key="projectAssociationUser"
                    :props="props"
                    headers="projectAssociationUser"
                >
                    {{ projectAssociationUser(props.row.associationUser) }}
                </QTd>
                <!--                <QTd
                                    key="plannedStartDate"
                                    :props="props"
                                >
                                    {{ formatDate(props.row.plannedStartDate)?.split('-').reverse().join('/') }}
                                </QTd>
                                <QTd
                                    key="plannedEndDate"
                                    :props="props"
                                >
                                    {{ formatDate(props.row.plannedEndDate)?.split('-').reverse().join('/') }}
                                </QTd>-->
                <QTd
                    key="commissionDate"
                    :props="props"
                    headers="commissionDate"
                >
                    {{ formatDate(props.row.commission?.commissionDate)?.split('-').reverse().join('/') }}
                </QTd>
                <QTd
                    key="status"
                    :props="props"
                    headers="status"
                    class="state-cell"
                >
                    <ProjectStatusIndicator
                        :project-status="props.row.projectStatus"
                        :show-draft="true"
                    />
                </QTd>
                <QTd
                    key="edition"
                    :props="props"
                    headers="edition"
                    class="actions-cell-compact"
                >
                    <div class="btn-group">
                        <TableUserProjectsBtn
                            :association="importedProps.associationId"
                            :project-id="props.row.id"
                            :project-name="props.row.name"
                            :project-status="props.row.projectStatus"
                        />
                    </div>
                </QTd>
            </QTr>
        </template>
        <template v-slot:pagination="scope">
            {{ t('table.results-amount', {
                firstResult: scope.pagination.rowsPerPage * (scope.pagination.page - 1) + 1,
                lastResult: scope.pagination.rowsPerPage * scope.pagination.page,
                amountResults: scope.pagination.rowsPerPage * scope.pagesNumber
            }) }}
            <QBtn
                v-if="scope.pagesNumber > 2"
                icon="bi-chevron-double-left"
                color="grey-8"
                dense
                flat
                :disable="scope.isFirstPage"
                @click="scope.firstPage"
                :aria-label="t('table.first-page')"
            />
            <QBtn
                icon="bi-chevron-left"
                color="grey-8"
                dense
                flat
                :disable="scope.isFirstPage"
                @click="scope.prevPage"
                :aria-label="t('table.previous-page')"
            />
            <QBtn
                icon="bi-chevron-right"
                color="grey-8"
                dense
                flat
                :disable="scope.isLastPage"
                @click="scope.nextPage"
                :aria-label="t('table.next-page')"
            />
            <QBtn
                v-if="scope.pagesNumber > 2"
                icon="bi-chevron-double-right"
                color="grey-8"
                dense
                flat
                :disable="scope.isLastPage"
                @click="scope.lastPage"
                :aria-label="t('table.last-page')"
            />
        </template>
    </QTable>
</template>


<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
</style>
