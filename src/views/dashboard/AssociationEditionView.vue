<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import {useQuasar} from 'quasar'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {onBeforeRouteLeave, useRoute} from 'vue-router'
import FormAssociationEdition from '@/components/association/FormAssociationEdition.vue'
import useErrors from '@/composables/useError'
import axios from 'axios'
import useUtil from '@/composables/useUtil'
import {useProfileStore} from '@/stores/useProfileStore'
import router from '@/router'
import useUserGroups from '@/composables/useUserGroup'
import {useInstitutionStore} from '@/stores/useInstitutionStore'
import AlertConfirmAssociationDeletion from '@/components/association/AlertConfirmAssociationDeletion.vue'
import AlertLeaveEdition from '@/components/alert/AlertLeaveEdition.vue'
import {useI18n} from 'vue-i18n'
import ConfirmModal from '@/components/global/ConfirmModal.vue'
import {useAssociation} from '@/composables/useAssociation'
import type {AssociationEditionAction} from '#/association'

const {notify, loading} = useQuasar()

const route = useRoute()
const associationStore = useAssociationStore()
const institutionStore = useInstitutionStore()
const {catchHTTPError} = useErrors()
const {dynamicTitle} = useUtil()
const profileStore = useProfileStore()
const {isStaff} = useUserGroups()
const {t} = useI18n()
const {checkChanges} = useAssociation()

const isLoaded = ref(false)

const isEnabled = computed<boolean>(() => {
  return associationStore.association?.isEnabled ?? false
})

const isPublic = computed(() => {
  return associationStore.association?.isPublic ?? false
})

const isSite = computed(() => {
  return associationStore.association?.isSite ?? false
})

const canSubmitProjects = computed(() => {
  return associationStore.association?.canSubmitProjects ?? false
})

const isAuthorized = () => {
  if (isStaff) return true
  else return profileStore.hasPresidentStatus(Number.parseInt(route.params.id as string))
}

