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
const {getCommissionExport} = useCommissions()

const props = defineProps<{
    commissionId: number,
    commissionName: string,
    selected: ProjectList[] | undefined
}>()

async function onExportCommission(mode: 'csv' | 'pdf' | 'xlsx') {
    loading.show()
    try {
        const projects = props.selected?.map(project => project.id)
        const file = await getCommissionExport(props.commissionId, mode, projects)
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(new Blob([file]))
        link.download = `${t('commission.export-name')}${encodeURI(props.commissionName)}.${mode}`
        document.body.appendChild(link)
        link.click()
        link.remove()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
    loading.hide()
}
</script>

<template>
    <div class="flex-row-center padding-top">
        <QBtn
            :disable="!props.selected?.length"
            :label="t('commission.export-pdf')"
            class="btn-lg"
            color="commission"
            icon="bi-filetype-pdf"
            @click="onExportCommission('pdf')"
        />
        <QBtn
            :disable="!props.selected?.length"
            :label="t('commission.export-csv')"
            class="btn-lg"
            color="commission"
            icon="bi-filetype-csv"
            @click="onExportCommission('csv')"
        />
        <QBtn
            :disable="!props.selected?.length"
            :label="t('commission.export-xlsx')"
            class="btn-lg"
            color="commission"
            icon="bi-filetype-xlsx"
            @click="onExportCommission('xlsx')"
        />
    </div>
</template>
