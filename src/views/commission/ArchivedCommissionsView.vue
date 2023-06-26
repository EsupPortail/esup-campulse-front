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
        await getCommissionsForManagers(false, false, undefined, true)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
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
                        row-key="name"
                >
                    <template v-slot:body="props">
                        <QTr :props="props">
                            <QTd
                                    key="name"
                                    :props="props"
                            >
                                {{ props.row.name }}
                            </QTd>
                            <QTd
                                    key="commissionDate"
                                    :props="props"
                            >
                                {{ props.row.commissionDate.split('-').reverse().join('/') }}
                            </QTd>
                            <QTd
                                    key="viewProjects"
                                    :props="props"
                                    class="actions-cells"
                            >
                                <div class="button-container">
                                    <QBtn
                                            :label="t('view.projects')"
                                            :to="{name: 'ArchivedCommissionDetail', params: {id: props.row.id}}"
                                            icon="bi-eye"
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
