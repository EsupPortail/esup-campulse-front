<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import {onMounted} from 'vue'

const associationStore = useAssociationStore()
onMounted(associationStore.getAssociations)


const headers = [
    {name: 'name', align: 'left', label: 'Nom de l\'association', field: 'name', sortable: true},
    {name: 'acronym', align: 'left', label: 'Sigle', field: 'acronym', sortable: true},
    {name: 'institution', align: 'left', label: 'Etablissement', field: 'institution', sortable: true},
    {name: 'component', align: 'left', label: 'Composante', field: 'component', sortable: true},
    {name: 'field', align: 'left', label: 'Domaine', field: 'field', sortable: true},
]
</script>

<template>
    <h1>{{ $t("home.directory") }}</h1>
    <QTable
        :columns="headers"
        :rows="associationStore.associationDirectory"
        row-key="name"
        title="Associations"
    />
</template>

<style lang="sass" scoped>

</style>