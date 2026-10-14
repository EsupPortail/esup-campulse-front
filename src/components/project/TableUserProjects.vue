<script lang="ts" setup>
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useProjectStore} from '@/stores/useProjectStore'
import type {ProjectListItem} from '#/project'
import useUtility from '@/composables/useUtil'
import {useI18n} from 'vue-i18n'
import ProjectStatusIndicator from '@/components/project/ProjectStatusIndicator.vue'
import TableUserProjectsBtn from '@/components/project/TableUserProjectsBtn.vue'
import axios from 'axios'
import useErrors from '@/composables/useError'
import {onMounted, ref} from 'vue'
import useProject from '@/composables/useProject'
import useSecurity from '@/composables/useAuthentication'
import {useProfileStore} from '@/stores/useProfileStore'

const importedProps = defineProps<{
  projects: ProjectListItem[],
  title: string,
  associationId: number | null
}>()

const projectStore = useProjectStore()
const profileStore = useProfileStore()
const {formatDate} = useUtility()
const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {initProjectAssociationUsersLabels, projectAssociationUsersLabels} = useProject()
const {hasPerm} = useSecurity()

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
          message: await catchHTTPError(error.response)
        })
      }
    }
  } else {
    const index = columns.value?.findIndex(column => column.name === 'projectAssociationUser')
    if (index) {
      columns.value?.splice(index, 1)
    }
  }
}

const projectAssociationUser = (associationUserId: number) => {
  const member = projectAssociationUsersLabels.value.find(x => x.value === associationUserId)
  if (member) return member.label
}

const columns = ref<QTableProps['columns']>([
  {
    name: 'id',
    align: 'left',
    label: t('project.id'),
    field: row => row.manualIdentifier,
    sortable: true,
    format: val => `${val}`
  },
  {
    name: 'name',
    align: 'left',
    label: t('project.name'),
    field: 'name',
    sortable: true
  },
  {
    name: 'projectAssociationUser',
    align: 'left',
    label: t('project.contact'),
    field: row => projectAssociationUser(row.associationUser),
    sortable: true,
    format: val => `${val}`
  },
  {
    name: 'commissionDate',
    align: 'left',
    label: t('commission.date'),
    field: row => row.commission?.commissionDate,
    sortable: true,
    format: val => `${val}`
  },
  {
    name: 'status',
    align: 'right',
    label: t('status'),
    field: row => row.projectStatus,
    sortable: true,
    sort: (a, b) => (projectStore.projectStatuses.indexOf(a) - projectStore.projectStatuses.indexOf(b)),
    format: val => `${val}`
  },
  {
    name: 'edition',
    align: 'center',
    label: t('manage'),
    field: 'edition',
    sortable: false
  },
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

    role="presentation"
    row-key="id"
    wrap-cells
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
          key="projectAssociationUser"
          :props="props"
          headers="projectAssociationUser"
        >
          {{
            hasPerm('add_project_association') ? projectAssociationUser(props.row.associationUser?.id) :
            profileStore.user?.firstName + ' ' + profileStore.user?.lastName
          }}
        </QTd>
        <QTd
          key="commissionDate"
          :props="props"
          headers="commissionDate"
        >
          {{ formatDate(props.row.commission?.commissionDate).split('-').reverse().join('/') }}
        </QTd>
        <QTd
          key="status"
          :props="props"
          class="state-cell"
          headers="status"
        >
          <ProjectStatusIndicator
            :project-status="props.row.projectStatus"
            :show-draft="true"
          />
        </QTd>
        <QTd
          key="edition"
          :props="props"
          class="actions-cell-compact"
          headers="edition"
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
  </QTable>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
</style>
