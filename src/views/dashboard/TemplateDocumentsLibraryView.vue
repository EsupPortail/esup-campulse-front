<script lang="ts" setup>
import useDocuments from '@/composables/useDocuments'
import {onMounted, ref} from 'vue'
import {useQuasar} from 'quasar'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import {useI18n} from 'vue-i18n'
import type {DocumentProcessType, MimeType} from '#/documents'

const {getLibraryDocuments, documents, postNewDocument, patchDocument} = useDocuments()
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

interface LibraryDocuments {
    id: number,
    name: string,
    file: string | null,
    processType: DocumentProcessType,
    mimeTypes: MimeType[],
    open: boolean
}

const libraryDocuments = ref<LibraryDocuments[]>([])

const initLibraryDocuments = () => {
    libraryDocuments.value = documents.value.map((document) => ({
        id: document.id,
        name: document.name,
        file: document.pathTemplate,
        processType: document.processType,
        mimeTypes: document.processType === 'NO_PROCESS' ? [] : document.mimeTypes,
        open: false
    }))
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
        await onGetLibraryDocuments()
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

async function onUpdateDocument(documentId: number) {
    loading.show()
    try {
        const document = libraryDocuments.value.find(doc => doc.id === documentId)
        if (document) {
            await patchDocument(documentId, document.name, document.file)
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
                            <p>
                                <i class="bi bi-file-earmark"></i>
                            </p>
                            <h4>
                                {{ document.name }}
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
                                v-model="document.name"
                                :label="t('documents.choose-name')"
                                :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                                clearable
                                filled
                            />

                            <QFile
                                v-model="document.file"
                                :accept="document.mimeTypes.join(',')"
                                :label="t('documents.choose-file')"
                                :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                                clearable
                                filled
                            />
                            <div class="flex-btn">
                                <QBtn
                                    :label="t('update')"
                                    icon="mdi-autorenew"
                                    type="submit"
                                />
                                <QBtn
                                    :disable="document.processType !== 'NO_PROCESS'"
                                    :label="t('delete')"
                                    icon="mdi-delete-outline"
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
.document-input-header > p > i
    margin-right: 1rem

.flex-btn
    display: flex
    gap: 1rem
</style>
