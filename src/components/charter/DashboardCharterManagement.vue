<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {QTableProps, useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import useCharters from '@/composables/useCharters'
import {useAssociationStore} from '@/stores/useAssociationStore'
import CharterStatusIndicator from '@/components/charter/CharterStatusIndicator.vue'

const {loading, notify} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()
const {associationCharters, initAssociationCharters} = useCharters()
const associationStore = useAssociationStore()

const tab = ref('associationCharters')

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
        align: 'center',
        label: t('charter.association-charter'),
        field: 'charterStatus',
        sortable: true
    },
    {name: 'actions', align: 'center', label: t('manage'), field: 'actions', sortable: false}
]

const chartersToManage: QTableProps['columns'] = [
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
        align: 'center',
        label: t('charter.association-charter'),
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
                :columns="chartersToManage"
                :rows="charterDocuments"
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
    </QTabPanels>
</template>