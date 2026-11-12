<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import axios from 'axios'
import useErrors from '@/composables/useError'
import type {ProjectListItem} from '#/project'
import useUtil from '@/composables/useUtil'
import * as commissionService from '@/services/CommissionService'

const {t} = useI18n()
const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()
const {openDocument} = useUtil()

const props = defineProps<{
  commissionId: number,
  selected: ProjectListItem[] | undefined
}>()

async function onExportCommission(mode: 'csv' | 'pdf' | 'xlsx') {
  loading.show()
  try {
    const projects = props.selected?.map(project => project.id)
    const response = await commissionService.getCommissionExport(props.commissionId, mode, projects)
    openDocument(response)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
  loading.hide()
}
</script>

<template>
  <div class="flex-row-center padding-top">
    <QBtn
      :disable="!props.selected?.length"
      :label="t('commission.export-pdf')"
      class="btn-lg"
      color="commission"
      icon="bi-filetype-pdf"
      @click="onExportCommission('pdf')"
    />
    <QBtn
      :disable="!props.selected?.length"
      :label="t('commission.export-csv')"
      class="btn-lg"
      color="commission"
      icon="bi-filetype-csv"
      @click="onExportCommission('csv')"
    />
    <QBtn
      :disable="!props.selected?.length"
      :label="t('commission.export-xlsx')"
      class="btn-lg"
      color="commission"
      icon="bi-filetype-xlsx"
      @click="onExportCommission('xlsx')"
    />
  </div>
</template>
