<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {computed, onMounted} from 'vue'
import {useQuasar} from 'quasar'
import {useRoute} from 'vue-router'
import {useProfileStore} from '@/stores/useProfileStore'
import type {Association, AssociationUser} from '#/association'
import useUserAssociations from '@/composables/useUserAssociation'
import useErrors from '@/composables/useError'
import axios from 'axios'
import InfoDocumentLibrary from '@/components/documents/InfoDocumentLibrary.vue'
import {useProjectStore} from '@/stores/useProjectStore'
import ProjectStatusIndicator from '@/components/project/ProjectStatusIndicator.vue'
import ListDocumentDashboard from '@/components/documents/ListDocumentDashboard.vue'
import CharterStatusIndicator from '@/components/charter/CharterStatusIndicator.vue'
import useCharters from '@/composables/useCharter'
import useUtil from '@/composables/useUtil'

const {t} = useI18n()
const {loading, notify} = useQuasar()
const route = useRoute()
const associationStore = useAssociationStore()
const profileStore = useProfileStore()
const {associationUserRole, associationRoleOptions} = useUserAssociations()
const {catchHTTPError} = useErrors()
const {dynamicTitle} = useUtil()
const projectStore = useProjectStore()
const {initCharters, charterList} = useCharters()

onMounted(async () => {
  loading.show()
  await onGetData()
  dynamicTitle.value = association.value?.name
  loading.hide()
})

const association = computed<Association>(() => {
  return associationStore.association
})

const hasPresidentStatus = computed<boolean>(() => {
  return profileStore.hasPresidentStatus(association.value?.id)
})

const associationUser = computed<AssociationUser>(() => {
  return profileStore.userAssociations
    .find(obj => obj.association.id === Number.parseInt(route.params.id as string))
})

const role = computed<{ codeName: string, literalName: string }>(() => {
  const codeName = associationUserRole(associationUser.value)
  return {
    codeName,
    literalName: associationRoleOptions.find(obj => obj.value === codeName)?.label ?? ''
  }
})

async function onGetData() {
  try {
    await associationStore.getAssociationDetail(Number.parseInt(route.params.id as string), false)
    await associationStore.getAssociationDocuments(['DOCUMENT_ASSOCIATION'])
    await initCharters(associationStore.association!.id, associationStore.association!.isSite, associationStore.association!.charterStatus)
    await projectStore.getProjects({association: association.value!.id})
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
}

</script>

<template>
  <section class="dashboard-section">
    <h2>
      <QIcon name="bi-person"/>
      {{ t('dashboard.association-user.my-role') }}
    </h2>
    <div class="dashboard-section-container">
      <div class="container">
        <p v-if="role.literalName">
          {{
            role.literalName + (role.codeName !== 'isPresident' ?
              ` ${hasPresidentStatus ? t('with') : t('without')} droits de présidence` : '')
          }}
        </p>
      </div>
    </div>
  </section>

  <section
    v-if="hasPresidentStatus || association?.isPublic || profileStore.userAssociations.find(obj => obj.association.id === association?.id)?.isPresident"
    class="dashboard-section"
  >
    <h2>
      <QIcon name="bi-card-list"/>
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
            v-if="profileStore.userAssociations.find(obj => obj.association.id === association?.id)?.isPresident"
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
      <QIcon name="bi-file-earmark"/>
      {{ t('dashboard.association-user.association-documents') }}
    </h2>
    <div class="dashboard-section-container">
      <div class="container">
        <ListDocumentDashboard
          v-if="associationStore.associationDocuments.length"
          :documents="associationStore.associationDocuments"
        />
        <div v-else>
          <p>{{ t('documents.no-document-to-show') }}</p>
        </div>
      </div>
    </div>
  </section>
  <!-- Association procedures -->
  <section class="dashboard-section">
    <h2>
      <QIcon name="bi-pen"/>
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
          <section v-if="charterList.length">
            <div
              v-for="charter in charterList"
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
          <section v-if="projectStore.projects?.results?.length">
            <div
              v-for="project in projectStore.projects.results.slice(0, 3)"
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
@import '@/assets/styles/dashboard';
@import '@/assets/styles/forms';
</style>
