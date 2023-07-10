<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {onMounted, ref, watch} from 'vue'
import {useQuasar} from 'quasar'
import {useRoute} from 'vue-router'
import {useUserStore} from '@/stores/useUserStore'
import type {Association} from '#/association'
import type {AssociationUserDetail} from '#/user'
import useUserAssociations from '@/composables/useUserAssociations'
import useErrors from '@/composables/useErrors'
import axios from 'axios'
import useUtility from '@/composables/useUtility'
import InfoDocumentLibrary from '@/components/infoPanel/InfoDocumentLibrary.vue'
import {useProjectStore} from '@/stores/useProjectStore'
import ProjectStatusIndicator from '@/components/project/ProjectStatusIndicator.vue'
import ListDocumentDashboard from '@/components/documents/ListDocumentDashboard.vue'
import CharterStatusIndicator from '@/components/charter/CharterStatusIndicator.vue'
import useCharters from '@/composables/useCharters'

const {t} = useI18n()
const {loading, notify} = useQuasar()
const route = useRoute()
const associationStore = useAssociationStore()
const userStore = useUserStore()
const {getAssociationUserRole, associationRoleOptions} = useUserAssociations()
const {catchHTTPError} = useErrors()
const {dynamicTitle} = useUtility()
const projectStore = useProjectStore()
const {initCharters, manageCharters} = useCharters()

onMounted(async function () {
    loading.show()
    await onGetAssociationDetail()
    await onGetAssociationDocuments()
    initAssociationUser()
    initAssociationUserRole()
    await onGetAssociationProjects()
    await onGetAssociationCharters()
    dynamicTitle.value = association.value?.name
    loading.hide()
})

// TODO; find a way to avoid double request
watch(() => route.path, async () => {
    if (route.name === 'AssociationDashboard') await onGetAssociationDetail()
    dynamicTitle.value = association.value?.name
})

const association = ref<Association>()

const hasPresidentStatus = ref<boolean>(false)

const initValues = () => {
    association.value = associationStore.association
    hasPresidentStatus.value = userStore.hasPresidentStatus(association?.value?.id as number)
}

watch(() => associationStore.association, initValues)
watch(() => userStore.userAssociations.length, initValues)

const associationUser = ref<AssociationUserDetail>()

const initAssociationUser = () => {
    associationUser.value = userStore.userAssociations.find(obj => obj.association.id === parseInt(route.params.id as string))
}
watch(() => userStore.userAssociations.length, initAssociationUser)

const associationUserRole = ref<{ codeName: string, literalName: string }>({
    codeName: '',
    literalName: ''
})
const initAssociationUserRole = () => {
    if (associationUser.value) {
        const codeName = getAssociationUserRole(associationUser.value)
        const literalName = associationRoleOptions.find(obj => obj.value === codeName)?.label ?? ''
        associationUserRole.value.codeName = codeName
        associationUserRole.value.literalName = literalName
    }
}
watch(() => associationUser.value, initAssociationUserRole)


async function onGetAssociationDetail() {
    try {
        await associationStore.getAssociationDetail(parseInt(route.params.id as string), false)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onGetAssociationDocuments() {
    try {
        await associationStore.getAssociationDocuments()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onGetAssociationCharters() {
    try {
        await initCharters(parseInt(route.params.id as string))
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onGetAssociationProjects() {
    try {
        await projectStore.getAssociationProjects(association.value?.id as number)
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
            <QIcon name="mdi-account"/>
            {{ t('dashboard.association-user.my-role') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <p
                    v-if="associationUserRole.literalName"
                >
                    {{
                        associationUserRole.literalName + (associationUserRole.codeName !== 'isPresident' ?
                            ` ${hasPresidentStatus ? t('with') : t('without')} droits de présidence` : '')
                    }}
                </p>
            </div>
        </div>
    </section>

    <section
        v-if="hasPresidentStatus || association?.isPublic || userStore.userAssociations.find(obj => obj.association.id === association?.id)?.isPresident"
        class="dashboard-section"
    >
        <h2>
            <QIcon name="mdi-format-list-bulleted-square"/>
            {{ t('dashboard.association-user.manage-association') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <div class="dashboard-btn-group">
                    <QBtn
                        v-if="hasPresidentStatus"
                        :label="t('dashboard.association-user.edit-my-association')"
                        :to="{ name: 'EditMyAssociation', params: {id: association?.id} }"
                        class="btn-lg"
                        color="dashboard"
                    />
                    <QBtn
                        v-if="association?.isPublic"
                        :label="t('association.more-details')"
                        :to="{ name: 'AssociationDetail', params: { id: association?.id } }"
                        class="btn-lg"
                        color="dashboard"
                    />
                    <QBtn
                        v-if="userStore.userAssociations.find(obj => obj.association.id === association?.id)?.isPresident"
                        :label="t('dashboard.association-user.delegate-presidency')"
                        :to="{ name: 'AssociationPresidencyDelegation', params: { id: association?.id } }"
                        class="btn-lg"
                        color="dashboard"
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- Association documents -->
    <section class="dashboard-section">
        <h2>
            <QIcon name="mdi-file-outline"/>
            {{ t('dashboard.association-user.association-documents') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <ListDocumentDashboard
                    v-if="associationStore.associationDocuments.length"
                    :documents="associationStore.associationDocuments"
                />
                <div v-else>
                    <p>{{ t('documents.no-documents-to-show') }}</p>
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
        <div class="dashboard-section-container">
            <div class="container">
                <InfoDocumentLibrary color="dashboard"/>
                <div class="document-input-group">
                    <div class="flex-row-space-between padding-top padding-bottom">
                        <h3>{{ t('dashboard.association-user.charter-status-processing') }}</h3>
                        <QBtn
                            :label="t('charter.options.manage')"
                            :to="{name: 'ManageCharters'}"
                            class="btn-lg"
                            color="dashboard"
                        />
                    </div>
                    <section
                        v-if="manageCharters.length"
                    >
                        <div
                            v-for="charter in manageCharters"
                            :key="charter.documentId"
                            class="document-input variant-space-1"
                        >
                            <div class="document-input-header">
                                <div class="flex-row-space-between">
                                    <h4>
                                        {{ charter.documentName }}
                                    </h4>
                                    <CharterStatusIndicator :charter-status="charter.charterStatus"/>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section v-else>
                        <p>{{ t('charter.no-charter-to-show') }}</p>
                    </section>
                </div>
                <div class="document-input-group">
                    <div class="flex-row-space-between padding-top padding-bottom">
                        <h3>{{ t('dashboard.association-user.project-status-processing') }}</h3>
                        <QBtn
                            :label="t('project.manage')"
                            :to="{name: 'ManageProjects'}"
                            class="btn-lg"
                            color="dashboard"
                        />
                    </div>
                    <section
                        v-if="projectStore.projects.length"
                    >
                        <div
                            v-for="project in projectStore.projects.slice(0, 3)"
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
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';
</style>
