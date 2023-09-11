<script lang="ts" setup>
import useDocuments from '@/composables/useDocuments'
import {onMounted, ref} from 'vue'
import {QForm, useQuasar} from 'quasar'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import {useI18n} from 'vue-i18n'
import type {DocumentProcessType, MimeType} from '#/documents'
import {useUserStore} from '@/stores/useUserStore'
import useSecurity from '@/composables/useSecurity'

const {getLibraryDocuments, documents, postNewDocument, patchDocument, deleteDocument} = useDocuments()
const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()
const {t} = useI18n()
const userStore = useUserStore()
const {hasPerm} = useSecurity()

onMounted(async () => {
    loading.show()
    await onGetLibraryDocuments()
    loading.hide()
})

interface NewDocument {
    name: string,
    file: undefined | Blob
}

const newDocument = ref<NewDocument>({
    name: '',
    file: undefined
})

const newDocumentForm = ref(QForm)

interface LibraryDocument {
    id: number,
    name: string,
    path: string | undefined,
    size: number,
    newName: string,
    file: undefined | Blob,
    processType: DocumentProcessType,
    mimeTypes: MimeType[],
    open: boolean
}

const libraryDocuments = ref<LibraryDocument[]>([])

const initLibraryDocuments = () => {
    const list: LibraryDocument[] = []
    documents.value.forEach(document => {
        if ((userStore.userCommissionFunds?.includes(document.fund) || hasPerm('change_document_any_fund')) || document.processType === 'NO_PROCESS') {
            list.push({
                id: document.id,
                name: document.name,
                path: document.pathTemplate,
                size: document.size,
                newName: document.name ?? '',
                file: undefined,
                processType: document.processType,
                mimeTypes: document.processType === 'NO_PROCESS' ? [] : document.mimeTypes,
                open: false
            })
        }
    })
    list.sort(function (a, b) {
        const labelA = a.name.toLowerCase().normalize('NFD'), labelB = b.name.toLowerCase().normalize('NFD')
        if (labelA < labelB)
            return -1
        if (labelA > labelB)
            return 1
        return 0
    })
    libraryDocuments.value = list
}

async function onGetLibraryDocuments() {
    try {
        await getLibraryDocuments()
        initLibraryDocuments()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response.status)
            })
        }
    }
}

async function onUploadNewDocument() {
    loading.show()
    try {
        await postNewDocument(newDocument.value.name, newDocument.value.file as Blob)
        newDocumentForm.value.reset()
        await onGetLibraryDocuments()
        notify({
            type: 'positive',
            message: t('notifications.positive.new-document-uploaded')
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response.status)
            })
        }
    }
    loading.hide()
}

const onClearValues = () => {
    newDocument.value.name = ''
    newDocument.value.file = undefined
}

async function onUpdateDocument(documentId: number) {
    loading.show()
    try {
        const document = libraryDocuments.value.find(doc => doc.id === documentId)
        if (document) {
            await patchDocument(documentId, document.newName, document.file as Blob)
        }
        await onGetLibraryDocuments()
        notify({
            type: 'positive',
            message: t('notifications.positive.document-updated')
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response.status)
            })
        }
    }
    loading.hide()
}

async function onDeleteDocument(documentId: number) {
    loading.show()
    try {
        await deleteDocument(documentId)
        const libraryId = libraryDocuments.value.findIndex(doc => doc.id === documentId)
        libraryDocuments.value.splice(libraryId, 1)
        notify({
            type: 'positive',
            message: t('notifications.positive.document-deleted')
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response.status)
            })
        }
    }
    loading.hide()
}
</script>

<template>
    <!-- Add new documents -->
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-file-earmark"
            ></i>
            {{ t('documents.upload-new') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <QForm
                    ref="newDocumentForm"
                    @reset="onClearValues"
                    @submit="onUploadNewDocument"
                >
                    <QInput
                        v-model="newDocument.name"
                        :label="t('documents.choose-name')"
                        :rules="[val => val && val.length > 0 || t('forms.required-document-name')]"
                        clearable
                        color="dashboard"
                        filled
                    />

                    <QFile
                        v-model="newDocument.file"
                        :label="t('documents.choose-file')"
                        :rules="[val => val || t('forms.required-document-file')]"
                        clearable
                        color="dashboard"
                        filled
                    />
                    <QBtn
                        :label="t('add')"
                        class="btn-lg"
                        color="dashboard"
                        icon="bi-upload"
                        type="submit"
                    />
                </QForm>
            </div>
        </div>
    </section>

    <!-- View documents -->
    <section
        v-if="libraryDocuments.length"
        class="dashboard-section"
    >
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-folder2-open"
            ></i>
            {{ t('documents.no-process-library') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <div
                    v-for="(document, index) in libraryDocuments"
                    :key="index"
                    class="document-input-group"
                >
                    <div class="document-input">
                        <div class="document-input-header">
                            <h4 class="library-document">
                                <span :class="document.path ? 'active-link' : ''">
                                    <a
                                        :href="document.path"
                                        target="_blank"
                                    >
                                        <strong>{{ document?.name }}</strong>
                                        <em>{{ Math.floor(document?.size / 1000) + ' kb' }}</em>
                                    </a>
                                    <i
                                        v-if="document.path"
                                        aria-hidden="true"
                                        class="bi bi-eye"
                                    ></i>
                                </span>
                            </h4>

                            <button @click.prevent="document.open = !document.open">
                                <i
                                    :class="`bi bi-${document.open ? 'x' : 'pencil'}`"
                                    aria-hidden="true"
                                ></i>
                            </button>
                        </div>
                    </div>

                    <div v-if="document.open">
                        <QForm
                            @submit.prevent="onUpdateDocument(document.id)"
                        >
                            <QInput
                                v-model="document.newName"
                                :label="t('documents.choose-name')"
                                :rules="[val => val && val.length > 0 || t('forms.required-document-name')]"
                                clearable
                                color="dashboard"
                                filled
                            />

                            <QFile
                                v-model="document.file"
                                :accept="document.mimeTypes.join(',')"
                                :label="t('documents.choose-file')"
                                :rules="[val => val || t('forms.required-document-file')]"
                                clearable
                                color="dashboard"
                                filled
                            />
                            <div class="flex-row padding-top padding-bottom">
                                <QBtn
                                    :icon="document.path ? 'bi-arrow-repeat' : 'bi-upload'"
                                    :label="document.path ? t('update') : t('add')"
                                    class="btn-lg"
                                    color="dashboard"
                                    type="submit"
                                />
                                <QBtn
                                    :disable="document.processType !== 'NO_PROCESS'"
                                    :label="t('delete')"
                                    class="btn-lg"
                                    color="custom-red"
                                    icon="bi-trash"
                                    @click="onDeleteDocument(document.id)"
                                />
                            </div>
                        </QForm>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/documents.scss';
</style>
