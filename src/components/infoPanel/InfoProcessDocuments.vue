<script lang="ts" setup>
import axios from 'axios'
import {useI18n} from 'vue-i18n'
import useDocumentUploads from '@/composables/useDocumentUploads'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {onMounted} from 'vue'
import type {DocumentProcessType} from '#/documents'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {getDocuments, initProcessDocuments, processDocuments} = useDocumentUploads()
const {catchHTTPError} = useErrors()

const props = defineProps<{
    processes: DocumentProcessType[]
}>()

async function onGetDocumentTypes() {
    try {
        await getDocuments(props.processes)
        initProcessDocuments()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response.status)
            })
        }
    }
}

onMounted(async () => {
    loading.show()
    await onGetDocumentTypes()
    loading.hide()
})
</script>

<template>
    <div class="info-panel">
        <i
            aria-hidden="true"
            class="bi bi-info"
        ></i>
        <p>{{ t('project.form-help') }}</p>
        <p>
            {{ t('project.required-documents-list') + ' :' }}
        </p>
        <ul>
            <li
                v-for="(document, index) in processDocuments"
                :key="index"
            >
                <span v-if="document.pathTemplate">
                    <a
                        :href="document.pathTemplate"
                        :title="t('project.document.download-template')"
                        target="_blank"
                    >{{ document.description }}</a>
                </span>
                <span v-else>{{ document.description }}</span>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/dashboard.scss";
@import "@/assets/styles/forms.scss";
</style>
