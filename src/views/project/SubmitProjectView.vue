<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import useSubmitProject from '@/composables/useSubmitProject'
import useUtility from '@/composables/useUtility'
import {useProjectStore} from '@/stores/useProjectStore'
import {useQuasar} from 'quasar'
import {onBeforeRouteLeave, useRoute} from 'vue-router'
import {useUserStore} from '@/stores/useUserStore'
import useDocumentUploads from '@/composables/useDocumentUploads'
import router from '@/router'
import useErrors from '@/composables/useErrors'
import type {UploadedProcessDocument} from '#/documents'
import ProjectRecap from '@/components/project/ProjectRecap.vue'
import ProjectComments from '@/components/project/ProjectComments.vue'
import InfoProcessDocuments from '@/components/infoPanel/InfoProcessDocuments.vue'
import type {AssociationUserDetail} from '#/user'
import ProjectSubmitBasic from '@/components/project/ProjectSubmitBasic.vue'
import ProjectSubmitCommissionChoice from '@/components/project/ProjectSubmitCommissionChoice.vue'
import ProjectSubmitBudget from '@/components/project/ProjectSubmitBudget.vue'
import ProjectSubmitGoals from '@/components/project/ProjectSubmitGoals.vue'
import ProjectSubmitDocuments from '@/components/project/ProjectSubmitDocuments.vue'

const {t} = useI18n()
const {
    projectBasicInfos,
    initProjectCategories,
    submitProject,
    reInitSubmitProjectForm,
    initProjectAssociationUsersLabels
} = useSubmitProject()
const {
    createUploadedFileLink
} = useDocumentUploads()
const {fromDateIsAnterior} = useUtility()
const {catchHTTPError} = useErrors()
const {loading, notify} = useQuasar()
const projectStore = useProjectStore()
const userStore = useUserStore()
const route = useRoute()

onMounted(async () => {
    loading.show()
    // We get project detail
    projectId.value = parseInt(route.params.projectId as string)
    // We set if it is a new project
    newProject.value = !projectId.value
    // We get project detail
    await onGetProjectDetail()
    // If project is not a draft, then push to 404
    if (projectStore.project && projectStore.project.id === projectId.value) {
        const acceptedStatuses = ['PROJECT_DRAFT', 'PROJECT_DRAFT_PROCESSED']
        if (!acceptedStatuses.includes(projectStore.project.projectStatus)) {
            await router.push({name: '404'})
        }
    }
    // We set the association user
    associationUser.value = userStore.userAssociations
        .find(obj => obj.association.id === associationId.value)
    // We get project categories
    await onGetProjectCategories()
    // Get association users
    await onGetAssociationUsers()
    // Empty project commission funds to make sure we don't delete unrelated objects (security for student + commission member account)
    projectStore.projectCommissionFunds = []
    // When everything is done, then the page can be fully loaded
    isLoaded.value = true
    // Check if user can update project
    await canUpdateProject()
    loading.hide()
})

const step = ref(1)

// Scroll to top when we change step
watch(() => step.value, () => {
    if (step.value === 2) {
        setTimeout(() => {
            document.getElementById('stepper')?.scrollIntoView(true)
        }, 1000)
    } else {
        document.getElementById('stepper')?.scrollIntoView(true)
    }
})

// REFS
const applicant = ref<'association' | 'user' | undefined>(route.name === 'SubmitProjectAssociation' ? 'association' : 'user')

const associationId = ref<number>(parseInt(route.params.associationId as string))

const projectId = ref<number>()
watch(() => projectId.value, () => {
    // If the project has not been posted yet, we clean project store
    if (!projectId.value) {
        projectStore.project = undefined
        projectStore.projectCategories = []
        reInitSubmitProjectForm()
    }
    // We set if the project is a re-edition or not
    projectReEdition.value = !!projectStore.projectCommissionFunds.find(obj => obj.isFirstEdition === false)
})

const associationUser = ref<AssociationUserDetail | undefined>()

watch(() => userStore.userAssociations, () => {
    associationUser.value = userStore.userAssociations
        .find(obj => obj.association.id === associationId.value)
})

watch(() => associationUser.value, () => {
    hasPresidentStatus.value = userStore.hasPresidentStatus(associationId.value)
    isSite.value = !!(associationUser.value && associationUser.value?.association.isSite && applicant.value === 'association')
})

const hasPresidentStatus = ref<boolean>(false)

// Needed to track if the project is new or not
const newProject = ref<boolean>(true)
// Needed to track if the project has been posted
const newProjectPosted = ref<boolean>(false)

const projectReEdition = ref<boolean>(false)

const isSite = ref<boolean>(false)

const isLoaded = ref<boolean>(false)

const canUpdateProject = async () => {
    let canUpdateProject = false
    // If the applicant is an association
    if (applicant.value === 'association') {
        if (associationUser.value?.association?.canSubmitProjects) {
            if (hasPresidentStatus.value) {
                canUpdateProject = true
            } else if (projectStore.project?.associationUser === associationUser.value?.id) {
                canUpdateProject = true
            }
        }
    }
    // If the applicant is a user
    else {
        canUpdateProject = true
    }
    if (!canUpdateProject) {
        await router.push({name: '404'})
    }
}

