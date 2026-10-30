<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {QInput, useQuasar} from 'quasar'
import {useProfileStore} from '@/stores/useProfileStore'
import router from '@/router'
import LayoutGDPRConsent from '@/components/FormGDPRConsent.vue'
import useAuthentication from '@/composables/useAuthentication'
import axios from 'axios'
import FormUserGroups from '@/components/user/FormUserGroups.vue'
import FormRegisterUserAssociations from '@/components/user/FormRegisterUserAssociations.vue'
import useUserGroups from '@/composables/useUserGroup'
import FormAddUserFromLDAP from '@/components/user/FormAddUserFromLDAP.vue'
import useErrors from '@/composables/useError'
import InfoFormRequiredFields from '@/components/global/InfoFormRequiredFields.vue'
import useDocumentUploads from '@/composables/useDocumentUpload'
import FormDocumentUpload from '@/components/documents/FormDocumentUpload.vue'
import {useRoute} from 'vue-router'
import useUser from '@/composables/useUser'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const profileStore = useProfileStore()
const {
  register,
  newUser,
  initNewUserData,
  emailVerification,
  CAS_INSTITUTION_DOMAIN,
} = useAuthentication()
const {groupChoiceIsValid, isStaff, studentGroupIsSelected, canJoinAssociation} = useUserGroups()
const {phoneRegex} = useUtil()
const {catchHTTPError} = useErrors()
const {processDocuments, uploadRegistrationDocuments} = useDocumentUploads()
const profileStore = useProfileStore()
const route = useRoute()
const {createUser} = useUser()

const isLDAPEnabled: boolean = import.meta.env.VITE_APP_OPEN_LDAP === 'true'
const hasConsent = ref<boolean>(false)

onMounted(async () => {
  loading.show()
  initNewUserData()
  await onLoadCASUser()
  loading.hide()
})

async function onLoadCASUser() {
  try {
    await profileStore.loadCASProfile(route.query.ticket as string)
  } catch (error) {
    await router.push({name: 'Login'})
    if ((error as Error).message === 'USER_ACCOUNT_ALREADY_EXISTS') {
      notify({
        type: 'negative',
        message: t('notifications.negative.cas-user-already-exists')
      })
    } else if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
}

// Register newUser
async function onRegister() {
  if (!groupChoiceIsValid.value) return
  loading.show()
  if (isStaff.value || hasConsent.value) {
    try {
      if (isStaff.value) {
        await createUser()
        await uploadRegistrationDocuments(newUser.username)
        processDocuments.value = []
        notify({
          type: 'positive',
          message: t('notifications.positive.account-created')
        })
        await router.push({name: 'Dashboard'})
        newUser.isCas = false
        newUser.firstName = ''
        newUser.lastName = ''
        newUser.username = ''
        newUser.email = ''
        newUser.phone = ''
      } else {
        await register()
        await uploadRegistrationDocuments(newUser.username)
        await router.push({name: 'RegistrationSuccessful'})
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data.email) {
          notify({
            type: 'negative',
            message: t('notifications.negative.email-used')
          })
        } else {
          notify({
            type: 'negative',
            message: await catchHTTPError(error.response)
          })
        }
      }
    }
  } else {
    notify({
      type: 'negative',
      message: t('notifications.negative.need-gdpr-consent')
    })
  }
  loading.hide()
}
</script>

<template>
  <QForm
    class="dashboard-section"
    @submit.prevent="onRegister"
  >
    <div class="dashboard-section">
      <h2>
        <i
          aria-hidden="true"
          class="bi bi-pencil-square"
        ></i>
        {{ t('user.infos') }}
      </h2>
      <div class="dashboard-section-container">
        <div class="container">
          <FormAddUserFromLDAP v-if="isStaff && isLDAPEnabled"/>
          <InfoFormRequiredFields/>
          <QInput
            v-model="newUser.firstName"
            :disable="newUser.isCas"
            :label="t('forms.first-name') + ' *'"
            :rules="[val => val && val.length > 0 || t('forms.required-first-name')]"
            aria-required="true"
            autocomplete="given-name"
            clearable
            color="dashboard"
            filled
            lazy-rules
          />
          <QInput
            v-model="newUser.lastName"
            :disable="newUser.isCas"
            :label="t('forms.last-name') + ' *'"
            :rules="[val => val && val.length > 0 || t('forms.required-last-name')]"
            aria-required="true"
            autocomplete="family-name"
            clearable
            color="dashboard"
            filled
            lazy-rules
          />
          <QInput
            v-model="newUser.email"
            :disable="newUser.isCas"
            :label="t('forms.email') + ' *'"
            :rules="[(val, rules) => rules.email(val) || t('forms.required-email'),
                     val => !val.endsWith(CAS_INSTITUTION_DOMAIN) &&
                       !userStore.isCas || t('forms.error-university-mail-domain')]"
            aria-required="true"
            autocomplete="email"
            clearable
            color="dashboard"
            filled
            lazy-rules
            type="email"
          />
          <QInput
            v-model="emailVerification"
            :disable="newUser.isCas"
            :label="t('forms.repeat-email') + ' *'"
            :rules="[(val, rules) => rules.email(val) && val === newUser.email || t('forms.required-repeat-email')]"
            aria-required="true"
            autocomplete="email"
            clearable
            color="dashboard"
            filled
            lazy-rules
            type="email"
          />
          <QInput
            v-model="newUser.phone"
            :label="t('forms.phone')"
            :rules="newUser.phone?.length ? [val => phoneRegex.test(val) || t('forms.required-phone')] : []"
            autocomplete="tel"
            bottom-slots
            clearable
            color="dashboard"
            filled
            for="phone"
            lazy-rules
            type="tel"
          >
            <template v-slot:hint>
              <p aria-describedby="phone">{{ t('forms.hint-phone') }}</p>
            </template>
          </QInput>
        </div>
      </div>
    </div>
    <div>
      <h2>
        <i
          aria-hidden="true"
          class="bi bi-pencil-square"
        ></i>
        {{ t('user.groups') }}
      </h2>
      <div class="dashboard-section-container">
        <div class="container">
          <FormUserGroups/>
          <div v-if="!newUser.isCas && studentGroupIsSelected">
            <hgroup>
              <h3>{{ t('forms.student-status-document') }}</h3>
              <p>{{ t('forms.student-status-document-hint') }}</p>
            </hgroup>
            <FormDocumentUpload
              :association-id="null"
              process="registration"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="canJoinAssociation">
      <h2>
        <i
          aria-hidden="true"
          class="bi bi-pencil-square"
        ></i>
        {{ t('user.associations') }}
      </h2>
      <div class="dashboard-section-container">
        <div class="container">
          <FormRegisterUserAssociations/>
        </div>
      </div>
    </div>
    <div v-if="!isStaff">
      <h2>
        <i
          aria-hidden="true"
          class="bi bi-pencil-square"
        ></i>
        {{ t('forms.gdpr-title') }}
      </h2>
      <div :class="['dashboard-section-container', 'consent-section']">
        <div class="container">
          <LayoutGDPRConsent
            :has-consent="hasConsent"
            @update-consent="hasConsent = !hasConsent"
          />
        </div>
      </div>
    </div>
    <div class="flex-row-center padding-top padding-bottom">
      <QBtn
        :label="t('forms.send')"
        class="btn-lg"
        color="dashboard"
        icon="bi-check-lg"
        type="submit"
      />
    </div>
  </QForm>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms';
@import '@/assets/styles/dashboard';
@import '@/assets/variables';
</style>
