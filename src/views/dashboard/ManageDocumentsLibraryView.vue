<script lang="ts" setup>
import useDocuments from '@/composables/useDocuments'
import {onMounted, ref} from 'vue'
import {QForm, useQuasar} from 'quasar'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import {useI18n} from 'vue-i18n'
import type {DocumentProcessType, MimeType} from '#/documents'

const {getLibraryDocuments, documents, postNewDocument, patchDocument, deleteDocument} = useDocuments()
const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()
const {t} = useI18n()

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
    path: string | null,
    newName: string,
    file: undefined | Blob,
    processType: DocumentProcessType,
    mimeTypes: MimeType[],
    open: boolean
}

const libraryDocuments = ref<LibraryDocument[]>([])

const initLibraryDocuments = () => {
    const list = documents.value.map((document) => ({
        id: document.id,
        name: document.name,
        path: document.pathTemplate,
        newName: document.name ?? '',
        file: undefined,
        processType: document.processType,
        mimeTypes: document.processType === 'NO_PROCESS' ? [] : document.mimeTypes,
        open: false
    }))
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
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
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
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
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
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
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
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
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
        <div class="form-container">
            <div class="form">
                <QForm
                    ref="newDocumentForm"
                    @reset="onClearValues"
                    @submit="onUploadNewDocument"
                >
                    <QInput
                        v-model="newDocument.name"
                        :label="t('documents.choose-name')"
                        :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                        clearable
                        filled
                    />

                    <QFile
                        v-model="newDocument.file"
                        :label="t('documents.choose-file')"
                        :rules="[val => val || t('forms.fill-field')]"
                        clearable
                        filled
                    />
                    <QBtn
                        :label="t('add')"
                        icon="mdi-upload-outline"
                        type="submit"
                    />
                </QForm>
            </div>
        </div>
    </section>

    <!-- View documents -->
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-folder2-open"
            ></i>
            {{ t('documents.no-process-library') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <div
                    v-for="(document, index) in libraryDocuments"
                    :key="index"
                    class="document-input-group"
                >
                    <div class="document-input variant-space-1">
                        <div class="document-input-header">
                            <h4 class="library-document">
                                <span :class="document.path ? 'active-link' : ''">
                                    <a
                                        :href="document.path"
                                        target="_blank"
                                    >
                                        {{ document.name }}
                                    </a>
                                    <i
                                        v-if="document.path"
                                        aria-hidden="true"
                                        class="bi bi-eye"
                                    ></i>
                                </span>
                            </h4>

                            <button @click.prevent="document.open = !document.open">
                                <i :class="`bi bi-${document.open ? 'x' : 'pencil'}`"></i>
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
                                :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                                clearable
                                filled
                            />

                            <QFile
                                v-model="document.file"
                                :accept="document.mimeTypes.join(',')"
                                :label="t('documents.choose-file')"
                                :rules="[val => val || t('forms.fill-field')]"
                                clearable
                                filled
                            />
                            <div class="flex-btn">
                                <QBtn
                                    :icon="document.path ? 'mdi-autorenew' : 'mdi-upload-outline'"
                                    :label="document.path ? t('update') : t('add')"
                                    type="submit"
                                />
                                <QBtn
                                    :disable="document.processType !== 'NO_PROCESS'"
                                    :label="t('delete')"
                                    icon="mdi-delete-outline"
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


<style lang="scss">
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
</style>

<style lang="sass" scoped>
@import '@/assets/_variables.scss'

.document-input-header > p > i
    margin-right: 1rem

.flex-btn
    display: flex
    gap: 1rem

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