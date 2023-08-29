<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import useCommissions from '@/composables/useCommissions'
import type {ProjectList} from '#/project'

const {t} = useI18n()
const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()
const {getCommissionCSVExport} = useCommissions()

const props = defineProps<{
    commissionId: number,
    commissionName: string,
    selected: ProjectList[]
}>()

async function onExportCSV() {
    loading.show()
    try {
        const file = await getCommissionCSVExport(props.commissionId)
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(new Blob([file]))
        link.download = `${t('commission.csv-name')}${encodeURI(props.commissionName)}.csv`
        document.body.appendChild(link)
        link.click()
        link.remove()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response.status)
            })
        }
    }
    loading.hide()
}
</script>

<template>
    <div class="flex-row-center padding-top">
        <QBtn
            :disable="!props.selected.length"
            :label="t('commission.export-csv')"
            class="btn-lg"
            color="commission"
            icon="bi-filetype-csv"
            @click="onExportCSV"
        />
        <QBtn
            :disable="!props.selected.length"
            :label="t('commission.export-pdf')"
            class="btn-lg"
            color="commission"
            icon="bi-filetype-pdf"
            @click="onExportPDF"
        />
    </div>
</template>
