<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/stores/useUserStore'
import useAssociation from '@/composables/useAssociation'
import AlertConfirmAssociationsChanges from '@/components/alert/AlertConfirmAssociationsChanges.vue'


const userStore = useUserStore()
const {managedAssociationsDirectory, getManagedAssociations} = useAssociation()
const {loading} = useQuasar()
const {t} = useI18n()
const associations = ref([...managedAssociationsDirectory.value])
watch(() => managedAssociationsDirectory.value, () => {
    associations.value = managedAssociationsDirectory
})

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
    {name: 'actions', align: 'left', label: t('association.edit'), field: 'isEnabled', sortable: false},
    {name: 'shouldDisable', align: 'left', label: t('association.disable'), field: 'shouldDisable', sortable: false},
    {name: 'shouldEnable', align: 'left', label: t('association.enable'), field: 'shouldEnable', sortable: false},
    {name: 'shouldDelete', align: 'left', label: t('association.delete'), field: 'shouldDelete', sortable: false},
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
        :loading="!associations"
        :rows="associations.value"
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
                <QTd key="actions" :props="props">
                    <QBtn
                        :to="{name: 'EditAssociation', params: {id: props.row.id}}"
                        color="primary"
                        icon="mdi-pencil"
                        :label="t('association.edit')"
                    />
                </QTd>
                <QTd key="shouldDisable" :props="props">
                    <QCheckbox
                        v-model="props.row.shouldDisable"
                        v-if="props.row.isEnabled"
                        color="orange"
                        :label="t('association.disable')"
                    />
                </QTd>
                <QTd key="shouldEnable" :props="props">
                    <QCheckbox
                        v-model="props.row.shouldEnable"
                        v-if="!props.row.isEnabled"
                        color="green"
                        :label="t('association.enable')"
                    />
                </QTd>
                <QTd key="shouldDelete" :props="props">
                    <QCheckbox
                        v-model="props.row.shouldDelete"
                        v-if="!props.row.isEnabled"
                        color="red"
                        :label="t('association.delete')"
                    />
                </QTd>
            </QTr>
        </template>
    </QTable>
    <!--<AlertConfirmAssociationsChanges associationsActions="associationsActions"/>-->
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
