<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import {QInput, useQuasar} from 'quasar'
import axios from 'axios'
import { useAssociationStore } from "@/stores/useAssociationStore";
import type { UserRegister, UserAssociations } from '#/user'
import { useUserStore } from '@/stores/useUserStore'
import router from '@/router'
import { userLocalRegister, userCASRegister, userAssociationsRegister, userGroupsRegister } from '@/services/userService'
import LayoutGDPRConsent from '@/components/layout/LayoutGDPRConsent.vue'

const { t } = useI18n()
const route = useRoute()
const { notify } = useQuasar()
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
  try {
    if (route.query.ticket) {
      const userStore = useUserStore()
      await userStore.loadCASUser(route.query.ticket as string)
      newUser.value = userStore.newUser
      emailVerification.value = newUser.value.email
      // isCAS.value = true
    }
  } catch (e) {
    notify({
      type: 'negative',
      message: t('notifications.negative.cas-authentication-error')
    })
    await router.push({ name: 'Login' })
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
  if (groupChoiceIsValid.value) {
    if (hasConsent.value) {
      try {
        if (userStore.isCAS) {
          if (newUser.value.phone) {
            await userCASRegister(newUser.value.phone)
          }
          if (newUserAssociations.value) {
            await userAssociationsRegister(newUser.value.username, newUserAssociations.value)
          }
          await userGroupsRegister(newUser.value.username, newUserGroups.value)
          // TODO refactor
          localStorage.clear()
          await router.push({ name: 'RegistrationSuccessful' })
        }
        else {
          await userLocalRegister(newUser.value)
          if (newUserAssociations.value) {
            await userAssociationsRegister(newUser.value.email, newUserAssociations.value)
          }
          await userGroupsRegister(newUser.value.email, newUserGroups.value)
          await router.push({ name: 'RegistrationSuccessful' })
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const data = error.response?.data
          if (data.email) {
            notify({
              type: 'negative',
              message: t('notifications.negative.email-used')
            })
            await router.push({ name: 'Login' })
          }
          else {
            notify({
              type: 'negative',
              message: t('notifications.negative.invalid-request')
            })
          }
        }
      }
    }
    else {
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
    @submit="register"
    class="q-gutter-md"
  >
    <QInput
      filled
      :disable="!!userStore.isCAS"
      v-model="newUser.firstName"
      :label="$t('forms.first-name')"
      lazy-rules
      :rules="[ val => val && val.length > 0 || $t('forms.required-first-name')]"
    />
    <QInput
      filled
      :disable="!!userStore.isCAS"
      v-model="newUser.lastName"
      :label="$t('forms.last-name')"
      lazy-rules
      :rules="[ val => val && val.length > 0 || $t('forms.required-last-name')]"
    />
    <QInput
      filled
      :disable="!!userStore.isCAS"
      v-model="newUser.email"
      :label="$t('forms.email')"
      lazy-rules
      :rules="[ (val, rules) => rules.email(val) || $t('forms.required-email')]"
    />
    <QInput
      filled
      :disable="!!userStore.isCAS"
      v-model="emailVerification"
      :label="$t('forms.repeat-email')"
      lazy-rules
      :rules="[ (val, rules) => rules.email(val) && val === newUser.email || $t('forms.required-repeat-email')]"
    />
    <QInput
      filled
      v-model="newUser.phone"
      :label="$t('forms.phone')"
      mask="## ## ## ## ##"
      hint="Format : 06 00 00 00 00"
      lazy-rules
    />
    <fieldset>
      <legend class="legend-big">{{ $t('forms.status') }}</legend>
      <QField
        :hint="$t('forms.status-hint')"
        :error="!groupChoiceIsValid"
        :error-message="$t('forms.required-status')"
      >
        <QOptionGroup
          v-model="newUserGroups"
          :options="userStore.groupList"
          color="primary"
          type="checkbox"
        />
      </QField>
    </fieldset>
    <QSeparator />
    <fieldset>
      <legend class="legend-big">{{ $t("forms.im-from-association") }}</legend>
      <fieldset>
        <legend>{{ $t("forms.im-in-association") }}</legend>
        <div v-for="(association, index) in newUserAssociations" :key="index">
          <QSelect filled v-model="association.id" :options="associationStore.associationList" map-options emit-value :label="$t('forms.select-association')" />
          <QCheckbox v-model="association.hasOfficeStatus" :label="$t('forms.im-in-association-office')" />
          <QBtn @click="removeAssociation(index)" outline color="red" icon="mdi-minus-circle-outline" :label="$t('forms.delete-association')" />
          <QSeparator />
        </div>
        <QBtn class="add-association" v-if="newUserAssociations.length < 5" @click="addAssociation" outline color="primary" icon="mdi-plus-circle-outline" :label="$t('forms.add-association')" />
      </fieldset>
    </fieldset>
    <QSeparator />
    <LayoutGDPRConsent :has-consent="hasConsent" @update-consent="hasConsent = !hasConsent" />
    <QBtn :label="$t('forms.send')" type="submit" color="primary"/>
  </QForm>
</template>

<style scoped lang="sass">
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
