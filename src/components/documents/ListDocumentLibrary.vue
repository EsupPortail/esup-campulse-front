<script lang="ts" setup>
import type {DocumentProcessType} from '#/documents'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

interface LibraryDocument {
    id: number,
    name: string,
    path: string | undefined,
    process: DocumentProcessType
}

const props = defineProps<{
    documents: LibraryDocument[],
}>()

function onDownloadDocument(documentId: number | undefined) {
    const documentToDownload = props.documents.find(doc => doc?.id === documentId)
    if (documentToDownload && documentToDownload.path) {
        const anchor = document.createElement('a')
        anchor.href = documentToDownload.path
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
                        <a
                            :href="document.path"
                            target="_blank"
                        >
                            {{ document?.name }}
                        </a>
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
</style>
