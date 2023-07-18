<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import useCharters from '@/composables/useCharters'
import {onMounted} from 'vue'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import TableStudentCharterBtn from '@/components/charter/TableStudentCharterBtn.vue'
import CharterStatusIndicator from '@/components/charter/CharterStatusIndicator.vue'


const {t} = useI18n()
const {loading, notify} = useQuasar()
const {initCharters, manageCharters} = useCharters()
const {catchHTTPError} = useErrors()


const importedProps = defineProps<{
    associationId: number
}>()


async function onGetCharters() {
    if (importedProps.associationId) {
        try {
            await initCharters(importedProps.associationId)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
                })
            }
        }
    }
}

onMounted(async () => {
    loading.show()
    await onGetCharters()
    loading.hide()
})

const columns: QTableProps['columns'] = [
    {name: 'charter', align: 'left', label: t('charter.table-title'), field: 'charter', sortable: true},
    {name: 'validatedDate', align: 'left', label: t('charter.validated-date'), field: 'validatedDate', sortable: true},
    {
        name: 'expirationDate',
        align: 'left',
        label: t('charter.expiration-date'),
        field: 'expirationDate',
        sortable: true
    },
    {name: 'status', align: 'right', label: t('status'), field: 'status', sortable: true},
    {name: 'actions', align: 'center', label: t('manage'), field: 'actions', sortable: true}
]
</script>

<template>
    <section class="dashboard-section">
        <div class="dashboard-section-container">
            <div class="container">
                <QTable
                    :columns="columns"
                    :rows="manageCharters"
                    :rows-per-page-options="[10, 20, 50, 0]"
                    row-key="name"
                    role="presentation"
                >
                    <template v-slot:header="props">
                        <QTr :props="props">
                            <QTh
                                v-for="col in props.cols"
                                :key="col.name"
                                :props="props"
                                scope="col"
                                :id="col.name"
                            >
                                {{ col.label }}
                            </QTh>
                        </QTr>
                    </template>
                    <template v-slot:body="props">
                        <QTr :props="props">
                            <QTd
                                key="charter"
                                :props="props"
                                headers="charter"
                            >
                                {{ props.row.documentName }}
                            </QTd>
                            <QTd
                                key="validatedDate"
                                :props="props"
                                headers="validatedDate"
                            >
                                {{ props.row.validatedDate }}
                            </QTd>
                            <QTd
                                key="expirationDate"
                                :props="props"
                                headers="expirationDate"
                            >
                                {{ props.row.expirationDate }}
                            </QTd>
                            <QTd
                                key="status"
                                :props="props"
                                headers="status"
                            >
                                <CharterStatusIndicator :charter-status="props.row.charterStatus"/>
                            </QTd>
                            <QTd
                                key="actions"
                                :props="props"
                                headers="actions"
                            >
                                <TableStudentCharterBtn
                                    :association-id="importedProps.associationId"
                                    :charter="props.row"
                                />
                            </QTd>
                        </QTr>
                    </template>
                    <template v-slot:pagination="scope">
                        {{ t('table.results-amount', {
                            firstResult: scope.pagination.rowsPerPage * (scope.pagination.page - 1) + 1,
                            lastResult: scope.pagination.rowsPerPage * scope.pagination.page,
                            amountResults: scope.pagination.rowsPerPage * scope.pagesNumber
                        }) }}
                        <QBtn
                            v-if="scope.pagesNumber > 2"
                            icon="bi-chevron-double-left"
                            color="grey-8"
                            dense
                            flat
                            :disable="scope.isFirstPage"
                            @click="scope.firstPage"
                            :aria-label="t('table.first-page')"
                        />
                        <QBtn
                            icon="bi-chevron-left"
                            color="grey-8"
                            dense
                            flat
                            :disable="scope.isFirstPage"
                            @click="scope.prevPage"
                            :aria-label="t('table.previous-page')"
                        />
                        <QBtn
                            icon="bi-chevron-right"
                            color="grey-8"
                            dense
                            flat
                            :disable="scope.isLastPage"
                            @click="scope.nextPage"
                            :aria-label="t('table.next-page')"
                        />
                        <QBtn
                            v-if="scope.pagesNumber > 2"
                            icon="bi-chevron-double-right"
                            color="grey-8"
                            dense
                            flat
                            :disable="scope.isLastPage"
                            @click="scope.lastPage"
                            :aria-label="t('table.last-page')"
                        />
                    </template>
                </QTable>
            </div>
        </div>
    </section>
</template>
