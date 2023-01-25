<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/stores/useUserStore'
import {useAssociationStore} from '@/stores/useAssociationStore'
import AlertConfirmAssociationsChanges from '@/components/alert/AlertConfirmAssociationsChanges.vue'

const userStore = useUserStore()
const associationStore = useAssociationStore()
const {loading} = useQuasar()
const {t} = useI18n()


const associations = ref(associationStore.managedAssociations)
watch(() => associationStore.managedAssociations, () => {
    associations.value = associationStore.managedAssociations
})

onMounted(async function () {
    loading.show
    await associationStore.getManagedAssociations()
    await userStore.getUserAssociationsRoles()
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
        name: 'component',
        align: 'left',
        label: t('directory.labels.association-component'),
        field: 'component',
        sortable: true
    },
    {name: 'field', align: 'left', label: t('directory.labels.association-field'), field: 'field', sortable: true},
    {
        name: 'status',
        align: 'left',
        label: t('directory.labels.association-status'),
        field: 'isEnabled',
        sortable: false
    },
    {
        name: 'actions',
        align: 'left',
        label: t('directory.labels.association-actions'),
        field: 'isEnabled',
        sortable: false
    },
]
</script>

<template>
    <h1>{{
            userStore.isUniManager ? t('dashboard.association-management') : t('dashboard.association-user.manage-my-associations')
        }}</h1>
    <QBanner v-if="!userStore.isUniManager" class="bg-grey-3">
        <template v-slot:avatar>
            <QIcon color="primary" name="mdi-information-outline" size="md"/>
        </template>
        <strong>{{ t('dashboard.association-user.has-office-status-needed') }}</strong>
        <template v-slot:action>
        </template>
    </QBanner>
    <QBtn
        :label="t('home.back-dashboard')"
        :to="{name: 'Dashboard'}"
        color="secondary"
        icon="mdi-arrow-left-circle"
    />
    <QBtn
        v-if="userStore.isUniManager"
        :label="t('dashboard.create-association')"
        :to="{name: 'CreateAssociation'}"
        color="secondary"
        icon="mdi-plus-box"
    />
    <QTable
        v-model:selected="selected"
        :columns="columns"
        :loading="!associations"
        :rows="associations"
        :rows-per-page-options="[10, 20, 50, 0]"
        :selection="userStore.isUniManager ? 'multiple' : ''"
        :title="t('directory.title')"
        row-key="name"
    >
        <template v-slot:body="props">
            <QTr :props="props">
                <QTd v-if="userStore.isUniManager">
                    <QCheckbox v-model="props.selected"/>
                </QTd>
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
                <QTd key="status" :props="props">
                    {{ props.row.isEnabled ? t('association.enabled') : t('association.disabled') }}
                </QTd>
                <QTd key="actions" :props="props">
                    <QBtn
                        v-if="userStore.isUniManager || userStore.hasOfficeStatus(props.row.id)"
                        :label="t('association.edit')"
                        :to="{name: 'EditAssociation', params: {id: props.row.id}}"
                        color="primary"
                        icon="mdi-pencil"
                    />
                    <span v-else>{{ t('dashboard.association-user.not-from-office') }}</span>
                </QTd>
            </QTr>
        </template>
    </QTable>
    <AlertConfirmAssociationsChanges
        v-if="userStore.isUniManager"
        :selectedAssociations="selected"
    />
</template>

<style lang="sass" scoped>
.edition-buttons
    display: flex
    gap: 10px

.q-banner
    margin-bottom: 20px
</style>
