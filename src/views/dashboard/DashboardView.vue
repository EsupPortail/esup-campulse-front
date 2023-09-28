<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import useSecurity from '@/composables/useSecurity'
import useUserGroups from '@/composables/useUserGroups'
import {useUserStore} from '@/stores/useUserStore'
import {onMounted, ref, watch} from 'vue'
import InfoDocumentLibrary from '@/components/infoPanel/InfoDocumentLibrary.vue'
import ListDocumentDashboard from '@/components/documents/ListDocumentDashboard.vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {useProjectStore} from '@/stores/useProjectStore'
import ProjectStatusIndicator from '@/components/project/ProjectStatusIndicator.vue'


const userStore = useUserStore()
const {t} = useI18n()
const {hasPerm} = useSecurity()
const {isStaff, isMemberFund} = useUserGroups()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const projectStore = useProjectStore()

const associationCounter = ref<number>(0)

const initAssociationCounter = () => {
    userStore.user?.associations.forEach(function (association) {
        const a = userStore.userAssociations.find(obj => obj.association.id === association.id)
        if (a && a.isValidatedByAdmin) associationCounter.value++
    })
}
watch(() => userStore.userAssociations.length, initAssociationCounter)

async function onGetUserDocuments() {
    if (!isStaff.value && hasPerm('add_project_user')) {
        try {
            await userStore.getUserDocuments(['DOCUMENT_USER'])
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: catchHTTPError(error.response)
                })
            }
        }
    }
}

async function onGetProjects() {
    if (hasPerm('add_project_user')) {
        try {
            await projectStore.getAllProjects()
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: catchHTTPError(error.response)
                })
            }
        }
    }
}

onMounted(async () => {
    loading.show()
    initAssociationCounter()
    await onGetUserDocuments()
    await onGetProjects()
    loading.hide()
})

</script>

