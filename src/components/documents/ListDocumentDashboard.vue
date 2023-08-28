<script lang="ts" setup>
import type {DocumentUpload} from '#/documents'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

const props = defineProps<{
    documents: DocumentUpload[],
}>()

function onDownloadDocument(documentId: number | undefined) {
    const documentToDownload = props.documents.find(doc => doc?.id === documentId)
    if (documentToDownload && documentToDownload.pathFile && documentToDownload.name) {
        const anchor = document.createElement('a')
        anchor.href = documentToDownload.pathFile
        anchor.download = documentToDownload.name
        anchor.target = '_blank'
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)
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
