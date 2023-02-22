<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/stores/useUserStore'
import {useAssociationStore} from '@/stores/useAssociationStore'
import AlertConfirmAssociationsChanges from '@/components/alert/AlertConfirmAssociationsChanges.vue'
import useSecurity from '@/composables/useSecurity'
import type {Association} from "#/association";

const userStore = useUserStore()
const associationStore = useAssociationStore()
const {loading} = useQuasar()
const {t} = useI18n()
const {hasPerm} = useSecurity()

const associations = ref<Association[]>()

const initValues = () => {
    associations.value = associationStore.associations
}
watch(() => associationStore.associations, initValues)

onMounted(async function () {
    loading.show
    await associationStore.getManagedAssociations()
    await userStore.getUserAssociations()
    initValues()
    loading.hide
})

const selected = ref<QTableProps['selected']>([])
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
        name: 'institutionComponent',
        align: 'left',
        label: t('directory.labels.association-institution-component'),
        field: 'institutionComponent',
        sortable: true
    },
    {
        name: 'activityField',
        align: 'left',
        label: t('directory.labels.association-activity-field'),
        field: 'activityField',
        sortable: true
    },
    {
        name: 'status',
        align: 'left',
        label: t('directory.labels.association-status'),
        field: 'isEnabled',
        sortable: true
    },
    {
        name: 'public',
        align: 'left',
        label: t('directory.labels.association-public'),
        field: 'isPublic',
        sortable: true
    },
    {
        name: 'actions',
        align: 'left',
        label: t('directory.labels.association-actions'),
        field: 'actions',
        sortable: false
    },
]
</script>

<template>
    <h1>{{ t('dashboard.association-management') }}</h1>
    <QBtn :label="t('home.back-dashboard')" :to="{ name: 'Dashboard' }" color="secondary" icon="mdi-arrow-left-circle"/>
    <QBtn v-if="hasPerm('add_association')" :label="t('dashboard.create-association')"
          :to="{ name: 'CreateAssociation' }"
          color="secondary" icon="mdi-plus-box"/>
    <QTable v-model:selected="selected" :columns="columns" :loading="!associations" :rows="associations"
            :rows-per-page-options="[10, 20, 50, 0]"
            :title="t('directory.title')"
            row-key="name" selection="multiple">
        <template v-slot:body="props">
            <QTr :props="props">
                <QTd>
                    <QCheckbox v-model="props.selected"/>
                </QTd>
                <QTd key="name" :props="props">
                    {{ props.row.name }}
                </QTd>
                <QTd key="acronym" :props="props">
                    {{ props.row.acronym }}
                </QTd>
                <QTd key="institution" :props="props">
                    {{ props.row.institution?.name }}
                </QTd>
                <QTd key="institutionComponent" :props="props">
                    {{ props.row.institutionComponent?.name }}
                </QTd>
                <QTd key="activityField" :props="props">
                    {{ props.row.activityField?.name }}
                </QTd>
                <QTd key="status" :props="props">
                    {{ props.row.isEnabled ? t('association.enabled') : t('association.disabled') }}
                </QTd>
                <QTd key="public" :props="props">
                    {{ props.row.isPublic ? t('association.public') : t('association.not-public') }}
                </QTd>
                <QTd key="actions" :props="props">
                    <QBtn :label="t('association.edit')" :to="{ name: 'EditAssociation', params: { id: props.row.id } }"
                          color="primary" icon="mdi-pencil"/>
                </QTd>
            </QTr>
        </template>
    </QTable>
    <AlertConfirmAssociationsChanges
        :selectedAssociations="selected"
        @update-selected-associations="selected = []"
    />
</template>

<style lang="sass" scoped>
.edition-buttons
    display: flex
    gap: 10px

.q-banner
    margin-bottom: 20px
</style>
