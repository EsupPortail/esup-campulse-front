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
/*const studentGroup = function () {
  return userStore.groupList.find(({label}) => label === 'Étudiant')
}*/
const newUserGroups = ref<number[]>()

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
      newUserGroups.value = [userStore.studentGroup.id]
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
        :rules="[ (val, rules) => rules.email(val) || $t('forms.required-repeat-email')]"
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
      <QOptionGroup
          v-model="newUserGroups"
          :options="userStore.groupList"
          color="primary"
          type="checkbox"
      />
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
        <QBtn v-if="newUserAssociations.length < 5" @click="addAssociation" outline color="primary" icon="mdi-plus-circle-outline" :label="$t('forms.add-association')" />
      </fieldset>
    </fieldset>
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

.q-btn[type="submit"]
  margin: 0 0 5px 15px

fieldset
  border: none
</style>
