<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import useSecurity from '@/composables/useSecurity'
import useUserGroups from '@/composables/useUserGroups'
import {useUserStore} from '@/stores/useUserStore'
import {onMounted, ref, watch} from 'vue'
import InfoDocumentLibrary from '@/components/infoPanel/InfoDocumentLibrary.vue'

const userStore = useUserStore()
const {t} = useI18n()
const {hasPerm} = useSecurity()
const {isStaff} = useUserGroups()

const associationCounter = ref<number>(0)

const initAssociationCounter = () => {
    userStore.user?.associations.forEach(function (association) {
        const a = userStore.userAssociations.find(obj => obj.association.id === association.id)
        if (a && a.isValidatedByAdmin) associationCounter.value++
    })
}
watch(() => userStore.userAssociations.length, initAssociationCounter)

onMounted(async () => {
    initAssociationCounter()
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
                    size="md"
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
        <div class="form-container">
            <div class="form">
                <div class="button-group">
                    <QBtn
                        v-if="hasPerm('add_association')"
                        :label="t('dashboard.create-association')"
                        :to="{name: 'CreateAssociation'}"
                    />
                    <QBtn
                        v-if="hasPerm('change_association')"
                        :label="t('dashboard.edit-or-delete-association')"
                        :to="{name: 'ManageAssociations'}"
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
        <div class="form-container">
            <div class="form">
                <div class="button-group">
                    <QBtn
                        v-if="hasPerm('add_document')"
                        :label="t('dashboard.manage-template-documents')"
                        :to="{name: 'ManageDocumentsLibrary'}"
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- Commission management, for staff only -->
    <section
        v-if="isStaff && (hasPerm('view_project'))"
        class="dashboard-section"
    >
        <h2>
            <QIcon name="mdi-folder-edit-outline"/>
            {{ t('dashboard.manage-commissions') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <div class="button-group">
                    <QBtn
                        :label="t('dashboard.manage-projects')"
                        :to="{name: 'Commission'}"
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
        <div class="form-container">
            <div class="form">
                <div class="button-group">
                    <QBtn
                        v-if="hasPerm('change_user')"
                        :label="t('dashboard.user-validation')"
                        :to="{name: 'ValidateUsers'}"
                    />
                    <QBtn
                        v-if="hasPerm('change_associationuser')"
                        :label="t('user-manager.association-validation')"
                        :to="{name: 'ValidateAssociationUsers'}"
                    />
                    <QBtn
                        v-if="hasPerm('change_user')"
                        :label="t('dashboard.user-management')"
                        :to="{name: 'ManageUsers'}"
                    />
                    <QBtn
                        v-if="hasPerm('add_user')"
                        :label="t('dashboard.create-user')"
                        :to="{name: 'AddUser'}"
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
        <div class="form-container">
            <div class="form">
                <InfoDocumentLibrary/>
                <div class="document-input-group">
                    <div class="document-input variant-space-1">
                        <div class="document-input-header">
                            <h4>
                                Certificat de scolarité des membres élus
                            </h4>
                            <p>
                                <a>
                                    <i class="bi bi-info-circle"></i>
                                </a>
                            </p>
                            <button>
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                        <div class="document-input-list">
                            <div class="document-item">
                                <p>
                                    <i class="bi bi-file-earmark"></i>
                                    <a>
                                        cert_scol_membre1.pdf
                                        <i class="bi bi-eye"></i>
                                    </a>
                                </p>
                                <button>
                                    <i class="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <div class="document-item">
                                <p>
                                    <i class="bi bi-file-earmark"></i>
                                    <a>
                                        cert_scol_membre2.pdf
                                        <i class="bi bi-eye"></i>
                                    </a>
                                </p>
                                <button>
                                    <i class="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <div class="document-item">
                                <p>
                                    <i class="bi bi-file-earmark"></i>
                                    <a>
                                        cert_scol_membre3.pdf
                                        <i class="bi bi-eye"></i>
                                    </a>
                                </p>
                                <button disabled>
                                    <i class="bi bi-x-lg"></i>
                                </button>
                            </div>
                        </div>

                        <div class="document-input">
                            <div class="document-input-header">
                                <h4>
                                    PV de la dernière AGO
                                </h4>
                                <p>
                                    <a>
                                        <i class="bi bi-info-circle"></i>
                                    </a>
                                </p>
                                <button>
                                    <i class="bi bi-plus"></i>
                                </button>
                            </div>
                            <!-- <div class="document-input-list"></div> -->
                        </div>

                        <div class="document-input">
                            <div class="document-input-header">
                                <h4>
                                    Certificat envoyé par le tribunal judiciaire
                                </h4>
                                <!-- <p>
                                    <a>
                                        <i class="bi bi-info-circle"></i>
                                    </a>
                                </p> -->
                                <button disabled>
                                    <i class="bi bi-plus"></i>
                                </button>
                            </div>
                            <!-- <div class="document-input-list"></div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
</style>
