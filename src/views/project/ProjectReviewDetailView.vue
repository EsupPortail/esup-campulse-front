<script lang="ts" setup>
import ProjectComments from '@/components/project/ProjectComments.vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import router from '@/router'
import {onMounted, ref} from 'vue'
import {useProjectStore} from '@/stores/useProjectStore'
import {useRoute} from 'vue-router'
import ProjectRecapDocuments from '@/components/documents/RecapDocumentList.vue'
import ProjectStatusIndicator from '@/components/project/ProjectStatusIndicator.vue'
import useSecurity from '@/composables/useSecurity'
import useSubmitReview from '@/composables/useSubmitReview'
import ProjectReviewRecapBasicInfos from '@/components/project/ProjectReviewRecapBasicInfos.vue'
import ProjectReviewRecapReview from '@/components/project/ProjectReviewRecapReview.vue'
import ProjectReviewValidation from '@/components/project/ProjectReviewValidation.vue'

const {notify, loading} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()
const {hasPerm} = useSecurity()
const projectStore = useProjectStore()
const {initProjectReview} = useSubmitReview()
const route = useRoute()

const isLoaded = ref<boolean>(false)

onMounted(async () => {
    loading.show()
    await onGetProjectReviewDetail()
    loading.hide()
})

async function onGetProjectReviewDetail() {
    try {
        const projectId = parseInt(route.params.projectId as string)
        await projectStore.getProjectDetail(projectId)
        await projectStore.getProjectReview(projectId)
        initProjectReview()
        isLoaded.value = true
    } catch (error) {
        await router.push({name: '404'})
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}
</script>

<template>
    <!-- General Section -->
    <div class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-info-circle"
            ></i>
            {{ t('project.general-infos') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <ProjectReviewRecapBasicInfos v-if="isLoaded" />
            </div>
        </div>
    </div>

    <!-- Review section -->
    <div class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-pencil-square"
            ></i>
            {{ t('project.review') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <ProjectReviewRecapReview v-if="isLoaded" />
            </div>
        </div>
    </div>

    <!-- Documents Section -->
    <div class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-file-earmark"
            ></i>
            {{ t('project.documents') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <ProjectRecapDocuments
                    v-if="isLoaded"
                    :association-id="null"
                    process="review"
                />
            </div>
        </div>
    </div>

    <!-- Status Section -->
    <div class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-check-lg"
            ></i>
            {{ t('project.status.title') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <div class="display-row">
                    <p class="row-title">{{ t('status') }}</p>
                    <ProjectStatusIndicator
                        v-if="isLoaded"
                        :project-status="projectStore.project?.projectStatus"
                        :show-draft="true"
                    />
                </div>
            </div>
        </div>
    </div>

    <!-- Comment Section -->
    <div class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-chat"
            ></i>
            {{ t('project.comments.title') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <ProjectComments
                    v-if="isLoaded"
                    :project="projectStore.project?.id"
                />
            </div>
        </div>
        <ProjectReviewValidation
            v-if="route.name === 'ManageProjectReview' && projectStore.project?.projectStatus === 'PROJECT_REVIEW_PROCESSING'
                && hasPerm('change_project_as_validator')"
        />
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
</style>
