<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import AlertConfirmAssociationsChanges from '@/components/alert/AlertConfirmAssociationsChanges.vue'
import useSecurity from '@/composables/useSecurity'
import useErrors from '@/composables/useErrors'
import axios from 'axios'
import FormAssociationSearch from '@/components/form/FormAssociationSearch.vue'
import useAssociation from '@/composables/useAssociation'
import {useRoute} from 'vue-router'

const associationStore = useAssociationStore()
const {loading, notify} = useQuasar()
const {t} = useI18n()
const {hasPerm} = useSecurity()
const {catchHTTPError} = useErrors()
const {associations} = useAssociation()
const route = useRoute()

const initValues = () => {
    associations.value = associationStore.associations
}
watch(() => associationStore.associations, initValues)

onMounted(async function () {
    loading.show()
    await onGetManagedAssociations()
    initValues()
    loading.hide()
})

async function onGetManagedAssociations() {
    try {
        await associationStore.getManagedAssociations()
        await associationStore.getInstitutions()
        await associationStore.getActivityFields()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}

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
        sort: (a, b) => (associationStore.institutions.find(obj => obj.id === a)?.name as string)
            .localeCompare(associationStore.institutions.find(obj => obj.id === b)?.name as string)
    },
    {
        name: 'activityField',
        align: 'left',
        label: t('directory.labels.association-activity-field'),
        field: 'activityField',
        sortable: true,
        sort: (a, b) => (associationStore.activityFields.find(obj => obj.id === a)?.name as string)
            .localeCompare(associationStore.activityFields.find(obj => obj.id === b)?.name as string)
    },
    {
        name: 'status',
        align: 'right',
        label: t('directory.labels.association-status'),
        field: 'isEnabled',
        sortable: true
    },
    {
        name: 'site',
        align: 'right',
        label: t('directory.labels.association-site'),
        field: 'isSite',
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
        name: 'edition',
        align: 'center',
        label: t('directory.labels.association-edition'),
        field: 'edition',
        sortable: false
    },
]
</script>

