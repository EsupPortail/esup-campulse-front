<script lang="ts" setup>
import useDocumentUploads from '@/composables/useDocumentUpload'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import axios from 'axios'
import useErrors from '@/composables/useError'
import type {DocumentProcessType, ProcessDocument, UploadedProcessDocument} from '#/document'
import {useProjectStore} from '@/stores/useProjectStore'
import {computed, onMounted} from 'vue'
import useCharters from '@/composables/useCharter'
import {useUserStore} from '@/stores/useUserStore'
import useProject from '@/composables/useProject'
import useDocuments from '@/composables/useDocument'
import {useDocumentStore} from '@/stores/useDocumentStore'
import {useProfileStore} from '@/stores/useProfileStore'
import type {ProcessType} from '#/global'

const {
  processDocuments,
  documentUploads,
  deleteDocumentUpload,
  createFileLink,
  initProjectDocumentUploads,
  initProcessDocuments,
  initCharterDocumentUploads,
  initUserDocumentUploads,
  initProfileDocumentUploads,
  maxFileSize,
  maxTitleLength
} = useDocumentUploads()
const documentStore = useDocumentStore()
const {acceptedFormats} = useDocuments()
const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {getCharterProcessDocumentUploads} = useCharters()
const projectStore = useProjectStore()
const userStore = useUserStore()
const profileStore = useProfileStore()
const {projectFunds} = useProject()

const props = defineProps<{
  process: ProcessType,
  associationId: number | null
}>()


const fieldColor = computed<string>(() => {
  let color: string = 'dashboard'
  if (props.process === 'project' || props.process === 'review') color = 'commission'
  else if (props.process === 'charter') color = 'charter'
  return color
})

onMounted(async () => {
  await onSetDocuments()
})

async function onSetDocuments() {
  loading.show()
  try {
    const studentProcesses = ['registration', 'account-management', 'user-management']
    if (studentProcesses.includes(props.process)) await documentStore.getStudentCertificate()
    else {
      let processTypes: DocumentProcessType[] = []
      if (props.process === 'project') processTypes = ['DOCUMENT_PROJECT']
      else if (props.process === 'review') processTypes = ['DOCUMENT_PROJECT_REVIEW']
      else if (props.process === 'charter') processTypes = ['CHARTER_ASSOCIATION', 'DOCUMENT_ASSOCIATION']
      await documentStore.getDocuments({processTypes})
    }

    //if (props.process === 'project') initProjectFunds()

    initProcessDocuments(props.process === 'project', projectFunds.value ?? [])

    if (props.process === 'project' || props.process === 'review') {
      await projectStore.getProjectDocumentUploads()
      initProjectDocumentUploads()
    } else if (props.process === 'charter') {
      await getCharterProcessDocumentUploads(props.associationId)
      initCharterDocumentUploads()
    } else if (props.process === 'user-management') {
      await userStore.getUserDocumentUploads()
      initUserDocumentUploads()
    } else if (props.process === 'account-management') {
      await profileStore.getUserDocumentUploads()
      initProfileDocumentUploads()
    } else if (props.process === 'registration') {
      documentUploads.value = []
    }
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

async function onDeleteDocumentUpload(documentId: number) {
  loading.show()
  try {
    await deleteDocumentUpload(documentId)
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

async function onGetFile(uploadedDocument: UploadedProcessDocument) {
  try {
    await createFileLink(uploadedDocument.pathFile, uploadedDocument.name)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
}

const documentIsSelected = (document: ProcessDocument, val: File | File[]): boolean => {
  const userProcesses = new Set<string>(['registration', 'account-management', 'user-management'])
  const documentIsRequired: boolean = document.isRequiredInProcess || userProcesses.has(props.process)
  let documentIsSelected: boolean
  if (userProcesses.has(props.process)) {
    const userDocuments = new Set<number>(
      processDocuments.value
        .filter(obj => obj.processType === 'DOCUMENT_USER')
        .map(obj => obj.document)
    )
    documentIsSelected = documentUploads.value.some(obj => userDocuments.has(obj.document))
  } else {
    documentIsSelected = documentUploads.value.some(obj => obj.document === document.document)
  }
  if (!documentIsRequired && documentIsSelected) return true
  const hasValue: boolean = document.maxUploads > 1 ? !!(val as File[]).length : !!val
  if (hasValue) {
    return true
  } else if (userProcesses.has(props.process)) {
    return !!(processDocuments.value.filter(x => x.pathFile).length)
  } else {
    return false
  }
}

const fileTitleLengthIsValid = (document: ProcessDocument, val: File | File[]): boolean => {
  const hasValue: boolean = document.maxUploads > 1 ? !!(val as File[])?.length : !!val
  if (!hasValue) return true
  if (document.maxUploads > 1) {
    return !((val as File[]).some(obj => obj.name.length >= maxTitleLength))
  } else {
    return (val as File).name.length <= maxTitleLength
  }
}
</script>

<template>
  <div
    class="flex-section"
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
        :label="(document.description + (document.isRequiredInProcess ? ' *' : ''))"
        :max-file-size="maxFileSize"
        :max-files="document.maxUploads - documentUploads.filter(obj => obj.document === document.document).length"
        :max-total-size="maxFileSize * 10"
        :multiple="document.maxUploads > 1"
        :readonly="documentUploads.filter(obj => obj.document === document.document).length >= document.maxUploads"
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
              props.process === 'registration' ? t('forms.student-certificate-hint') :
              (t('project.document-hint')
                + (document.maxUploads > 1 ? (' ' + t('project.document-hint-multiple')) : '') + ' ' +
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
@import '@/assets/styles/forms';
@import '@/assets/variables';

ul.document-input-list {
  list-style: none;
}

ul.document-input-list li {
  cursor: pointer;
}
</style>
