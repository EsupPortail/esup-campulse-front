<script lang="ts" setup>
import axios from 'axios'
import type {LibraryDocument} from '#/documents'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import {ref, toRefs, watch} from 'vue'
import useDocuments from '@/composables/useDocuments'

const {loading, notify} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()
const {patchDocument, deleteDocument, acceptedFormats} = useDocuments()

const props = defineProps<{
    libraryDocuments: LibraryDocument[]
}>()

const emit = defineEmits(['getLibraryDocuments'])

const libraryDocumentsRef = toRefs(props).libraryDocuments

const documents = ref<LibraryDocument[]>(libraryDocumentsRef.value)

watch(() => libraryDocumentsRef.value, () => {
    documents.value = libraryDocumentsRef.value
})

async function onUpdateDocument(documentId: number) {
    loading.show()
    try {
        const document = props.libraryDocuments.find(doc => doc.id === documentId)
        if (document) {
            await patchDocument(documentId, document.newName, document.file as Blob)
        }
        emit('getLibraryDocuments')
        notify({
            type: 'positive',
            message: t('notifications.positive.document-updated')
        })
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

async function onDeleteDocument(documentId: number) {
    loading.show()
    try {
        await deleteDocument(documentId)
        const libraryId = props.libraryDocuments.findIndex(doc => doc.id === documentId)
        documents.value.splice(libraryId, 1)
        notify({
            type: 'positive',
            message: t('notifications.positive.document-deleted')
        })
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
</script>

<template>
    <div v-if="documents.length">
        <div
            v-for="(document, index) in documents"
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
                <QForm @submit.prevent="onUpdateDocument(document.id)">
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
                        bottom-slots
                        clearable
                        color="dashboard"
                        filled
                        for="pathFile"
                    >
                        <template v-slot:hint>
                            <p aria-describedby="pathFile">
                                {{
                                    t('forms.accepted-formats') + acceptedFormats(document.mimeTypes) + '.'
                                }}
                            </p>
                        </template>
                        <template v-slot:prepend>
                            <QIcon name="bi-paperclip"/>
                        </template>
                    </QFile>
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
    <div v-else>
        <p>{{ t('documents.no-document-to-show') }}</p>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/documents.scss';
</style>
