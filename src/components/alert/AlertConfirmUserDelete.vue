<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/stores/useUserStore'
import {useQuasar} from 'quasar'
import axios from 'axios'
import router from '@/router'
import useErrors from '@/composables/useError'

const {t} = useI18n()
const confirm = ref<boolean>(false)
const userStore = useUserStore()
const {notify} = useQuasar()
const {catchHTTPError} = useErrors()

const emit = defineEmits(['hasValidated'])

async function onDeleteUser() {
  try {
    await userStore.deleteUser()
    emit('hasValidated')
    await router.push({name: 'ManageUsers'})
    notify({
      type: 'positive',
      message: t('notifications.positive.validate-delete-user')
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
</script>

<template>
  <QBtn
    :label="t('user-manager.delete-user')"
    class="btn-lg"
    color="custom-red"
    icon="bi-trash"
    @click="confirm = true"
  />

  <QDialog
    v-model="confirm"
    persistent
  >
    <QCard>
      <QCardSection class="row items-center">
        <p>{{ t('user-manager.confirm-delete') }}</p>
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
            :label="t('user-manager.delete-user')"
            class="btn-lg"
            color="custom-red"
            icon="bi-trash"
            @click="onDeleteUser"
          />
        </div>
      </QCardSection>
    </QCard>
  </QDialog>
</template>
