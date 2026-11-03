<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {QForm, useQuasar} from 'quasar'
import axios from 'axios'
import useErrors from '@/composables/useError'
import {useI18n} from 'vue-i18n'
import type {LibraryDocument, NewDocument} from '#/document'
import {useProfileStore} from '@/stores/useProfileStore'
import FormManageLibraryDocument from '@/components/documents/FormManageLibraryDocument.vue'
import {usePermission} from '@/composables/usePermission'
import {useFundStore} from '@/stores/useFundStore'
import {useDocumentStore} from '@/stores/useDocumentStore'
import * as documentService from '@/services/DocumentService'

const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()
const {t} = useI18n()
const profileStore = useProfileStore()
const fundStore = useFundStore()
const documentStore = useDocumentStore()
const {hasPerm} = usePermission()

const newDocument = ref<NewDocument>({
  name: '',
  acronym: '',
  file: undefined
})

const newDocumentForm = ref(QForm)

const libraryDocuments = ref<LibraryDocument[]>([])

const initLibraryDocuments = () => {
  const list: LibraryDocument[] = []
  documentStore.documents.forEach(document => {
    let canUpdateDocument = false
    if (!document.pathTemplate) return
    if (document.processType === 'NO_PROCESS') {
      canUpdateDocument = true
    } else if (document.fund) {
      if (hasPerm('change_document_any_fund') || profileStore.userFunds.includes(document.fund)) {
        canUpdateDocument = true
      }
    } else if (document.processType === 'CHARTER_ASSOCIATION' || document.processType === 'DOCUMENT_PROJECT') {
      if (hasPerm('change_document_any_fund')) {
        canUpdateDocument = true
      }
    }
    list.push({
      id: document.id,
      name: document.name,
      acronym: document.acronym,
      path: document.pathTemplate,
      size: document.size,
      newName: document.name ?? '',
      file: undefined,
      processType: document.processType,
      mimeTypes: document.processType === 'NO_PROCESS' ? [] : document.mimeTypes,
      open: false,
      canUpdateDocument
    })
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
    await documentStore.getLibraryDocuments()
    initLibraryDocuments()
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
}

async function onGetFunds() {
  try {
    await fundStore.getFunds()
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
}

onMounted(async () => {
  loading.show()
  await onGetFunds()
  await onGetLibraryDocuments()
  loading.hide()
})

async function onUploadNewDocument() {
  loading.show()
  try {
    await documentService.createDocument(newDocument.value)
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
        message: await catchHTTPError(error.response)
      })
    }
  }
  loading.hide()
}

const onClearValues = () => {
  newDocument.value.name = ''
  newDocument.value.acronym = ''
  newDocument.value.file = undefined
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

          <QInput
            v-model="newDocument.acronym"
            :label="t('documents.choose-acronym')"
            :rules="[val => val && val.length > 0 || t('forms.required-document-acronym')]"
            clearable
            color="dashboard"
            filled
          />

          <QFile
            v-model="newDocument.file"
            :label="t('documents.choose-file')"
            :rules="[val => val || t('forms.required-document-file')]"
            bottom-slots
            clearable
            color="dashboard"
            filled
          >
            <template v-slot:prepend>
              <QIcon name="bi-paperclip"/>
            </template>
          </QFile>
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
  <section class="dashboard-section">
    <h2>
      <i
        aria-hidden="true"
        class="bi bi-folder2-open"
      ></i>
      {{ t('documents.no-process-library') }}
    </h2>
    <div class="dashboard-section-container">
      <div class="container">
        <h3 class="padding-bottom">{{ t('charter.charter', 2) }}</h3>
        <FormManageLibraryDocument
          :library-documents="libraryDocuments
            .filter(doc => doc.processType === 'CHARTER_ASSOCIATION' || doc.processType === 'CHARTER_PROJECT_FUND')"
          @get-library-documents="onGetLibraryDocuments"
        />
        <h3 class="padding-top padding-bottom">{{ t('documents.template-documents') }}</h3>
        <FormManageLibraryDocument
          :library-documents="libraryDocuments
            .filter(doc => doc.processType === 'DOCUMENT_PROJECT' || doc.processType === 'DOCUMENT_PROJECT_REVIEW')"
          @get-library-documents="onGetLibraryDocuments"
        />
        <h3 class="padding-top padding-bottom">{{ t('documents.other-documents') }}</h3>
        <FormManageLibraryDocument
          :library-documents="libraryDocuments
            .filter(doc => doc.processType === 'NO_PROCESS')"
          @get-library-documents="onGetLibraryDocuments"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms';
@import '@/assets/styles/dashboard';
@import '@/assets/styles/documents';
</style>
