<script lang="ts" setup>
import useDocumentUploads from '@/composables/useDocumentUploads'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import type {DocumentProcessType, ProcessDocument} from '#/documents'
import {useProjectStore} from '@/stores/useProjectStore'
import {onMounted, ref} from 'vue'
import useCharters from '@/composables/useCharters'

const {
    processDocuments,
    documentUploads,
    deleteDocumentUpload,
    getFile,
    initProjectDocumentUploads,
    initProcessDocuments,
    getDocuments,
    initCharterDocumentUploads,
    getStudentCertificate
} = useDocumentUploads()
const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {getCharterDocuments} = useCharters()
const projectStore = useProjectStore()

const props = defineProps<{
    process: 'project' | 'review' | 'charter' | 'registration',
    associationId: number | null
}>()

// CONST
const MAX_FILES = 10
const MAX_FILE_SIZE = 8388608

// COLOR
const fieldColor = ref<string>('')

// INIT FIELD COLOR
const initFieldColor = () => {
    let color = ''
    if (props.process === 'project' || props.process === 'review') color = 'commission'
    else if (props.process === 'charter') color = 'charter'
    else color = 'dashboard'
    fieldColor.value = color
}

onMounted(async () => {
    await onGetDocuments()
    initFieldColor()
})

// GET PROJECT DOCUMENTS
async function onGetDocuments() {
    loading.show()
    try {
        // Get documents for project, review and charter processes
        let processes: DocumentProcessType[] = []

        if (props.process === 'project') processes = ['DOCUMENT_PROJECT']
        else if (props.process === 'review') processes = ['DOCUMENT_PROJECT_REVIEW']
        else if (props.process === 'charter') processes = ['CHARTER_ASSOCIATION', 'DOCUMENT_ASSOCIATION']

        // Get documents by processes
        if (processes.length) await getDocuments(processes)

        // Get only one specific document for registration
        if (props.process === 'registration') await getStudentCertificate()

        // Init documents for form
        initProcessDocuments()

        // Get uploaded documents for projet, review, charter
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

// FILE TOO LARGE
async function onDocumentRejected() {
    notify({
        type: 'negative',
        message: t('notifications.negative.413-error')
    })
}

// DELETE DOCS
async function onDeleteDocumentUpload(documentId: number) {
    loading.show()
    try {
        await deleteDocumentUpload(documentId)
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

// CREATE LINK TO VIEW FILE
async function onGetFile(uploadedDocument: ProcessDocument) {
    try {
        const file = await getFile(uploadedDocument.pathFile as string)
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(file)
        link.download = uploadedDocument.name as string
        document.body.appendChild(link)
        link.click()
        link.remove()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}
</script>

<template>
    <section class="flex-section">
        <div
            v-for="(document, index) in processDocuments"
            :key="index"
        >
            <QFile
                v-model="document.pathFile"
                :accept="document.mimeTypes?.join(', ')"
                :aria-required="document.isRequiredInProcess"
                :color="fieldColor"
                :disable="document.isMultiple && documentUploads.filter(obj => obj.document === document.document).length >= MAX_FILES ||
                    !document.isMultiple && documentUploads.filter(obj => obj.document === document.document).length === 1"
                :hint="props.process === 'registration' ? t('forms.student-certificate-hint')
                    : (t('project.document-hint') + (document.isMultiple ? (' ' + t('project.document-hint-multiple')) : ''))"
                :label="props.process === 'registration' ? t('forms.student-certificate')
                    : (document.description + (document.isRequiredInProcess ? ' *' : ''))"
                :max-file-size="MAX_FILE_SIZE"
                :max-files="document.isMultiple ? (MAX_FILES - documentUploads.filter(obj => obj.document === document.document).length) :
                    (1 - documentUploads.filter(obj => obj.document === document.document).length)"
                :multiple="document.isMultiple"
                :rules="document.isRequiredInProcess ? [val => val || t('forms.select-document')] : []"
                append
                clearable
                counter
                filled
                lazy-rules
                use-chips
                @rejected="onDocumentRejected"
            >
                <template v-slot:prepend>
                    <QIcon name="bi-paperclip"/>
                </template>
            </QFile>

            <div
                v-if="document.pathTemplate"
                class="info-panel info-panel-warning"
            >
                <i
                    aria-hidden="true"
                    class="bi bi-exclamation-lg"
                ></i>
                <p>
                    {{ t('project.document.use-template') }} <span>
                        <a
                            :href="document.pathTemplate"
                            target="_blank"
                        >{{
                            `${t('project.document.download-template')} "${document.description}".`
                        }}</a></span>
                </p>
            </div>

            <div class="document-input-group">
                <div class="document-input variant-space-3">
                    <ul class="document-input-list">
                        <li
                            v-for="uploadedDocument in documentUploads.filter(obj => obj.document === document.document)"
                            :key="uploadedDocument.id"
                            class="document-item"
                        >
                            <p @click="onGetFile(uploadedDocument)">
                                <i
                                    aria-hidden="true"
                                    class="bi bi-file-earmark"
                                ></i>
                                {{ uploadedDocument.name }}
                                <i
                                    :aria-label="t('download')"
                                    class="bi bi-eye"
                                ></i>
                            </p>
                            <button
                                type="button"
                                @click="onDeleteDocumentUpload(uploadedDocument.id ? uploadedDocument.id : 0)"
                            >
                                <i class="bi bi-x-lg"></i>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/_variables.scss';

ul.document-input-list {
    list-style: none;
}

ul.document-input-list li {
    cursor: pointer;
}

</style>