<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import {onMounted} from 'vue'
import router from '@/router'
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'

const associationStore = useAssociationStore()
const {loading} = useQuasar()
const {t} = useI18n()

onMounted(async function () {
    loading.show
    await associationStore.getAssociations()
    loading.hide
})


const columns: QTableProps['columns'] = [
    {
        name: 'name',
        required: true,
        label: t('directory.labels.association-name'),
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
        sortable: true
    },
    {
        name: 'acronym',
        align: 'left',
        label: t('directory.labels.association-acronym'),
        field: 'acronym',
        sortable: true
    },
    {
        name: 'institution',
        align: 'left',
        label: t('directory.labels.association-institution'),
        field: 'institution',
        sortable: true
    },
    {
        name: 'component',
        align: 'left',
        label: t('directory.labels.association-component'),
        field: 'component',
        sortable: true
    },
    {name: 'field', align: 'left', label: t('directory.labels.association-field'), field: 'field', sortable: true},
]

function goTo(id: number) {
    router.push({name: 'AssociationDetail', params: {id}})
}
</script>

<template>
    <h1>{{ t("home.directory") }}</h1>

    <QTable
        :columns="columns"
        :loading="!associationStore.associationDirectory"
        :rows="associationStore.associationDirectory"
        :rows-per-page-options="[10, 20, 50, 0]"
        :title="t('directory.title')"
        row-key="name"
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