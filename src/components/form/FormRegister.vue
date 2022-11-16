<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'
import type { Association, AssociationList } from '#/association'
import type { UserRegister, UserAssociations, UserGroup, GroupList } from '#/user'
import _axios from '@/plugins/axios'
import { useUserStore } from '@/stores/useUserStore'
import router from '@/router'
import { userLocalRegister, userCASRegister, userAssociationsRegister } from '@/services/userService'

const { t } = useI18n()
const route = useRoute()
const { notify } = useQuasar()

// Setting newUser data
const newUser = ref<UserRegister>({
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: ''
})

// Checking if newUser is CAS
const isCAS = ref<boolean>(false)

// Load user infos from CAS
onMounted(async () => {
  try {
    if (route.query.ticket) {
      const userStore = useUserStore()
      await userStore.loadCASUser(route.query.ticket as string)
      // TODO refactoring !!
      newUser.value.username = userStore.newUser?.username
      newUser.value.first_name = userStore.newUser?.first_name
      newUser.value.last_name = userStore.newUser?.last_name
      newUser.value.email = userStore.newUser?.email
      emailVerification.value = userStore.newUser?.email
      isCAS.value = true
    }
  } catch (e) {
    notify({
      type: 'negative',
      message: t('notifications.negative.cas-authentication-error')
    })
    await router.push({ name: 'Login' })
  }
})

// Setup newUser's groups
const newUserGroups = ref<number[]>([6])

// Loading group list
const groups = ref<GroupList>([])
async function loadGroups() {
  try {
    const response = (await _axios.get<UserGroup[]>('/users/groups/')).data
    response.forEach(function (group) {
      if (group.name !== 'Administrateur') {
        groups.value.push({
          value: group.id,
          label: group.name
        })
      }
    })
  } catch (e) {
    notify({
      type: 'negative',
      message: t('notifications.negative.form-error')
    })
  }
}
onMounted(loadGroups)

// Setup newUser's associations
const newUserAssociations = ref<UserAssociations>([])

// Loading association list
const associations = ref<AssociationList>([])
async function loadAssociations() {
  try {
    associations.value = (await _axios.get<Association[]>('/associations/')).data
        .map(association => ({
          value: association.id,
          label: association.name
        }))
  } catch (e) {
    notify({
      type: 'negative',
      message: t('notifications.negative.form-error')
    })
  }
}
onMounted(loadAssociations)

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

// Verify Email
const emailVerification = ref<string | undefined>('')

// Register newUser
async function register() {
  try {
    // if newUser isCAS
    if (isCAS.value) {
      // patch new infos
      await userCASRegister(newUser.value.phone)
      // if newUser associations
      if (newUserAssociations.value) {
        await userAssociationsRegister(newUser.value.username, newUserAssociations.value)
      }
      // clear localStorage
      localStorage.clear()
      // notify registration was successful
      await router.push({ name: 'RegistrationSuccessful' })
    }
    // if newUser !isCAS
    else {
      // verify email
      if (newUser.value.email === emailVerification.value) {
        // post infos
        await userLocalRegister(newUser.value)
        // if newUser associations
        if (newUserAssociations.value) {
          await userAssociationsRegister(newUser.value.email, newUserAssociations.value)
        }
        // notify registration was successful
        await router.push({ name: 'RegistrationSuccessful' })
      }
      // notify if email is not verified
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
        :disable="!!isCAS"
        v-model="newUser.first_name"
        :label="$t('forms.first-name')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('forms.required-first-name')]"
    />

    <q-input
        filled
        :disable="!!isCAS"
        v-model="newUser.last_name"
        :label="$t('forms.last-name')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('forms.required-last-name')]"
    />

    <q-input
        filled
        :disable="!!isCAS"
        v-model="newUser.email"
        :label="$t('forms.email')"
        lazy-rules
        :rules="[ (val, rules) => rules.email(val) || $t('forms.required-email')]"
    />

    <q-input
        filled
        :disable="!!isCAS"
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
        :options="groups"
        color="primary"
        type="checkbox"
    />

    <q-separator />

    <div class="add-association-info">{{ $t("forms.im-from-association") }}
      <span>{{ $t("forms.im-in-association") }}</span>
    </div>

    <div v-for="(association, index) in newUserAssociations" :key="index">
      <q-select filled v-model="association.id" :options="associations" map-options emit-value :label="$t('forms.select-association')" />
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
