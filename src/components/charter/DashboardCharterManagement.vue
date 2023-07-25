<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {QTableProps, useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import useCharters from '@/composables/useCharters'
import {useAssociationStore} from '@/stores/useAssociationStore'
import CharterStatusIndicator from '@/components/charter/CharterStatusIndicator.vue'
import TableManageChartersBtn from '@/components/charter/TableManageChartersBtn.vue'
import useUtility from '@/composables/useUtility'

const {loading, notify} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()
const {associationCharters, initAssociationCharters, initChartersToManage, chartersToManage} = useCharters()
const associationStore = useAssociationStore()
const {formatDate} = useUtility()

const tab = ref('associationCharters')
watch(() => tab.value, () => {
    loading.show()
    if (tab.value === 'chartersToManage') {
        initChartersToManage()
    }
    loading.hide()
})

const associationChartersColumns: QTableProps['columns'] = [
    {name: 'association', align: 'left', label: t('association.association'), field: 'association', sortable: true},
    {
        name: 'institution',
        align: 'left',
        label: t('association.labels.institution'),
        field: 'institution',
        sortable: false
    },
    {
        name: 'charterStatus',
        align: 'right',
        label: t('charter.association-charter'),
        field: 'charterStatus',
        sortable: true
    },
    {name: 'actions', align: 'center', label: t('manage'), field: 'actions', sortable: false}
]

const chartersToManageColumns: QTableProps['columns'] = [
    {name: 'association', align: 'left', label: t('association.association'), field: 'association', sortable: true},
    {
        name: 'institution',
        align: 'left',
        label: t('association.labels.institution'),
        field: 'institution',
        sortable: false
    },
    {
        name: 'charterName',
        align: 'left',
        label: t('charter.charter', 1),
        field: 'charterName',
        sortable: true
    },
    {
        name: 'uploadedDate',
        align: 'left',
        label: t('charter.uploaded-date', 1),
        field: 'uploadedDate',
        sortable: true
    },
    {
        name: 'charterStatus',
        align: 'right',
        label: t('status',),
        field: 'charterStatus',
        sortable: true
    },
    {name: 'actions', align: 'center', label: t('manage'), field: 'actions', sortable: false}
]

async function onGetAssociationCharters() {
    try {
        await associationStore.getAssociations(false)
        await initAssociationCharters()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

onMounted(async () => {
    loading.show()
    await onGetAssociationCharters()
    loading.hide()
})

</script>

<template>
    <QTabs
        v-model="tab"
        active-color="charter"
        align="justify"
        indicator-color="charter"
        narrow-indicator
    >
        <QTab
            :label="t('charter.association-charters')"
            name="associationCharters"
        />
        <QTab
            :label="t('charter.charters-to-manage')"
            name="chartersToManage"
        />
    </QTabs>

    <QSeparator
        aria-hidden="true"
    />

    <QTabPanels
        v-model="tab"
        animated
    >
        <QTabPanel
            name="associationCharters"
        >
            <QTable
                :columns="associationChartersColumns"
                :rows="associationCharters"
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
                            {{ props.row.associationInstitution }}
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
                                color="charter"
                                label="Gérer les chartes"
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
        </QTabPanel>
        <QTabPanel
            name="chartersToManage"
        >
            <QTable
                :columns="chartersToManageColumns"
                :rows="chartersToManage"
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
                            {{ props.row.associationInstitution }}
                        </QTd>
                        <QTd
                            key="charterName"
                            :props="props"
                            headers="charterName"
                        >
                            {{ props.row.charterName }}
                        </QTd>
                        <QTd
                            key="uploadedDate"
                            :props="props"
                            headers="uploadedDate"
                        >
                            {{ formatDate(props.row.uploadedDate).split('-').reverse().join('/') }}
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
                            <TableManageChartersBtn
                                :association-id="props.row.associationId"
                                :charter="props.row.charterId"
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
        </QTabPanel>
    </QTabPanels>
</template>