async function onGetData() {
  try {
    await associationStore.getAssociationDetail(Number.parseInt(route.params.id as string), false)
    await institutionStore.getInstitutions()
    await institutionStore.getInstitutionComponents()
    await associationStore.getAssociationActivityFields()
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
}

onMounted(async function () {
  loading.show()
  if (isAuthorized()) {
    await onGetData()
    dynamicTitle.value = associationStore.association?.name
    isLoaded.value = true
  } else {
    await router.push({name: '404'})
  }
  loading.hide()
})

const openAlert = ref<boolean>(false)
const leaveEdition = ref<boolean>(false)
const hasValidated = ref<boolean>(false)

const hasChanges = computed(() => {
  return !!Object.keys(checkChanges()).length
})

async function onUpdateAssociation() {
  loading.show()
  try {
    const payload = checkChanges()
    await associationStore.updateAssociation(payload)
    notify({
      type: 'positive',
      message: t('notifications.positive.association-successfully-updated')
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

export interface ToggleAssociationStatus {
  field: 'isEnabled' | 'isPublic' | 'isSite' | 'canSubmitProjects';
  messages: {
    enable: string;
    disable: string;
  }
}

async function toggleAssociationStatus(params: ToggleAssociationStatus) {
  const currentValue = associationStore.association![params.field]
  const positiveMessage = currentValue ? params.messages.disable : params.messages.enable
  try {
    const payload = {}
    payload[params.field] = !currentValue
    await associationStore.updateAssociation(payload)
    notify({
      type: 'positive',
      message: positiveMessage
    })
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
}

const onEnableAssociation = () =>
  toggleAssociationStatus({
    field: 'isEnabled',
    messages: {
      enable: t('notifications.positive.enable-association'),
      disable: t('notifications.positive.disable-association')
    }
  })

const onPublishAssociation = () =>
  toggleAssociationStatus({
    field: 'isPublic',
    messages: {
      enable: t('notifications.positive.publish-association'),
      disable: t('notifications.positive.unpublish-association')
    },
  })

const onSiteAssociation = () =>
  toggleAssociationStatus({
    field: 'isSite',
    messages: {
      enable: t('notifications.positive.site-association'),
      disable: t('notifications.positive.unsite-association')
    },
  })

const onSubmitProjectAssociation = () =>
  toggleAssociationStatus({
    field: 'canSubmitProjects',
    messages: {
      enable: t('notifications.positive.association-can-submit-projects'),
      disable: t('notifications.positive.association-cannot-submit-projects')
    },
  })

const editionActions = ref<AssociationEditionAction[]>([
  {
    button: {
      visible: hasChanges.value,
      color: 'association',
      icon: 'bi-check-lg',
      label: t('association.validate-all-changes'),
    },
    modal: {
      open: false,
      message: t('association.alert-confirm-changes'),
      callback: onUpdateAssociation,
    },
  },
  {
    button: {
      visible: isStaff.value,
      color: isEnabled.value ? 'custom-red' : 'association',
      icon: 'bi-check-lg',
      label: isEnabled.value ? t('association.disable-association') : t('association.enable-association'),
    },
    modal: {
      open: false,
      message: t('association.alert-confirm-changes'),
      validateButtonColor: isEnabled.value ? 'custom-red' : 'association',
      validateButtonIcon: isEnabled.value ? 'bi-ban' : 'bi-check-lg',
      validateButtonLabel: isEnabled.value ? t('association.disable-association') : t('association.enable-association'),
      callback: onEnableAssociation,
    },
  },
  {
    button: {
      visible: isStaff.value && isEnabled.value,
      color: isPublic.value ? 'custom-red' : 'association',
      icon: isPublic.value ? 'bi-eye-slash' : 'bi-eye',
      label: isPublic.value ? t('association.unpublish-in-directory') : t('association.publish-in-directory'),
    },
    modal: {
      open: false,
      message: isPublic.value ? t('alerts.confirm-association-unpublish') : t('alerts.confirm-association-publish'),
      validateButtonColor: isPublic.value ? 'custom-red' : 'association',
      validateButtonIcon: isPublic.value ? 'bi-eye-slash' : 'bi-eye',
      validateButtonLabel: isPublic.value ? t('association.unpublish-in-directory') : t('association.publish-in-directory'),
      callback: onPublishAssociation,
    },
  },
  {
    button: {
      visible: isStaff.value && isEnabled.value,
      color: isSite.value ? 'custom-red' : 'association',
      icon: isSite.value ? 'bi-building-slash' : 'bi-building-check',
      label: isSite.value ? t('association.unsite-in-directory') : t('association.site-in-directory'),
    },
    modal: {
      open: false,
      message: isSite.value ? t('alerts.confirm-association-unsite') : t('alerts.confirm-association-site'),
      validateButtonColor: isSite.value ? 'custom-red' : 'association',
      validateButtonIcon: isSite.value ? 'bi-building-slash' : 'bi-building-check',
      validateButtonLabel: isSite.value ? t('association.unsite-in-directory') : t('association.site-in-directory'),
      callback: onSiteAssociation,
    },
  },
  {
    button: {
      visible: isStaff.value && isEnabled.value,
      color: canSubmitProjects.value ? 'custom-red' : 'association',
      icon: canSubmitProjects.value ? 'bi-clipboard-x' : 'bi-clipboard-check',
      label: canSubmitProjects.value ? t('association.disable-project-submission') : t('association.enable-project-submission'),
    },
    modal: {
      open: false,
      message: canSubmitProjects.value ? t('alerts.confirm-association-cannot-submit-projects') : t('alerts.confirm-association-can-submit-projects'),
      validateButtonColor: canSubmitProjects.value ? 'custom-red' : 'association',
      validateButtonIcon: canSubmitProjects.value ? 'bi-clipboard-x' : 'bi-clipboard-check',
      validateButtonLabel: canSubmitProjects.value ? t('association.disable-project-submission') : t('association.enable-project-submission'),
      callback: onSubmitProjectAssociation,
    },
  },
])

function onLeaveEdition() {
  leaveEdition.value = true
  router.push(isStaff.value ? {name: 'ManageAssociations'} : {
    name: 'AssociationDashboard',
    params: {id: associationStore.association?.id}
  })
}

// Check is there are any changes before leaving the page
onBeforeRouteLeave((_to, _from, next) => {
  if (Object.keys(checkChanges()).length > 0 && !hasValidated.value) {
    openAlert.value = true
    next(leaveEdition.value)
  } else {
    next(true)
  }
})

</script>

<template>
  <FormAssociationEdition v-if="isLoaded"/>
  <div class="flex-row-center padding">
    <QBtn
      :label="isStaff ? t('association.go-back') : t('dashboard.association-user.back-to-association-dashboard')"
      :to="isStaff ? { name: 'ManageAssociations' } : { name: 'AssociationDashboard' }"
      class="btn-lg"
      color="association"
      icon="bi-chevron-left"
    />
    <div
      v-for="(action, index) in editionActions"
      :key="`edition-action-${index}`"
    >
      <QBtn
        v-if="action.button.visible"
        :icon="action.button.icon"
        :label="action.button.label"
        class="btn-lg"
        color="association"
        @click="action.modal.open = true"
      />
      <ConfirmModal
        :message="t('association.alert-confirm-changes')"
        :open-modal="action.modal.open"
        :validateButtonColor="action.modal.validateButtonColor"
        :validateButtonIcon="action.modal.validateButtonIcon"
        :validateButtonLabel="action.modal.validateButtonLabel"
        button-color="association"
        @confirm-action="action.modal.callback"
      />
    </div>
    <AlertConfirmAssociationDeletion v-if="isStaff && !isEnabled"/>
  </div>

  <AlertLeaveEdition
    :open-alert="openAlert"
    :text="t('alerts.leave-association-edition')"
    @closeAlert="openAlert = !openAlert"
    @leaveEdition="onLeaveEdition"
  />
</template>
