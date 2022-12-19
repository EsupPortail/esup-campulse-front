<script lang="ts" setup>
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {computed, onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import useUsers from '@/composables/useUsers'
import {useRoute} from 'vue-router'
import useUserGroups from '@/composables/useUserGroups'
import router from '@/router'
import type {User} from '#/user'
import FormConfirmDelete from "@/components/form/FormConfirmDelete.vue";

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {getUser, validateUser} = useUsers()
const {getGroups, groupList} = useUserGroups()

const userManagerStore = useUserManagerStore()
const route = useRoute()

// Watch function observes and updates only if data had been changed
const user = ref<User | undefined>(userManagerStore.user)
watch(() => userManagerStore.user, () => {
  user.value = userManagerStore.user
})

// Watch function observes and updates only if data had been changed
const userGroups = ref<number[]>(userManagerStore.userGroups)
watch(() => userManagerStore.userGroups, () => {
  userGroups.value = userManagerStore.userGroups
})

// Check if the user has enough roles or not
const groupChoiceIsValid = computed<boolean>(() => {
  return userGroups.value.length > 0 && userGroups.value.length <= 2
})

// Boolean select options
const booleanSelectOptions = [
  {
    label: t('yes'),
    value: true
  },
  {
    label: t('no'),
    value: false
  }
]

onMounted(async () => {
  loading.show
  await onGetUser()
  await onLoadGroups()
  await onGetUserAssociations()
  loading.hide
})

// Load group list
async function onLoadGroups() {
  try {
    await getGroups()
  } catch (e) {
    notify({
      type: 'negative',
      message: t('notifications.negative.form-error')
    })
  }
}

// Load user
async function onGetUser() {
  try {
    await getUser(route.params.id as string)
  } catch (e) {
    notify({
      type: 'negative',
      message: t('notifications.negative.form-error')
    })
  }
}

// Load userAssociations
async function onGetUserAssociations() {
  try {
    await userManagerStore.getUserAssociations()
  } catch (e) {
    notify({
      type: 'negative',
      message: t('notifications.negative.form-error')
    })
  }
}

// Function that verify if the user is validated by the admin or not, and send the response to the back
async function onValidateUser() {
  if (groupChoiceIsValid.value) {
    try {
      await validateUser(userGroups.value)
      await router.push({name: 'ValidateUsers'})
      notify({
        type: 'positive',
        message: t('notifications.positive.validate-success')
      })
    } catch (e) {
      notify({
        type: 'negative',
        message: t('notifications.negative.unknown-user')
      })
    }
  }
}
</script>

<template>
  <h1>{{ t('user-manager.manage-account') }}</h1>
  <QForm
      v-if="user"
      class="q-gutter-md"
      @submit="register"
  >
    <fieldset>
      <legend>{{ t('user.infos') }}</legend>
      <QInput
          v-model="user.firstName"
          :disable="!!user.isCas"
          :label="$t('forms.first-name')"
          :rules="[ val => val && val.length > 0 || $t('forms.required-first-name')]"
          filled
          lazy-rules
      />
      <QInput
          v-model="user.lastName"
          :disable="!!user.isCas"
          :label="$t('forms.last-name')"
          :rules="[ val => val && val.length > 0 || $t('forms.required-last-name')]"
          filled
          lazy-rules
      />
      <QInput
          v-model="user.email"
          :disable="!!user.isCas"
          :label="$t('forms.email')"
          :rules="[ (val, rules) => rules.email(val) || $t('forms.required-email')]"
          filled
          lazy-rules
      />
      <QInput
          v-model="user.phone"
          :label="$t('forms.phone')"
          filled
          hint="Format : 06 00 00 00 00"
          lazy-rules
          mask="## ## ## ## ##"
      />
    </fieldset>
    <fieldset class="association-cards">
      <QCard
          v-for="(association, index) in userManagerStore.userAssociations"
          :key="index"
          class="association-card"
      >
        <QCardSection>
          <article>
            <h4>{{ association.association.name }}</h4>
            <QInput
                v-model="association.roleName"
                :label="Rôle"
                :rules="[ val => val && val.length > 0 || $t('forms.required-last-name')]"
                filled
                lazy-rules
            />
            <QSelect
                v-model="association.hasOfficeStatus"
                :options="booleanSelectOptions"
                emit-value
                filled
                label="Est membre du bureau"
                map-options
            />
            <QSelect
                v-model="association.isPresident"
                :options="booleanSelectOptions"
                emit-value
                filled
                label="Est président"
                map-options
            />
            <QBtn
                color="red"
                icon="mdi-delete"
                label="Supprimer le rôle dans l'association"
            />
          </article>
        </QCardSection>
      </QCard>
    </fieldset>
    <fieldset>
      <legend>{{ t('user.groups') }}</legend>
      <section>
        <article>
          <h3>{{ t('user.isCas') }}</h3>
          <p>{{ user.isCas ? t('yes') : t('no') }}</p>
        </article>
        <article>
          <h3>{{ t("user.isValidatedByAdmin") }}</h3>
          <p>{{ user.isValidatedByAdmin ? t('yes') : t('no') }}</p>
        </article>
      </section>
    </fieldset>
    <fieldset>
      <QField v-if="groupList"
              :error="!groupChoiceIsValid"
              :error-message="t('user-manager.forms.required-status')"
              :hint="t('user-manager.forms.status-hint')"
      >
        <QOptionGroup
            v-model="userGroups"
            :options="groupList"
            color="primary"
            type="checkbox"
        />
      </QField>
    </fieldset>
  </QForm>
  <section class="btn-group">
    <QBtn :label="t('back')" color="secondary" icon="mdi-arrow-left-circle" to="/dashboard/manage-users"/>
    <QBtn :label="t('dashboard.validate-changes')" color="primary" icon="mdi-check-circle" @click="onValidateUser"/>
    <FormConfirmDelete></FormConfirmDelete>
  </section>
</template>

<style lang="sass" scoped>
section
  article > *
    margin: 0
    width: 50%

  article
    display: flex
    align-items: center
    background-color: lightgrey
    padding: 0 20px 0 20px
    margin: 5px 0

    h3
      font-size: 1.2em
      text-transform: uppercase

legend
  background-color: $primary
  color: #fff
  font-size: 2em
  text-align: center
  width: 100%
  margin-bottom: 10px

.btn-group
  display: flex
  gap: 20px
  margin: 30px 0 30px 0

fieldset
  border: none

h4
  font-size: 1.5em
  padding: 0
  line-height: 0

.q-select
  margin-bottom: 20px

.association-cards
  display: flex
  flex-direction: column
  gap: 20px
</style>