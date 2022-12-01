<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRoute} from 'vue-router'
import {QInput, useQuasar} from 'quasar'
import axios from 'axios'
import {useAssociationStore} from "@/stores/useAssociationStore";
import type {UserAssociations, UserRegister} from '#/user'
import {useUserStore} from '@/stores/useUserStore'
import router from '@/router'
import {userAssociationsRegister, userCASRegister, userGroupsRegister, userLocalRegister} from '@/services/userService'
import LayoutGDPRConsent from '@/components/layout/LayoutGDPRConsent.vue'

const {t} = useI18n()
const route = useRoute()
const {notify} = useQuasar()
const userStore = useUserStore()
const associationStore = useAssociationStore()

// Setting newUser data
const newUser = ref<UserRegister>({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})
// Verify Email
const emailVerification = ref<string | undefined>('')
// Setup newUser's associations
const newUserAssociations = ref<UserAssociations>([])
// Setup newUser's groups
const newUserGroups = ref<number[]>([])
// isValid if min 1 choice and max 2 choices
const groupChoiceIsValid = computed(() => {
  return newUserGroups.value.length > 0 && newUserGroups.value.length <= 2
})
const hasConsent = ref<boolean>(false)

onMounted(loadCASUser)
onMounted(loadAssociations)
onMounted(loadGroups)

// Load user infos from CAS
async function loadCASUser() {
  // For aborted CAS user registration
  // We use newUser data that persist with getUser()
  if (userStore.newUser && userStore.isCas) {
    newUser.value = userStore.newUser
    emailVerification.value = newUser.value.email
  }
      // For regular CAS user registration
  // We use a ticket from CAS
  else if (route.query.ticket) {
    try {
      await userStore.loadCASUser(route.query.ticket as string)
      newUser.value = userStore.newUser
      emailVerification.value = newUser.value.email
    } catch (error) {
      await router.push({name: 'Login'})
      notify({
        type: 'negative',
        message: t('notifications.negative.cas-authentication-error')
      })
    }
  }
}

// Load group list
async function loadGroups() {
  try {
    await userStore.getGroups()
    if (userStore.studentGroup) {
      newUserGroups.value.push(userStore.studentGroup.id)
    }
  } catch (e) {
    notify({
      type: 'negative',
      message: t('notifications.negative.form-error')
    })
  }
}

// Load association list
async function loadAssociations() {
  try {
    await associationStore.getAssociations()
  } catch (e) {
    notify({
      type: 'negative',
      message: t('notifications.negative.form-error')
    })
  }
}

// Add or remove new multiple associations
function addAssociation() {
  newUserAssociations.value.push({
    id: null,
    hasOfficeStatus: false
  })
}

function removeAssociation(index: number) {
  newUserAssociations.value.splice(index, 1)
}

// Register newUser
async function register() {
  // Must choose 1 or 2 groups
  if (groupChoiceIsValid.value) {
    // Must consent to our privacy policy
    if (hasConsent.value) {
      try {
        // For CAS users
        if (userStore.isCas) {
          if (newUser.value.phone) {
            await userCASRegister(newUser.value.phone)
          }
          if (newUserAssociations.value) {
            await userAssociationsRegister(newUser.value.username, newUserAssociations.value)
          }
          await userGroupsRegister(newUser.value.username, newUserGroups.value)
          // We must clear newUser to avoid persistence of session
          await userStore.unLoadNewUser()
          await router.push({name: 'RegistrationSuccessful'})
        }
        // For local users
        else {
          await userLocalRegister(newUser.value)
          if (newUserAssociations.value) {
            await userAssociationsRegister(newUser.value.email, newUserAssociations.value)
          }
          await userGroupsRegister(newUser.value.email, newUserGroups.value)
          await router.push({name: 'RegistrationSuccessful'})
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const data = error.response?.data
          if (data.email) {
            notify({
              type: 'negative',
              message: t('notifications.negative.email-used')
            })
            await router.push({name: 'Login'})
          } else {
            notify({
              type: 'negative',
              message: t('notifications.negative.invalid-request')
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
  }
}
</script>

<template>
  <QForm
      class="q-gutter-md"
      @submit="register"
  >
    <QInput
        v-model="newUser.firstName"
        :disable="!!userStore.isCas"
        :label="$t('forms.first-name')"
        :rules="[ val => val && val.length > 0 || $t('forms.required-first-name')]"
        filled
        lazy-rules
    />
    <QInput
        v-model="newUser.lastName"
        :disable="!!userStore.isCas"
        :label="$t('forms.last-name')"
        :rules="[ val => val && val.length > 0 || $t('forms.required-last-name')]"
        filled
        lazy-rules
    />
    <QInput
        v-model="newUser.email"
        :disable="!!userStore.isCas"
        :label="$t('forms.email')"
        :rules="[ (val, rules) => rules.email(val) || $t('forms.required-email')]"
        filled
        lazy-rules
    />
    <QInput
        v-model="emailVerification"
        :disable="!!userStore.isCas"
        :label="$t('forms.repeat-email')"
        :rules="[ (val, rules) => rules.email(val) && val === newUser.email || $t('forms.required-repeat-email')]"
        filled
        lazy-rules
    />
    <QInput
        v-model="newUser.phone"
        :label="$t('forms.phone')"
        filled
        hint="Format : 06 00 00 00 00"
        lazy-rules
        mask="## ## ## ## ##"
    />
    <fieldset>
      <legend class="legend-big">{{ $t('forms.status') }}</legend>
      <QField
          :error="!groupChoiceIsValid"
          :error-message="$t('forms.required-status')"
          :hint="$t('forms.status-hint')"
      >
        <QOptionGroup
            v-model="newUserGroups"
            :options="userStore.groupList"
            color="primary"
            type="checkbox"
        />
      </QField>
    </fieldset>
    <QSeparator/>
    <fieldset>
      <legend class="legend-big">{{ $t("forms.im-from-association") }}</legend>
      <fieldset>
        <legend>{{ $t("forms.im-in-association") }}</legend>
        <div v-for="(association, index) in newUserAssociations" :key="index">
          <QSelect
              v-model="association.id"
              :label="$t('forms.select-association')"
              :options="associationStore.associationList"
              emit-value
              filled
              map-options
          />
          <QCheckbox
              v-model="association.hasOfficeStatus"
              :label="$t('forms.im-in-association-office')"
          />
          <QBtn
              :label="$t('forms.delete-association')"
              color="red" icon="mdi-minus-circle-outline"
              outline
              @click="removeAssociation(index)"
          />
          <QSeparator/>
        </div>
        <QBtn
            v-if="newUserAssociations.length < 5"
            :label="$t('forms.add-association')"
            class="add-association"
            color="primary" icon="mdi-plus-circle-outline"
            outline
            @click="addAssociation"
        />
      </fieldset>
    </fieldset>
    <QSeparator/>
    <LayoutGDPRConsent :has-consent="hasConsent" @update-consent="hasConsent = !hasConsent"/>
    <QBtn :label="$t('forms.send')" color="primary" type="submit"/>
  </QForm>
</template>

<style lang="sass" scoped>
.legend-big
  font-size: 1.5em

.q-separator
  margin: 10px 0

fieldset + .q-separator
  margin-left: 15px

.q-btn
  margin: 15px 0
  display: block

.add-association
  margin: 15px 0 0 0

.q-btn[type="submit"]
  margin: 0 0 5px 15px

fieldset
  border: none
</style>
