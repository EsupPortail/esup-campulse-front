<script lang="ts" setup>
import type {DocumentUpload} from '#/documents'
import {useI18n} from 'vue-i18n'
import useDocumentUploads from '@/composables/useDocumentUploads'

const {t} = useI18n()
const {createUploadedFileLink} = useDocumentUploads()

const props = defineProps<{
    documents: DocumentUpload[],
}>()

async function onDownloadDocument(documentId: number | undefined) {
    const documentToDownload = props.documents.find(doc => doc?.id === documentId)
    if (documentToDownload && documentToDownload.pathFile && documentToDownload.name) {
        await createUploadedFileLink(documentToDownload.pathFile, documentToDownload.name)
    }
}
</script>

<template>
    <div
        v-for="(document, index) in props.documents"
        :key="index"
        class="document-input-group"
    >
        <div class="document-input variant-space-1">
            <div class="document-input-header">
                <h4 class="library-document">
                    <span>
                        <strong>{{ document?.name }}</strong>
                        <em>{{ Math.floor(document?.size / 1000) + ' kb' }}</em>
                    </span>
                </h4>
                <button
                    :aria-label="t('download') + ' ' + document?.name"
                    @click.prevent="onDownloadDocument(document?.id)"
                >
                    <i
                        aria-hidden="true"
                        class="bi bi-arrow-bar-down"
                    ></i>
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/documents.scss';
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';
</style>