<template>
    <section class="dashboard-section">
        <div class="container-lg flex-row-space-between">
            <h2>
                <QIcon name="bi-pencil-square"/>
                {{ t('dashboard.association-list') }}
            </h2>
            <QBtn
                v-if="hasPerm('add_association')"
                :label="t('dashboard.create-association')"
                :to="{ name: 'CreateAssociation' }"
                color="association"
                icon="bi-plus-circle"
                outline
            />
        </div>
        <div class="dashboard-section-container">
            <div class="container-lg">
                <FormAssociationSearch
                    v-if="route.name"
                    :route="route.name"
                />
                <QTable
                    v-model:selected="selected"
                    :columns="columns"
                    :loading="!associations"
                    :rows="associations"
                    :rows-per-page-options="[10, 20, 50, 0]"
                    :title="t('directory.title')"
                    role="presentation"
                    row-key="name"
                    selection="multiple"
                    wrap-cells
                >
                    <template v-slot:header="props">
                        <QTr :props="props">
                            <QTh>
                                <QCheckbox
                                    v-model="props.selected"
                                    :aria-label="t('table.select-all')"
                                    color="association"
                                />
                            </QTh>
                            <QTh
                                v-for="col in props.cols"
                                :id="col.name"
                                :key="col.name"
                                :props="props"
                                scope="col"
                            >
                                {{ col.label }}
                            </QTh>
                        </QTr>
                    </template>
                    <template v-slot:body="props">
                        <QTr :props="props">
                            <QTd>
                                <QCheckbox
                                    v-model="props.selected"
                                    :aria-label="props.row.name"
                                    color="association"
                                />
                            </QTd>
                            <QTd
                                key="name"
                                :props="props"
                                headers="name"
                            >
                                {{ props.row.name }}
                            </QTd>
                            <QTd
                                key="acronym"
                                :props="props"
                                headers="acronym"
                            >
                                {{ props.row.acronym }}
                            </QTd>
                            <QTd
                                key="institution"
                                :props="props"
                                headers="institution"
                            >
                                {{ associationStore.institutions.find(obj => obj.id === props.row.institution)?.name }}
                            </QTd>
                            <QTd
                                key="activityField"
                                :props="props"
                                headers="activityField"
                            >
                                {{
                                    associationStore.activityFields.find(obj => obj.id === props.row.activityField)?.name
                                }}
                            </QTd>
                            <QTd
                                key="status"
                                :props="props"
                                class="state-cell"
                                headers="status"
                            >
                                <span
                                    v-if="!props.row.isEnabled"
                                    class="form-state"
                                >
                                    {{ t('association.disabled') }}
                                    <span
                                        aria-hidden="true"
                                        class="form-state-icon form-state-red"
                                    ><i
                                        class="bi bi-x-lg"
                                    ></i></span>
                                </span>
                                <span
                                    v-else
                                    class="form-state"
                                >
                                    {{ t('association.enabled') }}
                                    <span
                                        aria-hidden="true"
                                        class="form-state-icon form-state-green"
                                    ><i
                                        class="bi bi-check-lg"
                                    ></i></span>
                                </span>
                            </QTd>
                            <QTd
                                key="site"
                                :props="props"
                                class="state-cell"
                                headers="site"
                            >
                                <span
                                    v-if="!props.row.isSite"
                                    class="form-state"
                                >
                                    {{ t('association.not-site') }}
                                    <span
                                        aria-hidden="true"
                                        class="form-state-icon form-state-red"
                                    ><i
                                        class="bi bi-x-lg"
                                    ></i></span>
                                </span>
                                <span
                                    v-else
                                    class="form-state"
                                >
                                    {{ t('association.site') }}
                                    <span
                                        aria-hidden="true"
                                        class="form-state-icon form-state-green"
                                    ><i
                                        class="bi bi-check-lg"
                                    ></i></span>
                                    <span v-if="props.row.charterDate">
                                        <br>{{ ` (${new Date(props.row.charterDate).toLocaleDateString()})` }}
                                    </span>
                                </span>
                            </QTd>
                            <QTd
                                key="public"
                                :props="props"
                                class="state-cell"
                                headers="public"
                            >
                                <span
                                    v-if="!props.row.isPublic"
                                    class="form-state"
                                >
                                    {{ t('association.not-public') }}
                                    <span
                                        aria-hidden="true"
                                        class="form-state-icon form-state-red"
                                    ><i
                                        class="bi bi-x-lg"
                                    ></i></span>
                                </span>
                                <span
                                    v-else
                                    class="form-state"
                                >
                                    {{ t('association.public') }}
                                    <span
                                        aria-hidden="true"
                                        class="form-state-icon form-state-green"
                                    ><i
                                        class="bi bi-check-lg"
                                    ></i></span>
                                </span>
                            </QTd>
                            <QTd
                                key="edition"
                                :props="props"
                                class="actions-cell-compact"
                                headers="edition"
                            >
                                <div class="button-container">
                                    <QBtn
                                        :aria-label="t('edit') + ' ' + props.row.name"
                                        :to="{ name: 'EditAssociation', params: { id: props.row.id } }"
                                        color="association"
                                        icon="bi-pencil"
                                        outline
                                    />
                                </div>
                            </QTd>
                        </QTr>
                    </template>
                    <template v-slot:pagination="scope">
                        {{
                            t('table.results-amount', {
                                firstResult: scope.pagination.rowsPerPage * (scope.pagination.page - 1) + 1,
                                lastResult: scope.pagination.rowsPerPage * scope.pagination.page,
                                amountResults: scope.pagination.rowsPerPage * scope.pagesNumber
                            })
                        }}
                        <QBtn
                            v-if="scope.pagesNumber > 2"
                            :aria-label="t('table.first-page')"
                            :disable="scope.isFirstPage"
                            color="grey-8"
                            dense
                            flat
                            icon="bi-chevron-double-left"
                            @click="scope.firstPage"
                        />
                        <QBtn
                            :aria-label="t('table.previous-page')"
                            :disable="scope.isFirstPage"
                            color="grey-8"
                            dense
                            flat
                            icon="bi-chevron-left"
                            @click="scope.prevPage"
                        />
                        <QBtn
                            :aria-label="t('table.next-page')"
                            :disable="scope.isLastPage"
                            color="grey-8"
                            dense
                            flat
                            icon="bi-chevron-right"
                            @click="scope.nextPage"
                        />
                        <QBtn
                            v-if="scope.pagesNumber > 2"
                            :aria-label="t('table.last-page')"
                            :disable="scope.isLastPage"
                            color="grey-8"
                            dense
                            flat
                            icon="bi-chevron-double-right"
                            @click="scope.lastPage"
                        />
                    </template>
                </QTable>
                <AlertConfirmAssociationsChanges
                    :selectedAssociations="selected"
                    @update-selected-associations="selected = []"
                />
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';
@import '@/assets/variables.scss';

.q-table tr th:first-child {
    text-align: left;
}

@media screen and (max-width: $breakpoint-lg) {
    .flex-row-space-between {
        flex-direction: column;

        h2 {
            padding-bottom: 0;
        }

        .q-btn {
            margin: 1rem;
        }
    }
}
</style>
