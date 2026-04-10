<script lang="ts" setup>
import {onMounted} from 'vue'
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import axios from 'axios'
import useCommissions from '@/composables/useCommissions'


const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {
    getCommissionsForManagers,
    commissions
} = useCommissions()

onMounted(async () => {
    loading.show()
    await onGetCommissions()
    loading.hide()
})

async function onGetCommissions() {
    try {
        await getCommissionsForManagers(undefined, false, false, undefined, true)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
}

const columns: QTableProps['columns'] = [
    {name: 'name', align: 'left', label: t('commission.name'), field: 'name', sortable: true},
    {name: 'commissionDate', align: 'left', label: t('commission.date'), field: 'commissionDate', sortable: true},
    {name: 'viewProjects', align: 'center', label: t('view.projects'), field: 'viewProject', sortable: false},
]

</script>

<template>
    <section class="dashboard-section">
        <div class="dashboard-section-container">
            <div class="container">
                <QTable
                    :columns="columns"
                    :loading="!commissions"
                    :rows="commissions"
                    :rows-per-page-options="[10, 20, 50, 0]"
                    :title="t('commission.archived')"
                    role="presentation"
                    row-key="name"
                    wrap-cells
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
                                key="name"
                                :props="props"
                                headers="name"
                            >
                                {{ props.row.name }}
                            </QTd>
                            <QTd
                                key="commissionDate"
                                :props="props"
                                headers="commissionDate"
                            >
                                {{ props.row.commissionDate.split('-').reverse().join('/') }}
                            </QTd>
                            <QTd
                                key="viewProjects"
                                :props="props"
                                class="actions-cells"
                                headers="viewProjects"
                            >
                                <div class="button-container">
                                    <QBtn
                                        :label="t('view.projects')"
                                        :to="{ name: 'ArchivedCommissionDetail', params: { id: props.row.id } }"
                                        color="commission"
                                        outline
                                    />
                                </div>
                            </QTd>
                        </QTr>
                    </template>
                </QTable>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';

.form {
    width: 80% !important;
}
</style>