// CHECKING IF PROJECT BASIC INFOS DATES ARE LEGAL
const datesAreLegal = ref<boolean>(true)
watch(() => projectBasicInfos.value.plannedStartDate, () => {
    datesAreLegal.value = fromDateIsAnterior(projectBasicInfos.value.plannedStartDate, projectBasicInfos.value.plannedEndDate, true)
})
watch(() => projectBasicInfos.value.plannedEndDate, () => {
    datesAreLegal.value = fromDateIsAnterior(projectBasicInfos.value.plannedStartDate, projectBasicInfos.value.plannedEndDate, true)
})

async function onGetProjectCategories() {
    try {
        await projectStore.getProjectCategoryNames()
        if ((!newProject.value || newProjectPosted.value) && projectStore.project) {
            await projectStore.getProjectCategories()
            initProjectCategories()
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}

async function onGetFile(uploadedDocument: UploadedProcessDocument) {
    try {
        await createUploadedFileLink(uploadedDocument.pathFile as string, uploadedDocument.name as string)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}

async function onGetAssociationUsers() {
    try {
        if (applicant.value === 'association' && associationId.value) {
            await initProjectAssociationUsersLabels(associationId.value)
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}

// GET DATA FOR STEP 1
async function onGetProjectDetail() {
    if (!newProject.value) {
        try {
            await projectStore.getProjectDetail(projectId.value as number)
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
}

// SUBMIT STEP 6
async function onSubmitProject() {
    loading.show()
    if (projectStore.project) {
        try {
            await submitProject()
            await router.push({name: 'SubmitProjectSuccessful', params: {projectId: projectStore.project?.id}})
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: catchHTTPError(error.response)
                })
            }
        }
    }
    loading.hide()
}

// WHEN THE USER LEAVES THE PAGE, WE CLEAR ALL INPUTS
onBeforeRouteLeave(reInitSubmitProjectForm)

</script>

<template>
    <div class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-pencil-square"
            ></i>
            {{ t('project.submit-new-project') }}
        </h2>

        <div class="dashboard-section-container">
            <div class="container">
                <InfoProcessDocuments
                    v-if="step === 1"
                    :processes="['DOCUMENT_PROJECT']"
                />
                <QStepper
                    id="stepper"
                    ref="stepper"
                    v-model="step"
                    active-color="commission-bold"
                    animated
                    data-test="form-stepper"
                >
                    <!-- BASIC INFOS -->
                    <QStep
                        :name="1"
                        :title="t('project.general-infos')"
                        data-test="project-step"
                        icon="bi-card-text"
                    >
                        <ProjectSubmitBasic
                            :applicant="applicant"
                            :new-project="newProject"
                            :new-project-posted="newProjectPosted"
                            @update-posted-status="newProjectPosted = true"
                            @get-project-categories="onGetProjectCategories"
                            @update-step="(nextStep) => step = nextStep"
                        />
                    </QStep>

                    <!-- COMMISSION CHOICE -->
                    <QStep
                        :name="2"
                        :title="t('project.commission-choice')"
                        data-test="project-step"
                        icon="bi-calendar"
                    >
                        <ProjectSubmitCommissionChoice
                            :is-site="isSite"
                            :new-project="newProject"
                            @update-step="(nextStep) => step = nextStep"
                        />
                    </QStep>

                    <!-- BUDGET -->
                    <QStep
                        :name="3"
                        :title="t('project.budget')"
                        data-test="project-step"
                        icon="bi-piggy-bank"
                    >
                        <ProjectSubmitBudget
                            :project-re-edition="projectReEdition"
                            @update-step="(nextStep) => step = nextStep"
                            @update-re-edition-status="(status) => projectReEdition = status"
                        />
                    </QStep>

                    <!-- GOALS -->
                    <QStep
                        :name="4"
                        :title="t('project.goals-title')"
                        data-test="project-step"
                        icon="bi-flag"
                    >
                        <ProjectSubmitGoals @update-step="(nextStep) => step = nextStep"/>
                    </QStep>

                    <!-- DOCUMENTS -->
                    <QStep
                        :name="5"
                        :title="t('project.documents')"
                        data-test="project-step"
                        icon="bi-file-earmark"
                    >
                        <ProjectSubmitDocuments
                            :applicant="applicant"
                            :association-id="associationId"
                            @update-step="(nextStep) => step = nextStep"
                        />
                    </QStep>

                    <!-- RECAP -->
                    <QStep
                        :name="6"
                        :title="t('recap')"
                        data-test="project-step"
                        icon="bi-check-lg"
                    >
                        <ProjectRecap
                            view="submitProject"
                            @submit-project="onSubmitProject"
                            @change-step="newStep => step = newStep"
                            @get-file="uploadDocument => onGetFile(uploadDocument)"
                        />
                    </QStep>
                </QStepper>
            </div>
        </div>

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
                        :project="projectId"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
@import '@/assets/_variables.scss';
</style>