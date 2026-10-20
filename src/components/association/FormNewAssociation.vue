<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {QForm, useQuasar} from 'quasar'
import {onMounted, reactive, ref, watch} from 'vue'
import axios from 'axios'
import {useAssociation} from '@/composables/useAssociation'
import {useProfileStore} from '@/stores/useProfileStore'
import type {CreateAssociation} from '#/association'
import useSecurity from '@/composables/useAuthentication'
import useErrors from '@/composables/useError'
import useUser from '@/composables/useUser'
import {useInstitutionStore} from '@/stores/useInstitutionStore'

const {t} = useI18n()
const {notify} = useQuasar()
const {createAssociation} = useAssociation()
const institutionStore = useInstitutionStore()
const profileStore = useProfileStore()
const {hasPerm} = useSecurity()
const {catchHTTPError} = useErrors()
const {userInstitutions} = useUser()


const newAssociation = reactive<CreateAssociation>({
  name: '',
  acronym: '',
  email: '',
  institution: undefined,
  isPublic: false,
  isSite: false
})

const institutions = ref<({ value: number, label: string } | undefined)[]>([])
const newAssociationForm = ref(QForm)

const initValues = () => {
  institutions.value = []
  const userInstitutionList = userInstitutions(profileStore.user)
  if (userInstitutionList.length) {
    institutionStore.institutions.forEach(function (institution) {
      if (userInstitutionList.includes(institution.id)) {
        institutions.value.push(
          {
            value: institution.id,
            label: `${institution.acronym} (${institution.name})`
          }
        )
      }
    })
  }
}
watch(() => institutionStore.institutions, initValues)
watch(() => userInstitutions(profileStore.user), initValues)

onMounted(async () => {
  await institutionStore.getInstitutions()
  initValues()
})

async function onCreate() {
  try {
    await createAssociation(newAssociation)
    notify({
      type: 'positive',
      message: t('notifications.positive.validate-association')
    })
    if (newAssociationForm.value) {
      newAssociationForm.value.reset()
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.data.error === 'Association name already taken.') {
        notify({
          type: 'negative',
          message: t('notifications.negative.association-already-exists')
        })
      } else {
        notify({
          type: 'negative',
          message: await catchHTTPError(error.response)
        })
      }
    }
  }
}

const clearValues = () => {
  newAssociation.name = ''
  newAssociation.acronym = ''
  newAssociation.email = ''
  newAssociation.institution = undefined
  newAssociation.isPublic = false
  newAssociation.isSite = false
}

</script>

<template>
  <QForm
    ref="newAssociationForm"
    class="q-gutter-md"
    @reset="clearValues"
    @submit.prevent="onCreate"
  >
    <QInput
      v-model="newAssociation.name"
      :label="t('forms.association-name')"
      :rules="[val => val.length > 0 || t('forms.required-association-name')]"
      color="dashboard"
      filled
      lazy-rules
    />
    <QInput
      v-model="newAssociation.acronym"
      :label="t('forms.association-acronym')"
      :rules="[val => val.length > 0 || t('forms.required-association-acronym')]"
      color="dashboard"
      filled
      lazy-rules
    />
    <QInput
      v-model="newAssociation.email"
      :label="t('association.labels.mail')"
      :rules="[(val, rules) => rules.email(val) || t('forms.required-email')]"
      clearable
      color="dashboard"
      filled
      lazy-rules
      type="email"
    />
    <QSelect
      v-model="newAssociation.institution"
      :label="t('forms.association-institution')"
      :options="institutions"
      :rules="[val => val !== undefined || t('forms.select-establishment')]"
      color="dashboard"
      emit-value
      filled
      lazy-rules
      map-options
    />
    <QCheckbox
      v-if="hasPerm('add_association_all_fields')"
      v-model="newAssociation.isPublic"
      :label="t('forms.association-is-public')"
      color="dashboard"
    />
    <QCheckbox
      v-if="hasPerm('add_association_all_fields')"
      v-model="newAssociation.isSite"
      :label="t('forms.association-is-site')"
      color="dashboard"
    />
    <div class="flex-row-center">
      <QBtn
        :label="t('back')"
        :to="{ name: 'Dashboard' }"
        class="btn-lg"
        color="dashboard"
        icon="bi-chevron-left"
      />
      <QBtn
        :label="t('user-manager.create-association')"
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
</style>
