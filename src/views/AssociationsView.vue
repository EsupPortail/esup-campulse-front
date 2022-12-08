<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import {onMounted} from 'vue'
import router from '@/router'
import type {QTableProps} from 'quasar'
import {useI18n} from "vue-i18n";

const associationStore = useAssociationStore()
onMounted(associationStore.getAssociations)
const {t} = useI18n()

const columns: QTableProps['columns'] = [
  {
    name: 'name',
    required: true,
    label: 'Nom de l\'association',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  {name: 'acronym', align: 'left', label: 'Sigle', field: 'acronym', sortable: true},
  {name: 'institution', align: 'left', label: 'Etablissement', field: 'institution', sortable: true},
  {name: 'component', align: 'left', label: 'Composante', field: 'component', sortable: true},
  {name: 'field', align: 'left', label: 'Domaine', field: 'field', sortable: true},
]

function goTo(id: number) {
  router.push({name: 'AssociationDetail', params: {id}})
}
</script>

<template>
  <h1>{{ t("home.directory") }}</h1>
  <QTable
      :columns="columns"
      :rows="associationStore.associationDirectory"
      row-key="name"
      title="Associations"
  >
    <template v-slot:body="props">
      <QTr :props="props" @click="goTo(props.row.id)">
        <QTd key="name" :props="props">
          {{ props.row.name }}
        </QTd>
        <QTd key="acronym" :props="props">
          {{ props.row.acronym }}
        </QTd>
        <QTd key="institution" :props="props">
          {{ props.row.institution }}
        </QTd>
        <QTd key="component" :props="props">
          {{ props.row.component }}
        </QTd>
        <QTd key="field" :props="props">
          {{ props.row.field }}
        </QTd>
      </QTr>
    </template>
  </QTable>
</template>

<style lang="sass" scoped>
.q-tr:hover
  cursor: pointer
</style>