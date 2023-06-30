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
                >
                    <template v-slot:body="props">
                        <QTr :props="props">
                            <QTd
                                key="charter"
                                :props="props"
                            >
                                {{ props.row.documentName }}
                            </QTd>
                            <QTd
                                key="validatedDate"
                                :props="props"
                            >
                                {{ props.row.validatedDate }}
                            </QTd>
                            <QTd
                                key="expirationDate"
                                :props="props"
                            >
                                {{ props.row.expirationDate }}
                            </QTd>
                            <QTd
                                key="status"
                                :props="props"
                            >
                                <CharterStatusIndicator :charter-status="props.row.charterStatus"/>
                            </QTd>
                            <QTd
                                key="actions"
                                :props="props"
                            >
                                <TableStudentCharterBtn
                                    :association-id="importedProps.associationId"
                                    :charter="props.row"
                                />
                            </QTd>
                        </QTr>
                    </template>
                </QTable>
            </div>
        </div>
    </section>
</template>
