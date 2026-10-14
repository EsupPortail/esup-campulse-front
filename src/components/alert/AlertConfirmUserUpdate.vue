<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import axios from 'axios'
import {useUserStore} from '@/stores/useUserStore'
import useUsers from '@/composables/useUser'
import useUserGroups from '@/composables/useUserGroup'
import useUserAssociations from '@/composables/useUserAssociation'
import useSecurity from '@/composables/useAuthentication'
import useErrors from '@/composables/useError'
import useDocumentUploads from '@/composables/useDocumentUpload'
import {ref, toRefs, watch} from 'vue'


const {t} = useI18n()
const {notify, loading} = useQuasar()
const userStore = useUserStore()
const {updateUserInfos, initInfosToPatch, infosToPatch} = useUsers()
const {updateUserGroups} = useUserGroups()
const {updateUserAssociations} = useUserAssociations()
const {userAssociationsRegister} = useSecurity()
const {catchHTTPError} = useErrors()
const {uploadDocuments, initManagedUserDocumentUploads, initProcessDocuments} = useDocumentUploads()


const emit = defineEmits(['hasValidated', 'closeDialog'])

const props = defineProps<{
  confirmation: boolean
}>()


const confirm = ref<boolean>(false)
const confirmRef = toRefs(props).confirmation
watch(() => confirmRef.value, () => {
  confirm.value = confirmRef.value
})
watch(() => confirm.value, () => {
  if (!confirm.value) {
    emit('closeDialog')
  }
})

async function onValidateChanges() {
  loading.show()
  try {
    initInfosToPatch(userStore.user)
    if (Object.entries(infosToPatch).length) {
      await updateUserInfos(userStore.user, true)
    }
    updateUserAssociations(true)
    await userAssociationsRegister(userStore.user?.id)
    await updateUserGroups()
    await uploadDocuments(null, userStore.user?.id)
    initProcessDocuments()
    await userStore.getUserDocuments()
    initManagedUserDocumentUploads()

    emit('hasValidated')
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
</script>

<template>
  <QBtn
    :label="t('dashboard.validate-changes')"
    class="btn-lg"
    color="dashboard"
    icon="bi-check-lg"
    type="submit"
  />

  <QDialog
    v-model="confirm"
    persistent
  >
    <QCard>
      <QCardSection class="row items-center">
        <p>{{ t('user-manager.alert-confirm-update') }}</p>
        <div class="flex-row padding-top">
          <QBtn
            v-close-popup
            :label="t('cancel')"
            class="btn-lg"
            color="dashboard"
            icon="bi-x-lg"
          />
          <QBtn
            v-close-popup
            :label="t('dashboard.validate-changes')"
            class="btn-lg"
            color="dashboard"
            icon="bi-check-lg"
            @click="onValidateChanges"
          />
        </div>
      </QCardSection>
    </QCard>
  </QDialog>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
</style>
