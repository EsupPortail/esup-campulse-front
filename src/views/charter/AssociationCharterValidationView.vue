<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {onMounted, ref} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {useRoute} from 'vue-router'
import CharterRecapAssociationInfos from '@/components/charter/CharterRecapAssociationInfos.vue'
import FormDocumentUploads from '@/components/form/FormDocumentUploads.vue'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const associationStore = useAssociationStore()
const route = useRoute()

const associationId = ref<number>()

const comment = ref('')

async function onGetAssociationDetail() {
    if (associationId.value) {
        try {
            await associationStore.getAssociationDetail(associationId.value, false)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
                })
            }
        }
    }
}

onMounted(async () => {
    loading.show()
    associationId.value = parseInt(route.params.associationId as string)
    await onGetAssociationDetail()
    loading.hide()
})

</script>

<template>
    <section class="dashboard-section">
        <h2>
            <QIcon name="bi-info-circle"/>
            {{ t('charter.site.sign-form.association-infos-update') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <CharterRecapAssociationInfos :association="associationId"/>
            </div>
        </div>
    </section>
    <section class="dashboard-section">
        <h2>
            <QIcon name="bi-file-earmark"/>
            {{ t('charter.site.sign-form.documents-upload') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <FormDocumentUploads
                    :association-id="associationId"
                    process="charter"
                />
            </div>
        </div>
    </section>
    <section class="dashboard-section">
        <h2>
            <QIcon name="bi-chat"/>
            {{ t('charter.add-new-comment') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <QInput
                    v-model="comment"
                    :label="t('forms.comment')"
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
            </div>
        </div>
    </section>
    <div class="flex-column padding-top padding-bottom">
        <div class="container">
            <div class="flex-row-center padding-top padding-bottom">
                <QBtn
                    :label="t('back')"
                    :to="{name: 'AssociationChartersDetail', params: {associationId: associationId}}"
                    class="btn-lg"
                    color="charter"
                    icon="bi-box-arrow-left"
                    text-color="charter"
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
                    :label="t('charter.actions.return')"
                    class="btn-lg"
                    color="custom-red"
                    icon="bi-exclamation-triangle"
                    @click="onValidateCharter('return')"
                />
                <QBtn
                    :label="t('charter.actions.reject')"
                    class="btn-lg"
                    color="custom-red"
                    icon="bi-x-octagon"
                    @click="onValidateCharter('reject')"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/documents.scss';
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';
</style>