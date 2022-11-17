<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { useAssociationStore } from "@/stores/useAssociationStore";
import type { UserRegister, UserAssociations } from '#/user'
import { useUserStore } from '@/stores/useUserStore'
import router from '@/router'
import { userLocalRegister, userCASRegister, userAssociationsRegister, userGroupsRegister } from '@/services/userService'

const { t } = useI18n()
const route = useRoute()
const { notify } = useQuasar()
const userStore = useUserStore()
const associationStore = useAssociationStore()

// Setting newUser data
const newUser = ref<UserRegister>({
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: ''
})
// Verify Email
const emailVerification = ref<string | undefined>('')
// Setup newUser's associations
const newUserAssociations = ref<UserAssociations>([])
// Setup newUser's groups
const newUserGroups = ref<number[]>([5])

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
    has_office_status: false
  })
}
function removeAssociation(index: number) {
  newUserAssociations.value.splice(index, 1)
}

// Register newUser
async function register() {
  try {
    if (userStore.isCAS) {
      if (newUser.value.phone) {
        await userCASRegister(newUser.value.phone)
      }
      if (newUserAssociations.value) {
        await userAssociationsRegister(newUser.value.username, newUserAssociations.value)
      }
      localStorage.clear()
      await router.push({ name: 'RegistrationSuccessful' })
    }
    else {
      if (newUser.value.email === emailVerification.value) {
        await userLocalRegister(newUser.value)
        if (newUserAssociations.value) {
          await userAssociationsRegister(newUser.value.email, newUserAssociations.value)
        }
        await userGroupsRegister(newUser.value.email, newUserGroups.value)
        await router.push({ name: 'RegistrationSuccessful' })
      }
      else {
        notify({
          type: 'negative',
          message: t('notifications.negative.different-emails')
        })
        return
      }
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
</script>

<template>
  <q-form
      @submit="register"
      class="q-gutter-md"
  >

    <q-input
        filled
        :disable="!!userStore.isCAS"
        v-model="newUser.first_name"
        :label="$t('forms.first-name')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('forms.required-first-name')]"
    />

    <q-input
        filled
        :disable="!!userStore.isCAS"
        v-model="newUser.last_name"
        :label="$t('forms.last-name')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('forms.required-last-name')]"
    />

    <q-input
        filled
        :disable="!!userStore.isCAS"
        v-model="newUser.email"
        :label="$t('forms.email')"
        lazy-rules
        :rules="[ (val, rules) => rules.email(val) || $t('forms.required-email')]"
    />

    <q-input
        filled
        :disable="!!userStore.isCAS"
        v-model="emailVerification"
        :label="$t('forms.repeat-email')"
        lazy-rules
        :rules="[ (val, rules) => rules.email(val) || $t('forms.required-repeat-email')]"
    />

    <q-input
        filled
        v-model="newUser.phone"
        :label="$t('forms.phone')"
        mask="## ## ## ## ##"
        hint="Format : 06 00 00 00 00"
        lazy-rules
    />

    <q-option-group
        v-model="newUserGroups"
        :options="userStore.groupList"
        color="primary"
        type="checkbox"
    />

    <q-separator />

    <div class="add-association-info">{{ $t("forms.im-from-association") }}
      <span>{{ $t("forms.im-in-association") }}</span>
    </div>

    <div v-for="(association, index) in newUserAssociations" :key="index">
      <q-select filled v-model="association.id" :options="associationStore.associationList" map-options emit-value :label="$t('forms.select-association')" />
      <q-checkbox v-model="association.has_office_status" :label="$t('forms.im-in-association-office')" />
      <div>
        <q-btn @click="removeAssociation(index)" outline color="red" icon="mdi-minus-circle-outline" :label="$t('forms.delete-association')" />
      </div>
      <q-separator />
    </div>
    <div>
      <q-btn v-if="newUserAssociations.length < 5" @click="addAssociation" outline color="primary" icon="mdi-plus-circle-outline" :label="$t('forms.add-association')" />
    </div>

    <div>
      <q-btn :label="$t('forms.send')" type="submit" color="primary"/>
    </div>

  </q-form>
</template>

<style scoped lang="sass">
.add-association-info
  font-size: 1.5em
  span
    font-size: 0.7em
    display: block

.q-separator
  margin: 10px 0 10px 0

.q-input + .q-separator
  margin-left: 15px

.q-btn
  margin: 10px 0 10px 0

.tooltip-btn
  margin-left: 5px
</style>
