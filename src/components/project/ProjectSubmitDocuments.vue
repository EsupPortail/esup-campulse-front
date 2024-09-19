<script lang="ts" setup>
import FormDocumentUploads from '@/components/form/FormDocumentUploads.vue'
import {useI18n} from 'vue-i18n'
import useDocumentUploads from '@/composables/useDocumentUploads'
import useErrors from '@/composables/useErrors'
import {useQuasar} from 'quasar'
import {useProjectStore} from '@/stores/useProjectStore'
import {useUserStore} from '@/stores/useUserStore'
import axios from 'axios'

const {t} = useI18n()
const {
    uploadDocuments
} = useDocumentUploads()
const {catchHTTPError} = useErrors()
const {loading, notify} = useQuasar()
const projectStore = useProjectStore()
const userStore = useUserStore()

const props = defineProps<{
    applicant: 'association' | 'user' | undefined,
    associationId: number | undefined
}>()

const emit = defineEmits(['updateStep'])

// SUBMIT
async function onUploadDocuments(nextStep: number) {
    loading.show()
    if (projectStore.project) {
        try {
            await uploadDocuments(
                props.applicant === 'association' ? props.associationId : undefined,
                props.applicant === 'user' ? userStore.user?.username : undefined,
                false
            )
            emit('updateStep', nextStep)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: catchHTTPError(error.response)
                })
            }
        }
    }
    loading.hide()
}
</script>

<template>
    <QForm @submit="onUploadDocuments(6)">
        <div class="info-panel info-panel-error">
            <i
                aria-hidden="true"
                class="bi bi-exclamation-lg"
            ></i>
            <p>{{ t('project.sign-charter') }}</p>
        </div>

        <FormDocumentUploads
            :association-id="props.associationId"
            process="project"
        />

        <div class="flex-row-center padding-top padding-bottom">
            <QBtn
                :label="t('back')"
                class="btn-lg"
                color="commission"
                data-test="back-button"
                icon="bi-chevron-left"
                @click="onUploadDocuments(4)"
            />
            <QBtn
                :label="t('continue')"
                class="btn-lg"
                color="commission"
                data-test="continue-button"
                icon="bi-check2"
                type="submit"
            />
        </div>
    </QForm>
</template>