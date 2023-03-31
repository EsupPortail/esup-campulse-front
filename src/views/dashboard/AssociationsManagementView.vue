<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import AlertConfirmAssociationsChanges from '@/components/alert/AlertConfirmAssociationsChanges.vue'
import useSecurity from '@/composables/useSecurity'
import type {Association} from '#/association'

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
        sortable: true,
        sort: (a, b) => a.name.localeCompare(b.name)
    },
    {
        name: 'activityField',
        align: 'left',
        label: t('directory.labels.association-activity-field'),
        field: 'activityField',
        sortable: true,
        sort: (a, b) => a.name.localeCompare(b.name)
    },
    {
        name: 'status',
        align: 'right',
        label: t('directory.labels.association-status'),
        field: 'isEnabled',
        sortable: true
    },
    {
        name: 'public',
        align: 'right',
        label: t('directory.labels.association-public'),
        field: 'isPublic',
        sortable: true
    },
    {
        name: 'actions',
        align: 'center',
        label: t('directory.labels.association-actions'),
        field: 'actions',
        sortable: false
    },
]
</script>

<template>
    <!-- <h1>{{
            userStore.isUniManager ? t('dashboard.association-management') : t('dashboard.association-user.manage-my-associations')
        }}</h1> -->
    <!--    <QBanner v-if="!userStore.isUniManager" class="bg-grey-3">
            <template v-slot:avatar>
                <QIcon color="primary" name="mdi-information-outline" size="md"/>
            </template>
            <strong>{{ t('dashboard.association-user.has-office-status-needed') }}</strong>
            <template v-slot:action>
            </template>
        </QBanner>-->

    <!-- <QBtn
        :label="t('home.back-dashboard')"
        :to="{name: 'Dashboard'}"
        color="secondary"
        icon="mdi-arrow-left-circle"
    /> -->


    <div class="form-title">
        <h2>
            <QIcon name="mdi-pencil-box-outline"/>
            Liste des associations
        </h2>
        <QBtn
            v-if="hasPerm('add_association')"
            :label="t('dashboard.create-association')"
            :to="{name: 'CreateAssociation'}"
            class="small-button"
            color="secondary"
            icon="mdi-plus-box"
        />
    </div>

    <div class="form-container">
        <div class="form">

            <QTable
                v-model:selected="selected"
                :columns="columns"
                :loading="!associations"
                :rows="associations"
                :rows-per-page-options="[10, 20, 50, 0]"
                :title="t('directory.title')"
                row-key="name"
                selection="multiple"
            >
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
                        <QTd key="activityField" :props="props">
                            {{ props.row.activityField?.name }}
                        </QTd>
                        <QTd key="status" :props="props" class="state-cell">
                            <span v-if="!props.row.isEnabled" class="form-state">
                                {{ t('association.disabled') }}
                                <span class="form-state-icon form-state-red"><i class="bi bi-x-lg"></i></span>
                            </span>

                            <span v-else class="form-state">
                                {{ t('association.enabled') }}
                                <span class="form-state-icon form-state-green"><i class="bi bi-check-lg"></i></span>
                            </span>
                        </QTd>
                        <QTd key="public" :props="props" class="state-cell">
                            <span v-if="!props.row.isPublic" class="form-state">
                                {{ t('association.not-public') }}
                                <span class="form-state-icon form-state-red"><i class="bi bi-x-lg"></i></span>
                            </span>

                            <span v-else class="form-state">
                                {{ t('association.public') }}
                                <span class="form-state-icon form-state-green"><i class="bi bi-check-lg"></i></span>
                            </span>
                        </QTd>
                        <QTd key="actions" :props="props" class="actions-cell-compact">
                            <QBtn
                                :label="t('association.edit')"
                                :to="{name: 'EditAssociation', params: {id: props.row.id}}"
                                color="primary"
                                icon="mdi-pencil"
                            />
                        </QTd>
                    </QTr>
                </template>
            </QTable>

            <AlertConfirmAssociationsChanges
                :selectedAssociations="selected"
                @update-selected-associations="selected = []"
            />
        </div>
    </div>
</template>

<!--<style lang="sass" scoped>
.edition-buttons
    display: flex
    gap: 10px

.q-banner
    margin-bottom: 20px
</style>-->

<style lang="sass">
@import '@/assets/styles/forms.scss'
</style>