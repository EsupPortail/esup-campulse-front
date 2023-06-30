<script lang="ts" setup>
import type {ProcessDocument} from '#/documents'
import {DocumentProcessType} from '#/documents'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import {useProjectStore} from '@/stores/useProjectStore'
import useCharters from '@/composables/useCharters'
import useDocumentUploads from '@/composables/useDocumentUploads'
import {onMounted} from 'vue'

const {createFileLink} = useDocumentUploads()
const {notify, loading} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()
const {
    processDocuments,
    documentUploads,
    initProjectDocumentUploads,
    initProcessDocuments,
    getDocuments,
    initCharterDocumentUploads
} = useDocumentUploads()
const {getCharterDocuments} = useCharters()
const projectStore = useProjectStore()

const props = defineProps<{
    process: 'project' | 'review' | 'charter',
    associationId: number | null
}>()


async function onGetFile(uploadedDocument: ProcessDocument) {
    loading.show()
    try {
        await createFileLink(uploadedDocument)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
    loading.hide()
}

// GET PROJECT DOCUMENTS
async function onGetDocuments() {
    loading.show()
    try {
        let processes: DocumentProcessType[] = []
        if (props.process === 'project') processes = ['DOCUMENT_PROJECT']
        else if (props.process === 'review') processes = ['DOCUMENT_PROJECT_REVIEW']
        else if (props.process === 'charter') processes = ['CHARTER_ASSOCIATION', 'DOCUMENT_ASSOCIATION']
        await getDocuments(processes)
        initProcessDocuments()
        if (props.process === 'project' || props.process === 'review') {
            await projectStore.getProjectDocuments()
            initProjectDocumentUploads()
        } else if (props.process === 'charter') {
            if (props.associationId) {
                await getCharterDocuments(props.associationId)
                initCharterDocumentUploads()
            }
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
    loading.hide()
}

onMounted(async () => await onGetDocuments())
</script>

<template>
    <section class="flex-column padding-top padding-bottom">
        <div
            v-for="(document, index) in processDocuments"
            :key="index"
            class="display-row"
        >
            <h4>{{ document.description }}</h4>
            <p class="paragraph">
                <ul role="list">
                    <li
                        v-for="uploadedDocument in documentUploads.filter(obj => obj.document === document.document)"
                        :key="uploadedDocument.id"
                        @click="onGetFile(uploadedDocument)"
                    >
                        {{ uploadedDocument.name }}
                    </li>
                </ul>
            </p>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
@import "@/assets/_variables.scss";

ul > li {
  text-decoration: underline;
  font-weight: $semibold-weight;
  cursor: pointer;
  color: inherit;
}

ul, li {
  padding-left: 0 !important;
}
</style>