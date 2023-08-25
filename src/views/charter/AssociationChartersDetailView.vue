<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useRoute} from 'vue-router'
import axios from 'axios'
import {QTableProps, useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import {onMounted, ref} from 'vue'
import useUtility from '@/composables/useUtility'
import useCharters from '@/composables/useCharters'
import CharterStatusIndicator from '@/components/charter/CharterStatusIndicator.vue'
import TableManagerChartersBtn from '@/components/charter/TableManageChartersBtn.vue'

const associationStore = useAssociationStore()
const route = useRoute()
const {notify, loading} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()
const {dynamicTitle} = useUtility()
const {initCharters, manageCharters} = useCharters()

const associationId = ref<number | undefined>(undefined)

async function onGetAssociationDetail() {
    if (associationId.value) {
        try {
            await associationStore.getAssociationDetail(associationId.value, true)
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

async function onGetAssociationCharters() {
    if (associationId.value) {
        try {
            await initCharters(associationId.value, associationStore.association?.isSite as boolean)
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
    associationId.value = parseInt(route.params.associationId as string)
    await onGetAssociationDetail()
    dynamicTitle.value = associationStore.association?.name + ' - ' + t('charter.association-charters')
    await onGetAssociationCharters()
    loading.hide()
})

const columns: QTableProps['columns'] = [
    {name: 'charter', align: 'left', label: t('charter.charter', 2), field: 'charter', sortable: true},
    {name: 'validatedDate', align: 'left', label: t('charter.validated-date'), field: 'validatedDate', sortable: true},
    {
        name: 'expirationDate',
        align: 'left',
        label: t('charter.expiration-date'),
        field: 'expirationDate',
        sortable: true
    },
    {name: 'status', align: 'right', label: t('status'), field: 'status', sortable: true},
    {name: 'actions', align: 'center', label: t('manage'), field: 'actions', sortable: false}
]
</script>

<template>
    <section class="dashboard-section">
        <!--        <h2>
                    <QIcon name="bi-book"/>
                    {{ t('charter.association-charters') }}
                </h2>-->
        <div class="dashboard-section-container">
            <div class="container">
                <QTable
                    :columns="columns"
                    :loading="!manageCharters.length"
                    :rows="manageCharters"
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
                                <TableManagerChartersBtn
                                    :association-id="associationId"
                                    :charter="props.row"
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
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
@import "@/assets/styles/forms.scss";
@import "@/assets/_variables.scss";

</style>