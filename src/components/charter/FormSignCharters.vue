<script lang="ts" setup>
import {ref} from 'vue'
import {toRefs, watch} from 'vue'
import type {ManageCharter} from '#/charters'
import {useI18n} from 'vue-i18n'
import useCharters from '@/composables/useCharters'
import {useQuasar} from 'quasar'
import axios from 'axios'
import useErrors from '@/composables/useErrors'

const {t} = useI18n()
const {loading, notify} = useQuasar()
const {uploadCharter, initCharters} = useCharters()
const {catchHTTPError} = useErrors()

const props = defineProps<{
    openSign: boolean,
    charter: ManageCharter,
    associationId: number,
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

const signedCharter = ref<Blob>()

async function onSignCharter() {
    loading.show()
    try {
        if (signedCharter.value) {
            await uploadCharter(props.charter.documentUploadId, props.associationId, props.charter.documentId, signedCharter.value)
            open.value = false
            await initCharters(props.associationId, props.isSite)
            notify({
                type: 'positive',
                message: t('notifications.positive.charter-signed')
            })
        }
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
    <QDialog v-model="open">
        <QCard>
            <QCardSection>
                <h3>{{ props.charter.documentName }}</h3>
                <p></p>
                <QForm
                    @submit="onSignCharter"
                >
                    <QFile
                        v-model="signedCharter"
                        :label="t('charter.signed-charter') + ' *'"
                        color="charter"
                        filled
                    >
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
