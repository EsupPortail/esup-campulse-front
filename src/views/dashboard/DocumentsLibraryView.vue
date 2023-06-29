<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import useDocuments from '@/composables/useDocuments'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {onMounted, ref} from 'vue'
import type {DocumentProcessType} from '#/documents'
import ListDocumentsLibrary from '@/components/documents/ListDocumentsLibrary.vue'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {getLibraryDocuments, documents} = useDocuments()

onMounted(async () => {
    loading.show()
    await onGetLibraryDocuments()
    isLoaded.value = true
    loading.hide()
})

const isLoaded = ref(false)

interface LibraryDocument {
    id: number,
    name: string,
    path: string | null,
    process: DocumentProcessType
}

const libraryDocuments = ref<LibraryDocument[]>([])

const initLibraryDocuments = () => {
    const list: LibraryDocument[] = []
    documents.value.forEach((document) => {
        if (document.pathTemplate) {
            list.push({
                id: document.id,
                name: document.name,
                path: document.pathTemplate,
                process: document.processType as DocumentProcessType
            })
        }
    })
    list.sort(function (a, b) {
        const labelA = (a as LibraryDocument).name.toLowerCase().normalize('NFD'),
            labelB = (b as LibraryDocument).name.toLowerCase().normalize('NFD')
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
</script>

<template>
    <!-- Text -->
    <div class="dashboard-section">
        <h2>
            <i class="bi bi-file-earmark"></i>
            Documents
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <div v-if="!libraryDocuments.length">
                    <p class="paragraph">
                        {{ isLoaded ? t('dashboard.no-document-in-template-library') : '' }}
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Docs library -->
    <div v-if="libraryDocuments.length">
        <div class="dashboard-section">
            <h2>
                <i
                    aria-hidden="true"
                    class="bi bi-file-earmark"
                ></i>
                {{ t('documents.charters') }}
            </h2>
            <div class="dashboard-section-container">
                <div class="container">
                    <ListDocumentsLibrary :documents="libraryDocuments.filter(doc => doc.process !== 'NO_PROCESS')"/>
                </div>
            </div>
        </div>

        <div class="dashboard-section">
            <h2>
                <i
                    aria-hidden="true"
                    class="bi bi-file-earmark"
                ></i>
                {{ t('documents.other-documents') }}
            </h2>
            <div class="dashboard-section-container">
                <div class="container">
                    <ListDocumentsLibrary :documents="libraryDocuments.filter(doc => doc.process === 'NO_PROCESS')"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
@import '@/assets/_variables.scss';
</style>
