<script lang="ts" setup>
import {onMounted, ref, toRefs, watch} from 'vue'
import type {ManageCharter} from '#/charters'
import {useI18n} from 'vue-i18n'
import useCharters from '@/composables/useCharters'
import {useQuasar} from 'quasar'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import useDocumentUploads from '@/composables/useDocumentUploads'
import {useAssociationStore} from '@/stores/useAssociationStore'

const {t} = useI18n()
const {loading, notify} = useQuasar()
const {initCharters, patchCharterDocument} = useCharters()
const {catchHTTPError} = useErrors()
const {getFile} = useDocumentUploads()
const associationStore = useAssociationStore()

const props = defineProps<{
    openValidate: boolean,
    charter: ManageCharter,
    associationId: number
}>()

const emit = defineEmits(['closeDialog'])

const open = ref<boolean>(false)
const openRef = toRefs(props).openValidate
watch(() => openRef.value, () => {
    open.value = openRef.value
})
watch(() => open.value, () => {
    if (!open.value) {
        emit('closeDialog')
        commentIsMandatory.value = false
    }
})

const associationName = ref('')

const initCharterDocument = () => {
    associationName.value = associationStore.association?.name ?? ''
}

onMounted(initCharterDocument)

async function onDownloadCharter() {
    const charter = props.charter
    const file = await getFile(charter.pathFile as string)
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(file)
    link.download = charter.documentName as string
    document.body.appendChild(link)
    link.click()
    link.remove()
}

const comment = ref('')
const commentIsMandatory = ref<boolean>(false)


async function onValidateCharter(action: 'validate' | 'reject') {
    if (action !== 'validate') commentIsMandatory.value = true
    if (commentIsMandatory.value && !comment.value) return
    else {
        loading.show()
        try {
            if (props.charter.documentUploadId && associationStore.association) {
                await patchCharterDocument(action, props.charter.documentUploadId, comment.value)
                await initCharters(props.associationId, associationStore.association.isSite, associationStore.association?.charterStatus)
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
        open.value = false
        commentIsMandatory.value = false
    }
}
</script>

<template>
    <QDialog v-model="open">
        <QCard class="variant-space-2">
            <QCardSection class="flex-column">
                <h3>{{ associationName }}</h3>
                <QForm>
                    <div class="flex-column">
                        <div class="document-input-group">
                            <div class="document-input">
                                <div class="document-input-header">
                                    <h4 class="library-document">
                                        <span>
                                            {{ props.charter.documentName }}
                                        </span>
                                    </h4>
                                    <button
                                        :aria-label="t('download') + ' ' + props.charter.documentName"
                                        @click.prevent="onDownloadCharter"
                                    >
                                        <i
                                            aria-hidden="true"
                                            class="bi bi-arrow-bar-down"
                                        ></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <QInput
                        v-model="comment"
                        :label="`${t('forms.comment')} ${commentIsMandatory ? '*' : ''}`"
                        :rules="commentIsMandatory ? [val => val && val.length > 0 || t('forms.charter-validation-comment')] : []"
                        bottom-slots
                        color="charter"
                        filled
                        reactive-rules
                        type="textarea"
                    >
                        <template v-slot:hint>
                            <p :aria-describedby="t('forms.charter-validation-comment')">
                                {{ t('forms.charter-validation-comment') }}
                            </p>
                        </template>
                    </QInput>
                    <div class="flex-row-center padding-top padding-bottom">
                        <QBtn
                            :label="t('back')"
                            class="btn-lg"
                            color="charter"
                            icon="bi-box-arrow-left"
                            text-color="charter"
                            @click="emit('closeDialog')"
                        />
                        <QBtn
                            :label="t('charter.actions.validate')"
                            class="btn-lg"
                            color="charter"
                            icon="bi-check-lg"
                            text-color="charter"
                            @click="onValidateCharter('validate')"
                        />
                        <QBtn
                            :label="t('charter.actions.reject')"
                            class="btn-lg"
                            color="custom-red"
                            icon="bi-x-octagon"
                            @click="onValidateCharter('reject')"
                        />
                    </div>
                </QForm>
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/documents.scss';
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';

.q-card {
    max-width: 91rem;
    width: 100%;
}
</style>
