<script lang="ts" setup>
import ProjectComments from '@/components/project/ProjectComments.vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import router from '@/router'
import {onMounted, ref} from 'vue'
import {useProjectStore} from '@/stores/useProjectStore'
import useSubmitProject from '@/composables/useSubmitProject'
import {useRoute} from 'vue-router'
import ProjectRecapBasicInfos from '@/components/project/ProjectRecapBasicInfos.vue'
import ProjectRecapCommissions from '@/components/project/ProjectRecapCommissions.vue'
import ProjectRecapBudget from '@/components/project/ProjectRecapBudget.vue'
import ProjectRecapGoals from '@/components/project/ProjectRecapGoals.vue'
import ProjectRecapDocuments from '@/components/documents/RecapDocumentList.vue'
import ProjectValidation from '@/components/project/ProjectValidation.vue'
import ProjectStatusIndicator from '@/components/project/ProjectStatusIndicator.vue'
import useSecurity from '@/composables/useSecurity'
import ProjectFundValidationIndicator from '@/components/project/ProjectFundValidationIndicator.vue'

const {notify, loading} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()
const {hasPerm} = useSecurity()
const projectStore = useProjectStore()
const {
    initProjectBasicInfos,
    initProjectGoals,
    initProjectBudget
} = useSubmitProject()
const route = useRoute()

const isLoaded = ref<boolean>(false)

onMounted(async () => {
    loading.show()
    await onGetProjectDetail()
    loading.hide()
})

async function onGetProjectDetail() {
    try {
        await projectStore.getProjectDetail(parseInt(route.params.projectId as string))
        await projectStore.getProjectCommissionFunds(false, undefined)
        initProjectBasicInfos()
        initProjectBudget()
        initProjectGoals()
        isLoaded.value = true
    } catch (error) {
        await router.push({name: '404'})
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
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
                <ProjectRecapBasicInfos/>
            </div>
        </div>
    </div>

    <!-- Commission Section -->
    <div class="dashboard-section">
        <h2>
            <i
                    aria-hidden="true"
                    class="bi bi-calendar"
            ></i>
            {{ t('commission.commission', 1) }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <ProjectRecapCommissions view="projectRecap"/>
            </div>
        </div>
    </div>

    <!-- Budget Section -->
    <div class="dashboard-section">
        <h2>
            <i
                    aria-hidden="true"
                    class="bi bi-piggy-bank"
            ></i>
            {{ t('project.budget') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <ProjectRecapBudget :load-data="false"/>
            </div>
        </div>
    </div>

    <!-- Goals Section -->
    <div class="dashboard-section">
        <h2>
            <i
                    aria-hidden="true"
                    class="bi bi-flag"
            ></i>
            {{ t('project.goals') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <ProjectRecapGoals/>
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
                        process="project"
                />
            </div>
        </div>
    </div>

    <!-- Fund validation section -->
    <div class="dashboard-section">
        <h2>
            <i
                    aria-hidden="true"
                    class="bi bi-bank"
            ></i>
            {{ t('commission.funds-validation-status') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <div class="display-row">
                    <ProjectFundValidationIndicator :project-commission-funds="projectStore.projectCommissionFunds"/>
                </div>
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
        <ProjectValidation
                v-if="projectStore.project?.projectStatus === 'PROJECT_PROCESSING'
                && hasPerm('change_project_as_validator')
                && route.name === 'ManageProject'"
        />
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

/*.flex-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.display-row {
  width: $fullSize;
}*/
</style>
