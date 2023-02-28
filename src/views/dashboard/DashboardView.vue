<script lang="ts" setup>
import {useUserStore} from '@/stores/useUserStore'
import {useI18n} from 'vue-i18n'
import useSecurity from '@/composables/useSecurity'
import useUserGroups from "@/composables/useUserGroups";

const userStore = useUserStore()
const {t} = useI18n()
const {hasPerm} = useSecurity()
const {isStaff} = useUserGroups()
</script>

<template>
    <!-- <h1>{{ t("home.dashboard") }}</h1>
    <p class="welcome-msg">
        {{ t('dashboard.welcome-message') + ', ' + userStore.userName }}
    </p> -->
    <section class="dashboard-section">
        <h2>
            <QIcon name="mdi-card-account-details-outline"/>
            {{ t('dashboard.manage-my-account') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <div class="button-group">
                    <QBtn
                        :label="t('password.edit-password')"
                        :to="{name: 'PasswordEdit'}"
                        color="secondary"
                    />
                </div>
            </div>
        </div>
    </section>
    <section v-if="isStaff &&
        (hasPerm('change_association') ||
            hasPerm('add_association'))" class="dashboard-section"
    >
        <h2>
            <QIcon name="mdi-format-list-bulleted-square"/>
            {{ t('dashboard.manage-association-directory') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <div class="button-group">
                    <QBtn
                        v-if="hasPerm('change_association')"
                        :label="t('dashboard.edit-or-delete-association')"
                        :to="{name: 'ManageAssociations'}"
                        color="secondary"
                    />
                    <QBtn
                        v-if="hasPerm('add_association')"
                        :label="t('dashboard.create-association')"
                        :to="{name: 'CreateAssociation'}"
                        color="secondary"
                    />
                </div>
            </div>
        </div>
    </section>
    <!-- Section to implement in association dashboard -->
    <section v-if="userStore.user?.associations && userStore.user?.associations?.length > 0" class="dashboard-section">
        <h2>
            <QIcon name="mdi-pencil-box-outline"/>
            {{ t('dashboard.association-user.manage-my-associations') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <div class="button-group">
                    <QBtn
                        :label="t('dashboard.association-user.edit-my-association')"
                        :to="{name: 'ManageAssociations'}"
                        color="secondary"
                    />
                </div>
            </div>
        </div>
    </section>
    <!-- End -->
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
                        color="secondary"
                    />
                    <QBtn
                        v-if="hasPerm('change_user')"
                        :label="t('dashboard.user-management')"
                        :to="{name: 'ManageUsers'}"
                        color="secondary"
                    />
                    <QBtn
                        v-if="hasPerm('add_user')"
                        :label="t('dashboard.create-user')"
                        :to="{name: 'AddUser'}"
                        color="secondary"
                    />
                </div>
            </div>
        </div>
    </section>
    <section class="dashboard-section">
        <h2>
            <QIcon name="mdi-pencil-box-outline"/>
            Section test
        </h2>
        <div class="form-container">
            <div class="form">

                <div class="document-input-group">
                    <div class="document-input variant-space-1">
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
                                    Certificat de scolarité des membres élus (1 document par membre)
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

<style lang="sass">
@import '@/assets/styles/dashboard.scss'
</style>