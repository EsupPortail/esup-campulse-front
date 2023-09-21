<script lang="ts" setup>
import type {DocumentProcessType} from '#/documents'
import {useI18n} from 'vue-i18n'
import useDocuments from '@/composables/useDocuments'

const {t} = useI18n()
const {createFileLink} = useDocuments()

interface LibraryDocument {
    id: number,
    name: string,
    path: string | undefined,
    size: number,
    process: DocumentProcessType
}

const props = defineProps<{
    documents: LibraryDocument[],
}>()

function onDownloadDocument(documentId: number | undefined) {
    const documentToDownload = props.documents.find(doc => doc?.id === documentId)
    if (documentToDownload && documentToDownload.path) {
        createFileLink(documentToDownload.path, documentToDownload.name)
    }
}
</script>

<template>
    <div v-if="props.documents.length">
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
    </div>
    <div v-else>
        <p>{{ t('documents.no-document-to-show') }}</p>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/documents.scss';
</style>
