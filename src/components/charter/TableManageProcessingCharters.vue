<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import useCharters from '@/composables/useCharters'
import type {QTableProps} from 'quasar'
import CharterStatusIndicator from '@/components/charter/CharterStatusIndicator.vue'
import useUtility from '@/composables/useUtility'
import {ref} from 'vue'
import type {DocumentProcessType} from '#/documents'
import CharterValidation from '@/components/charter/CharterValidation.vue'


const {t} = useI18n()
const {processingCharters} = useCharters()
const {formatDate} = useUtility()

const props = defineProps<{
    processType: DocumentProcessType
}>()

const open = ref<boolean>(false)
const association = ref<number>()
const charter = ref<number>()


const columns: QTableProps['columns'] = [
    {name: 'association', align: 'left', label: t('association.association'), field: 'association', sortable: true},
    {
        name: 'institution',
        align: 'left',
        label: t('association.labels.institution'),
        field: 'institution',
        sortable: true
    },
    {
        name: 'charter',
        align: 'left',
        label: t('charter.charter', 1),
        field: 'charter',
        sortable: true
    },
    {
        name: 'uploadedDate',
        align: 'left',
        label: t('charter.uploaded-date'),
        field: 'uploadedDate',
        sortable: true
    },
    {
        name: 'charterStatus',
        align: 'right',
        label: t('status'),
        field: 'charterStatus',
        sortable: true
    },
    {name: 'actions', align: 'center', label: t('manage'), field: 'actions', sortable: false}
]
</script>

<template>
    <QTable
        :columns="columns"
        :rows="processingCharters"
        :rows-per-page-options="[10, 20, 50, 0]"
        role="presentation"
        row-key="name"
    >
        <template v-slot:header="props">
            <QTr :props="props">
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
                <QTd
                    key="association"
                    :props="props"
                    headers="association"
                >
                    {{ props.row.associationName }}
                </QTd>
                <QTd
                    key="institution"
                    :props="props"
                    headers="institution"
                >
                    {{ props.row.institution }}
                </QTd>
                <QTd
                    key="charter"
                    :props="props"
                    headers="charter"
                >
                    {{ props.row.charterName }}
                </QTd>
                <QTd
                    key="uploadedDate"
                    :props="props"
                    headers="uploadedDate"
                >
                    {{ formatDate(props.row.uploadedDate)?.split('-').reverse().join('/') }}
                </QTd>
                <QTd
                    key="charterStatus"
                    :props="props"
                    headers="charterStatus"
                >
                    <CharterStatusIndicator :charter-status="props.row.charterStatus"/>
                </QTd>
                <QTd
                    key="actions"
                    :props="props"
                    headers="actions"
                >
                    <QBtn
                        :label="t('manage')"
                        :to="{name: 'AssociationChartersDetail', params: {associationId: props.row.associationId}}"
                        color="charter"
                        outline
                    />
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
    <QDialog v-model="open">
        <QCard class="variant-space-2">
            <QCardSection class="q-pt-none flex-column">
                <CharterValidation
                    :association="association"
                    :charter="charter"
                    :process-type="props.processType"
                    @close-dialog="open = false"
                />
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

ul {
    padding-left: 0;
}

ul li {
    list-style: none;
    text-align: right;
}
</style>
