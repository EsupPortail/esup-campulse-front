<script lang="ts" setup>
import {useQuasar} from 'quasar'
import axios from 'axios'
import useErrors from '@/composables/useError'
import type {ProjectListItem} from '#/project'
import useUtil from '@/composables/useUtil'
import * as commissionService from '@/services/CommissionService'
import {ref} from 'vue'

const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()
const {openDocument} = useUtil()

const props = defineProps<{
  commissionId: number,
  selected: ProjectListItem[] | undefined
}>()

async function onExportCommission() {
  loading.show()
  try {
    const projects = props.selected?.map(project => project.id)
    const response = await commissionService.getCommissionExport(props.commissionId, format.value.toLowerCase(), projects)
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

const options = ['PDF', 'CSV', 'XSLX']

const format = ref()
</script>

<template>
  <div>
    <QSelect
      v-model="format"
      :options
      clearable
      color="commission"
      filled
      label="Sélectionner un format"
    />
    <QBtn
      :disable="!(format && selected.length > 0)"
      class="btn-lg"
      color="commission"
      icon="bi-file-earmark"
      label="Exporter les projets"
      @click="onExportCommission"
    />
  </div>
</template>

<style lang="scss" scoped>
.q-select {
  width: 25rem;
}

div {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 1rem 0;
  gap: 1rem;
}
</style>
