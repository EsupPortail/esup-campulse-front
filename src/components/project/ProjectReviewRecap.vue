<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import ProjectReviewRecapBasicInfos from '@/components/project/ProjectReviewRecapBasicInfos.vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import ProjectReviewRecapReview from '@/components/project/ProjectReviewRecapReview.vue'
import InfoVerifyDocuments from '@/components/infoPanel/InfoVerifyDocuments.vue'
import ProjectRecapDocuments from '@/components/documents/RecapDocumentList.vue'
import useSubmitReview from '@/composables/useSubmitReview'
import router from '@/router'

const {t} = useI18n()
const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()
const {submitProjectReview} = useSubmitReview()

const props = defineProps<{
    view: 'submitProjectReview' | 'projectReviewDetail'
}>()

const emit = defineEmits(['changeStep'])

async function onSubmitProjectReview() {
    loading.show()
    try {
        await submitProjectReview()
        await router.push({name: 'SubmitProjectReviewSuccessful'})
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
    <QForm
        class="flex-column"
        @submit.prevent="onSubmitProjectReview"
    >
        <div class="recap-sections flex-column">
            <!-- BASIC INFOS -->
            <div class="recap-section flex-column">
                <div class="recap-section-title flex-row-space-between">
                    <h3>{{ t('project.general-infos') }}</h3>
                    <QBtn
                        v-if="props.view === 'submitProjectReview'"
                        :label="t('modify')"
                        class="btn-lg"
                        color="commission"
                        icon="bi-pencil"
                        @click="emit('changeStep', 1)"
                    />
                </div>
                <ProjectReviewRecapBasicInfos />
            </div>

            <!-- REVIEW INFOS -->
            <div class="recap-section flex-column">
                <div class="recap-section-title flex-row-space-between">
                    <h3>{{ t('project.review') }}</h3>
                    <QBtn
                        v-if="props.view === 'submitProjectReview'"
                        :label="t('modify')"
                        class="btn-lg"
                        color="commission"
                        icon="bi-pencil"
                        @click="emit('changeStep', 2)"
                    />
                </div>
                <ProjectReviewRecapReview />
            </div>
        </div>

        <!-- DOCUMENTS -->
        <div class="recap-section">
            <div class="recap-section-title flex-row-space-between">
                <h3>{{ t('project.documents') }}</h3>
                <QBtn
                    v-if="props.view === 'submitProjectReview'"
                    :label="t('modify')"
                    class="btn-lg"
                    color="commission"
                    icon="bi-pencil"
                    @click="emit('changeStep', 3)"
                />
            </div>

            <InfoVerifyDocuments v-if="props.view === 'submitProjectReview'" />
            <ProjectRecapDocuments
                :association-id="null"
                process="review"
            />
        </div>
        <div
            v-if="props.view === 'submitProjectReview'"
            class="flex-row-center"
        >
            <QBtn
                :label="t('back')"
                class="btn-lg"
                color="commission"
                icon="bi-chevron-left"
                @click="emit('changeStep', 3)"
            />
            <QBtn
                :label="t('project.submit-review')"
                class="btn-lg"
                color="commission"
                icon="bi-check-lg"
                type="submit"
            />
        </div>
    </QForm>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
</style>
