<script lang="ts" setup>
import FormProfilePasswordEdit from '@/components/authentication/FormProfilePasswordEdit.vue'
import {useI18n} from 'vue-i18n'
import FormUserInfosEdition from '@/components/user/FormUserInfosEdition.vue'
import {useProfileStore} from '@/stores/useProfileStore'
import {onMounted, ref} from 'vue'
import useUserGroups from '@/composables/useUserGroup'
import axios from 'axios'
import useUsers from '@/composables/useUser'
import {useQuasar} from 'quasar'
import useUserAssociations from '@/composables/useUserAssociation'
import FormDisplayUserAssociations from '@/components/user/FormDisplayUserAssociations.vue'
import FormRegisterUserAssociations from '@/components/user/FormRegisterUserAssociations.vue'
import useSecurity from '@/composables/useAuthentication'
import useErrors from '@/composables/useError'
import FormDocumentUpload from '@/components/documents/FormDocumentUpload.vue'
import useDocumentUploads from '@/composables/useDocumentUpload'

const {t} = useI18n()
const profileStore = useProfileStore()
const {isStaff, initGroupPermToJoinAssociation} = useUserGroups()
const {initInfosToPatch, infosToPatch, updateUserInfos} = useUsers()
const {notify, loading} = useQuasar()
const {userAssociationsRegister, hasPerm} = useSecurity()
const {catchHTTPError} = useErrors()
const {
  newAssociations,
  updateUserAssociations,
  initUserAssociations,
  userAssociations
} = useUserAssociations()
const {uploadDocuments, initProcessDocuments, initUserDocumentUploads} = useDocumentUploads()

const tab = ref<string>('infos')

async function onUpdateUserInfos() {
  loading.show()
  try {
    initInfosToPatch(profileStore.user)
    if (Object.entries(infosToPatch).length) {
      await updateUserInfos(profileStore.user, false)
    } /*else {
            notify({
                type: 'warning',
                message: t('notifications.warning.no-modifications-found')
            })
        }*/
    await uploadDocuments(null, profileStore.user?.id)
    initProcessDocuments()
    await profileStore.getUserDocuments()
    initUserDocumentUploads()
    notify({
      type: 'positive',
      message: t('notifications.positive.update-user-infos')
    })
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
  loading.hide()
}

async function onUpdateUserAssociations() {
  loading.show()
  try {
    updateUserAssociations(false)
    await userAssociationsRegister(profileStore.user?.id)
    newAssociations.value = []
    await profileStore.getUserAssociations()
    initUserAssociations(false)
    notify({
      type: 'positive',
      message: t('notifications.positive.associations-successfully-updated')
    })
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
  loading.hide()
}

onMounted(() => {
  const groupArray = profileStore.user?.groups.map(group => group.groupId)
  if (groupArray && groupArray.length) initGroupPermToJoinAssociation(groupArray)
})

</script>

<template>
  <QTabs
    v-model="tab"
    active-color="dashboard"
    class="padding-top"
    dense
    indicator-color="dashboard"
    narrow-indicator
  >
    <QTab
      :label="t('dashboard.my-infos')"
      name="infos"
    />
    <QTab
      v-if="!isStaff"
      :label="t('dashboard.my-associations')"
      name="associations"
    />
    <QTab
      v-if="!profileStore.user?.isCas"
      :label="t('dashboard.my-password')"
      name="password"
    />
  </QTabs>

  <QTabPanels
    v-model="tab"
    animated
  >
    <QTabPanel name="infos">
      <div class="dashboard-section">
        <h2>
          <i
            aria-hidden="true"
            class="bi bi-pencil-square"
          ></i>
          {{ t('dashboard.my-infos') }}
        </h2>

        <div class="dashboard-section-container">
          <div class="container">
            <QForm
              class="q-gutter-md"
              @submit.prevent="onUpdateUserInfos"
            >
              <FormUserInfosEdition
                v-if="profileStore.user"
                :edited-by-staff="false"
                :user="profileStore.user"
              />
              <div
                v-if="!isStaff && !profileStore.isCas && (hasPerm('add_project_user') || hasPerm('add_project_association'))"
              >
                <hgroup>
                  <h3>{{ t('forms.student-status-document') }}</h3>
                  <p>{{ t('forms.student-status-document-hint') }}</p>
                </hgroup>
                <FormDocumentUpload
                  :association-id="undefined"
                  process="account-management"
                />
              </div>
              <div class="flex-row-center">
                <QBtn
                  :label="t('validate-changes')"
                  class="btn-lg"
                  color="dashboard"
                  icon="bi-check-lg"
                  type="submit"
                />
              </div>
            </QForm>
          </div>
        </div>
      </div>
    </QTabPanel>

    <QTabPanel name="associations">
      <div class="dashboard-section">
        <h2>
          <i
            aria-hidden="true"
            class="bi bi-pencil-square"
          ></i>
          {{ t('dashboard.association-user.my-associations') }}
        </h2>

        <div class="dashboard-section-container">
          <div class="container flex-column">
            <FormDisplayUserAssociations/>
          </div>
        </div>
      </div>

      <section
        v-if="userAssociations.length < 5"
        class="dashboard-section"
      >
        <h2>
          <i
            aria-hidden="true"
            class="bi bi-pencil-square"
          ></i>
          {{ t('dashboard.association-user.new-associations') }}
        </h2>

        <div class="dashboard-section-container">
          <div class="container">
            <QForm @submit.prevent="onUpdateUserAssociations">
              <FormRegisterUserAssociations/>
            </QForm>
          </div>
        </div>
      </section>
    </QTabPanel>

    <QTabPanel name="password">
      <FormProfilePasswordEdit/>
    </QTabPanel>
  </QTabPanels>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/associations.scss';
@import '@/assets/styles/forms.scss';
@import '@/assets/_variables.scss';
@import '@/assets/styles/dashboard.scss';
</style>
