<script lang="ts" setup>
import {ref} from 'vue'
import {toRefs, watch} from 'vue'
import type {AssociationCharterStatus, ManageCharter} from '#/charters'
import {useI18n} from 'vue-i18n'
import useCharters from '@/composables/useCharters'
import {useQuasar} from 'quasar'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import useDocumentUploads from '@/composables/useDocumentUploads'
import useDocuments from '@/composables/useDocuments'

const {t} = useI18n()
const {loading, notify} = useQuasar()
const {uploadCharter, initCharters} = useCharters()
const {catchHTTPError} = useErrors()
const {MAX_FILE_SIZE} = useDocumentUploads()
const {acceptedFormats} = useDocuments()

const props = defineProps<{
    openSign: boolean,
    charter: ManageCharter,
    associationId: number,
    associationCharterStatus?: AssociationCharterStatus,
    isSite: boolean
}>()

const emit = defineEmits(['closeDialog'])

const open = ref<boolean>(false)
const openRef = toRefs(props).openSign
watch(() => openRef.value, () => {
    open.value = openRef.value
})
watch(() => open.value, () => {
    if (!open.value) {
        emit('closeDialog')
    }
})

const signedCharter = ref<File>()

async function onSignCharter() {
    loading.show()
    try {
        if (signedCharter.value) {
            await uploadCharter(props.charter.documentUploadId, props.associationId, props.charter.documentId, signedCharter.value)
            open.value = false
            await initCharters(props.associationId, props.isSite, props.associationCharterStatus)
            notify({
                type: 'positive',
                message: t('notifications.positive.charter-signed')
            })
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
        if (entry.failedPropValidation === 'max-file-size') {
            notify({
                type: 'negative',
                message: t('notifications.negative.error-413')
            })
        }
    })
}
</script>

<template>
    <QDialog v-model="open">
        <QCard>
            <QCardSection>
                <h3>{{ props.charter.documentName }}</h3>
                <p>{{ t('charter.sign-hint') }}</p>
                <QForm @submit="onSignCharter">
                    <QFile
                        v-model="signedCharter"
                        :accept="props.charter.mimeTypes?.join(', ')"
                        :label="t('charter.signed-charter') + ' *'"
                        :max-file-size="MAX_FILE_SIZE"
                        aria-required="true"
                        bottom-slots
                        clearable
                        color="charter"
                        counter
                        filled
                        for="pathFile"
                        use-chips
                        @rejected="onDocumentRejected"
                    >
                        <template v-slot:hint>
                            <p aria-describedby="pathFile">
                                {{
                                    t('forms.accepted-formats') + acceptedFormats(props.charter.mimeTypes) + '.'
                                }}
                            </p>
                        </template>
                        <template v-slot:prepend>
                            <QIcon name="bi-paperclip"/>
                        </template>
                    </QFile>
                    <div class="flex-row padding-top">
                        <QBtn
                            :label="t('cancel')"
                            class="btn-lg"
                            color="charter"
                            icon="bi-chevron-left"
                            text-color="charter"
                            @click="open = false"
                        />
                        <QBtn
                            :label="t('charter.sign')"
                            class="btn-lg"
                            color="charter"
                            icon="bi-check-lg"
                            text-color="charter"
                            type="submit"
                        />
                    </div>
                </QForm>
            </QCardSection>
        </QCard>
    </QDialog>
</template>
