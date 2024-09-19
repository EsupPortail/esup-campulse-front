<script lang="ts" setup>
import useDocumentUploads from '@/composables/useDocumentUploads'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import type {DocumentProcessType, ProcessDocument, UploadedProcessDocument} from '#/documents'
import {useProjectStore} from '@/stores/useProjectStore'
import {onMounted, ref} from 'vue'
import useCharters from '@/composables/useCharters'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {useUserStore} from '@/stores/useUserStore'
import useSubmitProject from '@/composables/useSubmitProject'
import useDocuments from '@/composables/useDocuments'

const {
    processDocuments,
    documentUploads,
    deleteDocumentUpload,
    getFile,
    initProjectDocumentUploads,
    initProcessDocuments,
    getDocuments,
    initCharterDocumentUploads,
    getStudentCertificate,
    initManagedUserDocumentUploads,
    initUserDocumentUploads,
    MAX_FILE_SIZE,
    MAX_FILES,
    MAX_TITLE_LENGTH
} = useDocumentUploads()
const {acceptedFormats} = useDocuments()
const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {getCharterDocuments} = useCharters()
const projectStore = useProjectStore()
const userManagerStore = useUserManagerStore()
const userStore = useUserStore()
const {projectFunds, initProjectFunds} = useSubmitProject()

const props = defineProps<{
    process: 'project' | 'review' | 'charter' | 'registration' | 'account-management' | 'user-management',
    associationId: number | null | undefined
}>()

// COLOR
const fieldColor = ref<string>('')

// INIT FIELD COLOR
const initFieldColor = () => {
    let color: string
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

        // Get only one specific document for registration or account management
        if (props.process === 'registration' || props.process === 'account-management' || props.process === 'user-management') await getStudentCertificate()

        // Init documents for form
        if (props.process === 'project') initProjectFunds()
        initProcessDocuments(props.process === 'project', projectFunds.value ?? [])

        // Get uploaded documents for project, review, charter
        if (props.process === 'project' || props.process === 'review') {
            await projectStore.getProjectDocuments()
            initProjectDocumentUploads()
        } else if (props.process === 'charter') {
            if (props.associationId) {
                await getCharterDocuments(props.associationId)
                initCharterDocumentUploads()
            }
        } else if (props.process === 'user-management') {
            await userManagerStore.getUserDocuments()
            initManagedUserDocumentUploads()
        } else if (props.process === 'account-management') {
            await userStore.getUserDocuments()
            initUserDocumentUploads()
        } else if (props.process === 'registration') {
            documentUploads.value = []
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
    loading.hide()
}

// FILE TOO LARGE OR NOT IN THE RIGHT FORMAT
async function onDocumentRejected(rejectedEntries: { failedPropValidation: string, file: File }[]) {
    rejectedEntries.forEach(entry => {
        if (entry.failedPropValidation === 'accept') {
            notify({
                type: 'negative',
                message: t('notifications.negative.error-mimetype')
            })
        }
        if (entry.failedPropValidation === 'max-file-size' || entry.failedPropValidation === 'max-total-size') {
            notify({
                type: 'negative',
                message: t('notifications.negative.error-413')
            })
        }
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
                message: catchHTTPError(error.response)
            })
        }
    }
    loading.hide()
}

// CREATE LINK TO VIEW FILE
async function onGetFile(uploadedDocument: UploadedProcessDocument) {
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
                message: catchHTTPError(error.response)
            })
        }
    }
}

// FORM VALIDATION RULES
// Must select document
const documentIsSelected = (document: ProcessDocument, val: File | File[]): boolean => {
    // Only one document is required in these processes
    const onlyOneDocumentRequiredProcesses = ['registration', 'account-management', 'user-management']
    // Document is required in process if document itself is required or if process is registration, account-management, user-management
    const documentIsRequired: boolean = document.isRequiredInProcess || onlyOneDocumentRequiredProcesses.includes(props.process)
    // No document of this type has already been selected during previous processes
    const documentIsNotSelected: boolean = !documentUploads.value.filter(obj => obj.document === document.document).length
    // If document is required
    // And no previous document of this type has been selected
    // Control field and throw error
    if (documentIsRequired && documentIsNotSelected) {
        // Field must have a val
        const hasValue: boolean = document.isMultiple ? !!(val as File[]).length : !!val
        // If there is a val
        // Field is valid
        if (hasValue) {
            return true
        }
        // There is no val, but we are in the case of a process where only one document is required
        else if (onlyOneDocumentRequiredProcesses.includes(props.process)) {
            // If there is another document in process
            // Field is valid
            return !!(processDocuments.value.filter(x => x.pathFile).length)
        }
        // If there is no val
        else {
            return false
        }
    }
    // Field is valid
    else {
        return true
    }
}

// Title length must be lower than MAX_TITLE_LENGTH
const fileTitleLengthIsValid = (document: ProcessDocument, val: File | File[]): boolean => {
    // If there is a file (or a group of file)
    // We must control each file's name length
    const hasValue: boolean = document.isMultiple ? !!(val as File[]).length : !!val
    if (hasValue) {
        if (document.isMultiple) {
            // Throw error if any file's name length is greater than MAX_TITLE_LENGTH
            return !((val as File[]).find(obj => obj.name.length >= MAX_TITLE_LENGTH))
        } else {
            // Throw error if file's name length is greater than MAX_TITLE_LENGTH
            return (val as File).name.length <= MAX_TITLE_LENGTH
        }
    }
    // If field is empty, we don't need to control it
    else {
        return true
    }
}
</script>

<template>
    <div
        class="flex-section"
        data-test="document-form"
    >
        <div
            v-for="(document, index) in processDocuments"
            :key="index"
        >
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

            <QFile
                v-model="document.pathFile"
                :accept="document.mimeTypes?.join(', ')"
                :aria-required="document.isRequiredInProcess && !documentUploads.filter(obj => obj.document === document.document).length"
                :color="fieldColor"
                :data-test="document.acronym + '-file'"
                :label="(document.description + (document.isRequiredInProcess ? ' *' : ''))"
                :max-file-size="MAX_FILE_SIZE"
                :max-files="document.isMultiple ? (MAX_FILES - documentUploads.filter(obj => obj.document === document.document).length) :
                    (1 - documentUploads.filter(obj => obj.document === document.document).length)"
                :max-total-size="MAX_FILE_SIZE * 10"
                :multiple="document.isMultiple"
                :readonly="document.isMultiple && documentUploads.filter(obj => obj.document === document.document).length >= MAX_FILES ||
                    !document.isMultiple && documentUploads.filter(obj => obj.document === document.document).length === 1"
                :rules="[
                    val => documentIsSelected(document, val) || t('forms.select-document') + ' ' + t('forms.accepted-formats') + acceptedFormats(document.mimeTypes) + '.',
                    val => fileTitleLengthIsValid(document, val) || t('notifications.negative.error-title-length')
                ]"
                append
                bottom-slots
                clearable
                counter
                filled
                for="pathFile"
                reactive-rules
                use-chips
                @rejected="onDocumentRejected"
            >
                <template v-slot:hint>
                    <p aria-describedby="pathFile">
                        {{
                            props.process === 'registration' ? t('forms.student-certificate-hint') : (t('project.document-hint')
                                + (document.isMultiple ? (' ' + t('project.document-hint-multiple')) : '') + ' ' +
                                t('forms.accepted-formats') + acceptedFormats(document.mimeTypes) + '.')
                        }}
                    </p>
                </template>
                <template v-slot:prepend>
                    <QIcon name="bi-paperclip"/>
                </template>
            </QFile>

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
    </div>
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
