<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from "@/stores/useAssociationStore";
import {onMounted, ref, watch} from "vue";
import {useQuasar} from "quasar";
import {useRoute} from "vue-router";
import {useUserStore} from "@/stores/useUserStore";
import type {Association} from "#/association";

const {t} = useI18n()
const {loading, notify} = useQuasar()
const route = useRoute()

const associationStore = useAssociationStore()
const userStore = useUserStore()

onMounted(async function () {
    loading.show
    await onGetAssociationDetail()
    loading.hide
})

watch(() => route.path, async () => {
    if (route.name === 'AssociationDashboard') await onGetAssociationDetail()
})

const association = ref<Association>()

const hasPresidentStatus = ref<boolean>(false)

const initValues = () => {
    association.value = associationStore.association
    hasPresidentStatus.value = userStore.hasPresidentStatus(association?.value?.id as number)
}

watch(() => associationStore.association, initValues)
watch(() => userStore.userAssociations, initValues)


async function onGetAssociationDetail() {
    try {
        await associationStore.getAssociationDetail(parseInt(route.params.id as string), false)
    } catch (error) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

</script>

<template>
    <section class="dashboard-section">
        <h2>
            <QIcon name="mdi-format-list-bulleted-square"/>
            {{ t('dashboard.manage-association-directory') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <div class="button-group">
                    <QBtn
                        v-if="hasPresidentStatus"
                        :label="t('dashboard.association-user.edit-my-association')"
                        :to="{ name: 'EditMyAssociation', params: {id: association?.id} }"
                        color="secondary"
                    />
                    <QBtn
                        v-if="association?.isPublic"
                        :label="t('association.more-details')"
                        :to="{ name: 'AssociationDetail', params: { id: association?.id } }"
                    />
                    <QBtn
                        v-if="hasPresidentStatus"
                        :label="t('dashboard.association-user.delegate-presidency')"
                        :to="{ name: 'AssociationPresidencyDelegation', params: { id: association?.id } }"
                        color="primary"
                    />

                </div>
            </div>
        </div>
    </section>
    <!-- Association documents -->
    <section class="dashboard-section">
        <h2>
            <QIcon name="mdi-pencil-box-outline"/>
            {{ t('dashboard.association-user.association-documents') }}
        </h2>
        <div class="form-container">
            <div class="form">

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
    <!-- Association procedures -->
    <section class="dashboard-section">
        <h2>
            <QIcon name="mdi-pencil-box-outline"/>
            {{ t('dashboard.association-user.association-procedures') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <div class="document-input-group">
                    <div class="document-input-group-header">
                        <h3>Suivi du traitement des chartes</h3>
                        <QBtn
                            :label="t('dashboard.association-user.charter-status-processing')"
                        />
                    </div>
                    <div class="document-input variant-space-1">
                        <div class="document-input-header">
                            <h4>
                                FSDIE - Charte de subventionnement
                            </h4>
                        </div>
                    </div>
                    <div class="document-input variant-space-1">
                        <div class="document-input-header">
                            <h4>
                                IdEx - Charte de subventionnement
                            </h4>
                        </div>
                    </div>
                    <div class="document-input variant-space-1">
                        <div class="document-input-header">
                            <h4>
                                Culture-ActionS - Charte de subventionnement
                            </h4>
                        </div>
                    </div>
                </div>
                <div class="document-input-group">
                    <div class="document-input-group-header">
                        <h3>Suivi du traitement des dossiers CAPE</h3>
                        <QBtn
                            label="Gestion des dossiers CAPE"
                        />
                    </div>
                    <div class="document-input variant-space-1">
                        <div class="document-input-header">
                            <h4>
                                Dossier CAPE Rentrée 2022
                            </h4>
                        </div>
                    </div>
                    <div class="document-input variant-space-1">
                        <div class="document-input-header">
                            <h4>
                                Dossier CAPE Octobre 2022
                            </h4>
                        </div>
                    </div>
                    <div class="document-input variant-space-1">
                        <div class="document-input-header">
                            <h4>
                                Dossier CAPE Novembre 2022
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="sass" scoped>

.document-input-group-header
    display: flex
    justify-content: space-between
    margin-bottom: 1rem
    align-items: flex-end

    h3
        font-size: 1.5rem
        color: #152639
</style>

<style lang="sass">
@import '@/assets/styles/dashboard.scss'
@import '@/assets/styles/forms.scss'
</style>

