<script lang="ts" setup>
import {type QTableProps, useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useError'
import ProjectStatusIndicator from '@/components/project/ProjectStatusIndicator.vue'
import {useProjectStore} from '@/stores/useProjectStore'
import {onMounted, ref} from 'vue'
import axios from 'axios'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {formatDate} = useUtil()
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
  try {
    await projectStore.getProjects({commission: props.commissionId})
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
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
    sort: (a, b) => (projectStore.projectStatuses.indexOf(a) - projectStore.projectStatuses.indexOf(b)),
    format: val => `${val}`
  }
]
</script>

<template>
  <QTable
    v-model:selected="selected"
    :columns="columns"
    :loading="isLoading"
    :no-data-label="t('project.no-project-to-show')"
    :rows="projectStore.projects?.results || []"
    :rows-per-page-options="[10, 20, 50, 0]"

    row-key="id"
    selection="multiple"
    wrap-cells
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
  </QTable>
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
</style>
