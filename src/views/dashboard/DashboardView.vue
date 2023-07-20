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


const userStore = useUserStore()
const {t} = useI18n()
const {hasPerm} = useSecurity()
const {isStaff, isMemberFund} = useUserGroups()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()

const associationCounter = ref<number>(0)

const initAssociationCounter = () => {
    userStore.user?.associations.forEach(function (association) {
        const a = userStore.userAssociations.find(obj => obj.association.id === association.id)
        if (a && a.isValidatedByAdmin) associationCounter.value++
    })
}
watch(() => userStore.userAssociations.length, initAssociationCounter)

async function onGetUserDocuments() {
    if (!isStaff && hasPerm('add_project_user')) {
        try {
            await userStore.getUserDocuments()
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
    initAssociationCounter()
    await onGetUserDocuments()
    loading.hide()
})

</script>

<template>
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
                    :to="{name: 'ManageAccount'}"
                    class="btn-lg"
                    color="dashboard"
                />
            </div>
        </div>
    </section>

    <!-- My associations, for association members only -->
    <section
        v-if="associationCounter > 0"
        class="dashboard-section"
    >
        <h2>
            <QIcon name="mdi-card-account-details-outline"/>
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
                        :to="{name: 'AssociationDashboard', params: {id: association.association.id}}"
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
            <QIcon name="mdi-format-list-bulleted-square"/>
            {{ t('dashboard.manage-association-directory') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <div class="dashboard-btn-group">
                    <QBtn
                        v-if="hasPerm('add_association')"
                        :label="t('dashboard.create-association')"
                        :to="{name: 'CreateAssociation'}"
                        class="btn-lg"
                        color="dashboard"
                    />
                    <QBtn
                        v-if="hasPerm('change_association')"
                        :label="t('dashboard.edit-or-delete-association')"
                        :to="{name: 'ManageAssociations'}"
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
            <QIcon name="mdi-file-multiple-outline"/>
            {{ t('dashboard.template-document-library') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <div class="dashboard-btn-group">
                    <QBtn
                        v-if="hasPerm('add_document')"
                        :label="t('dashboard.manage-template-documents')"
                        :to="{name: 'ManageDocumentsLibrary'}"
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
            <QIcon name="mdi-folder-edit-outline"/>
            {{ t('dashboard.manage-commissions') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <div class="dashboard-btn-group">
                    <QBtn
                        :label="t('dashboard.manage-projects')"
                        :to="{name: 'ManageProjects'}"
                        class="btn-lg"
                        color="dashboard"
                    />
                </div>
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
            <QIcon name="mdi-account-group"/>
            {{ t('dashboard.manage-users') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <div class="dashboard-btn-group">
                    <QBtn
                        v-if="hasPerm('change_user')"
                        :label="t('dashboard.user-validation')"
                        :to="{name: 'ValidateUsers'}"
                        class="btn-lg"
                        color="dashboard"
                    />
                    <QBtn
                        v-if="hasPerm('change_associationuser')"
                        :label="t('user-manager.association-validation')"
                        :to="{name: 'ValidateAssociationUsers'}"
                        class="btn-lg"
                        color="dashboard"
                    />
                    <QBtn
                        v-if="hasPerm('change_user')"
                        :label="t('dashboard.user-management')"
                        :to="{name: 'ManageUsers'}"
                        class="btn-lg"
                        color="dashboard"
                    />
                    <QBtn
                        v-if="hasPerm('add_user')"
                        :label="t('dashboard.create-user')"
                        :to="{name: 'AddUser'}"
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
            <QIcon name="mdi-pencil-box-outline"/>
            {{ t('dashboard.my-documents') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <InfoDocumentLibrary color="dashboard"/>
                <ListDocumentDashboard
                    v-if="userStore.userDocuments.length"
                    :documents="userStore.userDocuments"
                />
                <div v-else>
                    <p>{{ t('documents.no-documents-to-show') }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
</style>
