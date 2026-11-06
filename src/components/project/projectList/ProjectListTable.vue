<script lang="ts" setup>
import {type QTableProps, useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useError'
import ProjectStatusIndicator from '@/components/project/ProjectStatusIndicator.vue'
import {useProjectStore} from '@/stores/useProjectStore'
import {computed, onMounted, ref} from 'vue'
import axios from 'axios'
import useUtil from '@/composables/useUtil'
import useProject from '@/composables/useProject'
import router from '@/router'
import {usePagination} from '@/composables/usePagination'
import type {TargetPage} from '#/global'
import type {ProjectListFilters} from '#/project'
import ProjectSearchForm from '@/components/project/projectList/ProjectSearchForm.vue'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {formatDate} = useUtil()
const {listRange, changePage, pagination, updateRowsPerPage} = usePagination()
const {projectStatuses, searchProjectFilters} = useProject()
const projectStore = useProjectStore()

const props = defineProps<{
  commissionId?: number
}>()

const selected = ref<QTableProps['selected']>([])

const isLoading = ref<boolean>(false)

onMounted(async () => {
  loading.show()
  isLoading.value = true
  await onGetProjects()
  isLoading.value = false
  loading.hide()
})

async function onGetProjects() {
  loading.show()
  isLoading.value = true
  try {
    const page = pagination.value.page
    const pageSize = pagination.value.rowsPerPage
    const search = searchProjectFilters.value
    const filters: Partial<ProjectListFilters> = {
      commissionId: props.commissionId,
      association: search.associationName,
      editionDateAfter: search.editionDate.from,
      editionDateBefore: search.editionDate.to,
      manualIdentifier: search.manualIdentifier,
      projectStatuses: search.projectStatuses,
      funds: search.funds,
      name: search.name,
      page,
      pageSize,
    }
    await projectStore.getProjects(filters)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  } finally {
    isLoading.value = false
    loading.hide()
  }
}

const totalPages = computed<number>(() => {
  return projectStore.projects?.totalPages ?? 0
})

function onChangePage(page: TargetPage) {
  changePage(page, totalPages.value, onGetProjects)
}

// Object not typed by Quasar
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onRequest(props: any) {
  updateRowsPerPage(props, totalPages.value, onGetProjects)
}

function onClearSearch() {
  searchProjectFilters.value.manualIdentifier = null
  searchProjectFilters.value.name = null
  searchProjectFilters.value.associationName = null
  searchProjectFilters.value.userName = null
  searchProjectFilters.value.editionDate = {from: null, to: null}
  searchProjectFilters.value.commissionDate = {from: null, to: null}
  searchProjectFilters.value.funds = []
  searchProjectFilters.value.projectStatuses = []
  searchProjectFilters.value.category = null
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
    field: row => row.association?.acronym || row.user?.lastName,
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
  {
    name: 'commissionDate',
    align: 'left',
    label: t('commission.commission'),
    field: row => row.commission?.commissionDate,
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
    sort: (a, b) => (projectStatuses.indexOf(a) - projectStatuses.indexOf(b)),
    format: val => `${val}`
  }
]

async function onRowClick(projectId: number) {
  await router.push({name: 'Project', params: {projectId}})
}
</script>

<template>
  <div class="flex-column">
    <ProjectSearchForm
      @clear="onClearSearch"
      @search="onChangePage('first')"
    />
    <QTable
      v-model:pagination="pagination"
      v-model:selected="selected"
      :columns="columns"
      :loading="isLoading"
      :no-data-label="t('project.no-project-to-show')"
      :rows="projectStore.projects?.results || []"
      :rows-per-page-options="[10, 20, 50]"
      row-key="id"
      selection="multiple"
      wrap-cells
      @request="onRequest"
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
        <QTr
          :props="props"
          @click="onRowClick(props.row.id)"
        >
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
            {{ props.row.association?.acronym || (props.row.user?.firstName + props.row.user?.lastName) }}
          </QTd>
          <QTd
            key="lastModifiedDate"
            :props="props"
            headers="lastModifiedDate"
          >
            {{ formatDate(props.row.editionDate).split('-').reverse().join('/') }}
          </QTd>
          <QTd
            key="commissionDate"
            :props="props"
            headers="commissionDate"
          >
            {{ formatDate(props.row.commission?.commissionDate).split('-').reverse().join('/') }}
          </QTd>
          <QTd
            key="funds"
            :props="props"
          >
            <!--                    <ProjectFundValidationIndicator
  :project-commission-funds="props.row.commissionFunds"
  />-->
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
        </QTr>
      </template>
      <template v-slot:pagination>
        <div class="flex-row flex-align-center">
          <span>{{ listRange(projectStore.projects) }}</span>
          <div>
            <QBtn
              :aria-label="t('accessibility.pagination.first-page')"
              :disable="!projectStore.projects?.previous"
              color="grey-8"
              dense
              flat
              icon="bi-chevron-double-left"
              round
              size="1.25rem"
              @click="onChangePage('first')"
            />
            <QBtn
              :aria-label="t('accessibility.pagination.previous-page')"
              :disable="!projectStore.projects?.previous"
              color="grey-8"
              dense
              flat
              icon="bi-chevron-left"
              round
              size="1.25rem"
              @click="onChangePage('previous')"
            />
            <QBtn
              :aria-label="t('accessibility.pagination.next-page')"
              :disable="!projectStore.projects?.next"
              color="grey-8"
              dense
              flat
              icon="bi-chevron-right"
              round
              size="1.25rem"
              @click="onChangePage('next')"
            />
            <QBtn
              :aria-label="t('accessibility.pagination.last-page')"
              :disable="!projectStore.projects?.next"
              color="grey-8"
              dense
              flat
              icon="bi-chevron-double-right"
              round
              size="1.25rem"
              @click="onChangePage('last')"
            />
          </div>
        </div>
      </template>
    </QTable>
  </div>

  <!--    <CommissionExport
:commission-id="props.commissionId"
:commission-name="props.commissionName"
:selected="selected"
class="padding-bottom"
/>-->
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard';
@import '@/assets/styles/forms';

.q-tr {
  cursor: pointer;
}
</style>
