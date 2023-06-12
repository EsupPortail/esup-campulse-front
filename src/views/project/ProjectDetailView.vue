<script lang="ts" setup>
import ProjectComments from '@/components/project/ProjectComments.vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import useProjectDocuments from '@/composables/useProjectDocuments'
import router from '@/router'
import {onMounted} from 'vue'
import {useProjectStore} from '@/stores/useProjectStore'
import useSubmitProject from '@/composables/useSubmitProject'
import {useRoute} from 'vue-router'
import ProjectRecapBasicInfos from '@/components/project/ProjectRecapBasicInfos.vue'
import ProjectRecapCommissions from '@/components/project/ProjectRecapCommissions.vue'
import ProjectRecapBudget from '@/components/project/ProjectRecapBudget.vue'
import ProjectRecapGoals from '@/components/project/ProjectRecapGoals.vue'
import ProjectRecapDocuments from '@/components/project/ProjectRecapDocuments.vue'
import ProjectValidation from '@/components/project/ProjectValidation.vue'
import ProjectStatusIndicator from '@/components/table/ProjectStatusIndicator.vue'

const {notify, loading} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()
const {getDocuments, initProcessProjectDocuments} = useProjectDocuments()
const projectStore = useProjectStore()
const {
    initProjectBasicInfos,
    initProjectGoals,
    initProjectBudget
} = useSubmitProject()
const route = useRoute()

onMounted(async () => {
    loading.show()
    await onGetProjectDetail()
    await onGetProjectDocuments()
    loading.hide()
})

async function onGetProjectDetail() {
    try {
        await projectStore.getProjectDetail(parseInt(route.params.projectId as string))
        initProjectBasicInfos()
        initProjectBudget()
        initProjectGoals()
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

async function onGetProjectDocuments() {
    try {
        await getDocuments('DOCUMENT_PROJECT')
        initProcessProjectDocuments()
    } catch (error) {
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
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-info-circle"
            ></i>
            {{ t('project.general-infos') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <ProjectRecapBasicInfos/>
            </div>
        </div>
    </section>
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-calendar"
            ></i>
            {{ t('project.commission-choice') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <ProjectRecapCommissions/>
            </div>
        </div>
    </section>
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-piggy-bank"
            ></i>
            {{ t('project.budget') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <ProjectRecapBudget :load-data="false"/>
            </div>
        </div>
    </section>
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-flag"
            ></i>
            {{ t('project.goals') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <ProjectRecapGoals/>
            </div>
        </div>
    </section>
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-file-earmark"
            ></i>
            {{ t('project.documents') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <ProjectRecapDocuments/>
            </div>
        </div>
    </section>
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-check-lg"
            ></i>
            {{ t('project.status.title') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <div class="display-row">
                    <p class="row-title">{{ t('status') }}</p>
                    <ProjectStatusIndicator
                        :project-status="projectStore.project?.projectStatus"
                        :show-draft="false"
                    />
                </div>
            </div>
        </div>
    </section>
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-chat"
            ></i>
            {{ t('project.comments.title') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <ProjectComments
                    v-if="projectStore.project"
                    :project="projectStore.project?.id"
                />
            </div>
        </div>
    </section>
    <ProjectValidation/>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

.form {
    width: 80% !important;
}

.display-row {
    width: 100% !important;
}
</style>
