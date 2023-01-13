<script lang="ts" setup>
import {onMounted} from 'vue'
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/stores/useUserStore'
import useAssociation from '@/composables/useAssociation'


const userStore = useUserStore()
const {managedAssociationsDirectory, getManagedAssociations} = useAssociation()
const {loading} = useQuasar()
const {t} = useI18n()

onMounted(async function () {
    loading.show
    await getManagedAssociations()
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
    {name: 'edit', align: 'left', label: 'Actions', field: 'edit', sortable: false},
]
</script>

<template>
    <h1>{{ userStore.isUniManager ? "Gérer l'annuaire des associations" : "Gérer mes associations" }}</h1>
    <QBanner v-if="!userStore.isUniManager" class="bg-grey-3">
        <template v-slot:avatar>
            <QIcon color="primary" name="mdi-information-outline" size="md"/>
        </template>
        <strong>Vous devez être membre du bureau d'une association pour modifier sa fiche
            annuaire.</strong>
        <template v-slot:action>
        </template>
    </QBanner>
    <QTable
        :columns="columns"
        :loading="!managedAssociationsDirectory"
        :rows="managedAssociationsDirectory"
        :rows-per-page-options="[10, 20, 50, 0]"
        :title="t('directory.title')"
        row-key="name"
    >
        <template v-slot:body="props">
            <QTr :props="props">
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
                <QTd key="edit" :props="props" class="edition-buttons">
                    <QBtn
                        v-if="userStore.isUniManager || userStore.hasOfficeStatus(props.row.id)"
                        :to="{name: 'EditAssociation', params: {id: props.row.id}}"
                        color="secondary"
                        icon="mdi-pencil"
                        label="Modifier"
                    />
                    <QBtn
                        v-if="userStore.isUniManager"
                        color="red"
                        icon="mdi-delete"
                        label="Supprimer"
                    />
                </QTd>
            </QTr>
        </template>
    </QTable>
</template>

<style lang="sass" scoped>
.q-tr:hover
    cursor: pointer

.edition-buttons
    display: flex
    gap: 10px

.q-banner
    margin-bottom: 20px
</style>