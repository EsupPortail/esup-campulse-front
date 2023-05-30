<script lang="ts" setup>
import type {DocumentProcessType} from '#/documents'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

interface LibraryDocument {
    id: number,
    name: string,
    path: string | null,
    process: DocumentProcessType
}

const props = defineProps<{
    documents: LibraryDocument[],
}>()

function onDownloadDocument(documentId: number) {
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
                    <i class="bi bi-arrow-bar-down"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="sass" scoped>
@import '@/assets/_variables.scss'

.library-document
    span
        display: flex !important
        gap: 0.3rem

        a
            color: inherit
            text-decoration: none

        i
            display: none
            color: $dashboardColor

    .active-link
        a
            color: $dashboardColor

            &:hover
                text-decoration: underline

        &:hover

            i
                display: inline
</style>