<template>
    <!-- Welcome message + username -->
    <section class="dashboard-section">
        <div class="dashboard-section-container">
            <p class="text-center">
                {{ t('dashboard.welcome-message', {name: userStore.user?.firstName + ' ' + userStore.user?.lastName}) }}
            </p>
        </div>
    </section>

    <!-- Account management -->
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-person"
            ></i>
            {{ t('dashboard.manage-my-account') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="dashboard-btn-group">
                <QBtn
                    :label="t('dashboard.account-infos')"
                    :to="{ name: 'ManageAccount' }"
                    class="btn-lg"
                    color="dashboard"
                />
            </div>
        </div>
    </section>

    <!-- User management, for staff only -->
    <section
        v-if="isStaff && (hasPerm('change_user') ||
            hasPerm('add_user'))"
        class="dashboard-section"
    >
        <h2>
            <QIcon name="bi-people"/>
            {{ t('dashboard.manage-users') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <div class="dashboard-btn-group">
                    <QBtn
                        v-if="hasPerm('change_user')"
                        :label="t('dashboard.user-validation')"
                        :to="{ name: 'ValidateUsers' }"
                        class="btn-lg"
                        color="dashboard"
                    />
                    <QBtn
                        v-if="hasPerm('change_associationuser')"
                        :label="t('user-manager.association-validation')"
                        :to="{ name: 'ValidateAssociationUsers' }"
                        class="btn-lg"
                        color="dashboard"
                    />
                    <QBtn
                        v-if="hasPerm('change_user')"
                        :label="t('dashboard.user-management')"
                        :to="{ name: 'ManageUsers' }"
                        class="btn-lg"
                        color="dashboard"
                    />
                    <QBtn
                        v-if="hasPerm('add_user')"
                        :label="t('dashboard.create-user')"
                        :to="{ name: 'AddUser' }"
                        class="btn-lg"
                        color="dashboard"
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- Association management, for staff only -->
    <section
        v-if="isStaff &&
            (hasPerm('change_association') ||
                hasPerm('add_association'))"
        class="dashboard-section"
    >
        <h2>
            <QIcon name="bi-card-list"/>
            {{ t('dashboard.association-directory') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <div class="dashboard-btn-group">
                    <QBtn
                        v-if="hasPerm('change_association')"
                        :label="t('dashboard.edit-or-delete-association')"
                        :to="{ name: 'ManageAssociations' }"
                        class="btn-lg"
                        color="dashboard"
                    />
                    <QBtn
                        v-if="hasPerm('add_association')"
                        :label="t('dashboard.create-association')"
                        :to="{ name: 'CreateAssociation' }"
                        class="btn-lg"
                        color="dashboard"
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- Charter management, for staff only -->
    <section
        v-if="isStaff && hasPerm('add_association_all_fields')"
        class="dashboard-section"
    >
        <h2>
            <QIcon name="bi-pen"/>
            {{ t('charter.charter', 2) }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <div class="dashboard-btn-group">
                    <QBtn
                        :label="t('dashboard.manage-charters')"
                        :to="{ name: 'ManageCharters' }"
                        class="btn-lg"
                        color="dashboard"
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- Commission management, for staff only -->
    <section
        v-if="(isStaff || isMemberFund) && (hasPerm('view_project'))"
        class="dashboard-section"
    >
        <h2>
            <QIcon name="bi-journal-text"/>
            {{ t('commission.commission', 2) }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <div class="dashboard-btn-group">
                    <QBtn
                        :label="isMemberFund ? t('dashboard.view-projects') : t('dashboard.manage-projects')"
                        :to="{ name: 'ManageProjects' }"
                        class="btn-lg"
                        color="dashboard"
                    />
                    <QBtn
                        v-if="hasPerm('add_commission')"
                        :label="t('dashboard.manage-commissions')"
                        :to="{ name: 'ManageCommissionDates' }"
                        class="btn-lg"
                        color="dashboard"
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- Template document library management -->
    <section
        v-if="isStaff && (hasPerm('add_document'))"
        class="dashboard-section"
    >
        <h2>
            <QIcon name="bi-files"/>
            {{ t('dashboard.template-document-library') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <div class="dashboard-btn-group">
                    <QBtn
                        v-if="hasPerm('add_document')"
                        :label="t('dashboard.manage-template-documents')"
                        :to="{ name: 'ManageDocumentsLibrary' }"
                        class="btn-lg"
                        color="dashboard"
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- Template document library -->
    <section
        v-if="hasPerm('add_project_association') || hasPerm('add_project_user')"
        class="dashboard-section"
    >
        <h2>
            <QIcon name="bi-files"/>
            {{ t('dashboard.template-document-library') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <div class="dashboard-btn-group">
                    <QBtn
                        :label="t('dashboard.template-document-library')"
                        :to="{ name: 'DocumentsLibrary' }"
                        class="btn-lg"
                        color="dashboard"
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- My associations, for association members only -->
    <section
        v-if="associationCounter > 0"
        class="dashboard-section"
    >
        <h2>
            <QIcon name="bi-people"/>
            {{ t('dashboard.association-user.my-associations') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="dashboard-btn-group">
                <div
                    v-for="association in userStore.userAssociations"
                    :key="association.association.id"
                >
                    <QBtn
                        v-if="association.isValidatedByAdmin"
                        :label="t('manage') + ' ' + association.association.name"
                        :to="{ name: 'AssociationDashboard', params: { id: association.association.id } }"
                        class="btn-lg"
                        color="dashboard"
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- My documents, for misc students only -->
    <section
        v-if="!isStaff && hasPerm('add_project_user')"
        class="dashboard-section"
    >
        <h2>
            <QIcon name="bi-file-earmark"/>
            {{ t('dashboard.my-documents') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <InfoDocumentLibrary color="dashboard"/>
                <ListDocumentDashboard
                    v-if="userStore.userDocuments?.length"
                    :documents="userStore.userDocuments"
                />
                <div v-else>
                    <p>{{ t('documents.no-document-to-show') }}</p>
                </div>
            </div>
        </div>
    </section>

    <!-- My projects, for misc students only -->
    <section
        v-if="hasPerm('add_project_user')"
        class="dashboard-section"
    >
        <h2>
            <QIcon name="bi-pen"/>
            {{ t('dashboard.user-procedures') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <div class="document-input-group">
                    <div class="flex-row-space-between padding-top padding-bottom">
                        <h3>{{ t('dashboard.association-user.project-status-processing') }}</h3>
                        <QBtn
                            :label="t('project.manage')"
                            :to="{ name: 'ManageProjects' }"
                            class="btn-lg"
                            color="dashboard"
                        />
                    </div>
                    <section v-if="projectStore.selfProjects.length">
                        <div
                            v-for="project in projectStore.selfProjects.slice(0, 3)"
                            :key="project.id"
                            class="document-input variant-space-1"
                        >
                            <div class="document-input-header">
                                <div class="flex-row-space-between">
                                    <h4>
                                        {{ project.name }}
                                    </h4>
                                    <ProjectStatusIndicator
                                        :project-status="project.projectStatus"
                                        :show-draft="true"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                    <section v-else>
                        <p>{{ t('project.no-project-to-show') }}</p>
                    </section>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
</style>



