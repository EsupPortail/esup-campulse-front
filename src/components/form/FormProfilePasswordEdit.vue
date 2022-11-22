<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import type { PasswordEdit } from '#/user'
import _axios from '@/plugins/axios'
import router from '@/router'

const { t } = useI18n()
const { notify } = useQuasar()

const editPassword = ref<PasswordEdit>({
  oldPassword: '',
  newPassword1: '',
  newPassword2: ''
})

async function passwordConfirm() {
  if (editPassword.value.newPassword1 === editPassword.value.newPassword2) {
    try {
      await _axios.post(
          '/users/auth/password/change/',
          {
            oldPassword: editPassword.value.oldPassword,
            newPassword1: editPassword.value.newPassword1,
            newPassword2: editPassword.value.newPassword2
          }
      )
      await router.push({ name: 'Home' })
      notify({
        type: 'positive',
        message: t('notifications.positive.password-changed')
      })
    } catch (e) {
      // TODO
      notify({
        type: 'negative',
        message: t('notifications.negative.invalid-request')
      })
    }
  } else {
    notify({
      type: 'negative',
      message: t('notifications.negative.different-passwords')
    })
  }
}
</script>

<template>
  <QForm
      @submit="passwordConfirm"
      class="q-gutter-md"
  > 
    <QInput
        filled
        type="password"
        v-model="editPassword.oldPassword"
        :label="$t('forms.old-password')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('forms.required-old-password')]"
    />
    <QInput
        filled
        type="password"
        v-model="editPassword.newPassword1"
        :label="$t('forms.new-password')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('forms.required-new-password')]"
    />
    <QInput
        filled
        type="password"
        v-model="editPassword.newPassword2"
        :label="$t('forms.repeat-new-password')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('forms.required-repeat-new-password')]"
    />
    <QBtn :label="$t('forms.send')" type="submit" color="primary"/>
  </QForm>
</template>

<style scoped lang="sass">

</style>
