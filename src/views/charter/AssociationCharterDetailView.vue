<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {onMounted, ref, watch} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {useRoute} from 'vue-router'
import CharterRecapAssociationInfos from '@/components/charter/CharterRecapAssociationInfos.vue'
import useCharters from '@/composables/useCharters'
import RecapDocumentList from '@/components/documents/RecapDocumentList.vue'
import useUtility from '@/composables/useUtility'
import useUserGroups from '@/composables/useUserGroups'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const associationStore = useAssociationStore()
const route = useRoute()
const {charterDocuments} = useCharters()
const {dynamicTitle} = useUtility()
const {isStaff} = useUserGroups()

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
                    message: catchHTTPError(error.response.status)
                })
            }
        }
    }
}

const initComment = () => {
    charterDocuments.value.forEach(document => {
        if (document.comment) {
            comment.value = document.comment
            return
        }
    })
}

watch(() => charterDocuments.value, initComment)

onMounted(async () => {
    loading.show()
    associationId.value = parseInt(route.params.associationId as string)
    await onGetAssociationDetail()
    dynamicTitle.value = `${associationStore.association?.name} - ${t('breadcrumbs.association-charter-detail')}`
    loading.hide()
})

</script>

<template>
    <section
        v-if="comment"
        class="dashboard-section"
    >
        <h2>
            <QIcon name="bi-chat"/>
            {{ t('charter.comment', 1) }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <!-- Comment if charter is rejected -->
                <div
                    v-if="associationStore.association?.charterStatus === 'CHARTER_DRAFT'"
                    class="info-panel info-panel-error"
                >
                    <i
                        aria-hidden="true"
                        class="bi bi-exclamation-lg"
                    ></i>
                    <p>{{ t('charter.returned-info') }}</p>
                    <p>{{ comment }}</p>
                    <p v-if="!isStaff">{{ t('charter.resign-info') }}</p>
                </div>
                <!-- Classic comment -->
                <div
                    v-else
                    class="info-panel"
                >
                    <i
                        aria-hidden="true"
                        class="bi bi-info"
                    ></i>
                    <p>{{ comment }}</p>
                </div>
            </div>
        </div>
    </section>
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
                <RecapDocumentList
                    :association-id="associationId"
                    process="charter"
                />
            </div>
        </div>
    </section>
    <section class="flex-column padding-top padding-bottom">
        <div class="flex-row-center">
            <QBtn
                :label="t('back')"
                :to="isStaff ? {name: 'AssociationCharterList', params: {associationId: associationId}} : {name: 'ManageCharters'}"
                class="btn-lg"
                color="charter"
                icon="bi-box-arrow-left"
                text-color="charter"
            />
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/documents.scss';
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';
</style>
