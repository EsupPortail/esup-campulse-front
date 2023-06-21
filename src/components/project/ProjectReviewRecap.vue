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
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
    loading.hide()
}
</script>

<template>
    <QForm
        @submit.prevent="onSubmitProjectReview"
    >
        <h3 class="title-2">{{ t('recap') }}</h3>

        <section class="recap-sections">
            <!-- BASIC INFOS -->
            <section class="recap-section">
                <div class="recap-section-title">
                    <h4 class="title-3">{{ t('project.general-infos') }}</h4>
                    <QBtn
                        v-if="props.view === 'submitProjectReview'"
                        :label="t('modify')"
                        icon="bi-pencil"
                        @click="emit('changeStep', 1)"
                    />
                </div>
                <ProjectReviewRecapBasicInfos/>
            </section>

            <!-- REVIEW INFOS -->
            <section class="recap-section">
                <div class="recap-section-title">
                    <h4 class="title-3">{{ t('project.review') }}</h4>
                    <QBtn
                        v-if="props.view === 'submitProjectReview'"
                        :label="t('modify')"
                        icon="bi-pencil"
                        @click="emit('changeStep', 2)"
                    />
                </div>
                <ProjectReviewRecapReview/>
            </section>
        </section>

        <!-- DOCUMENTS -->
        <section class="recap-section">
            <div class="recap-section-title">
                <h4 class="title-3">{{ t('project.documents') }}</h4>
                <QBtn
                    v-if="props.view === 'submitProjectReview'"
                    :label="t('modify')"
                    icon="bi-pencil"
                    @click="emit('changeStep', 3)"
                />
            </div>

            <InfoVerifyDocuments v-if="props.view === 'submitProjectReview'"/>
            <ProjectRecapDocuments/>
        </section>
        <div
            v-if="props.view === 'submitProjectReview'"
            class="btn-group"
        >
            <QBtn
                :label="t('back')"
                icon="bi-chevron-left"
                @click="emit('changeStep', 3)"
            />
            <QBtn
                :label="t('project.submit-review')"
                icon-right="bi-check-lg"
                type="submit"
            />
        </div>
    </QForm>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
</style>