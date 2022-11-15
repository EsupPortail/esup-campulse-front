<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import type { PasswordReset } from '#/user'
import _axios from '@/plugins/axios'
import router from '@/router'

const { t } = useI18n()
const { notify } = useQuasar()
const route = useRoute()

const newPassword = ref<PasswordReset>({
  newPassword1: '',
  newPassword2: ''
})

async function resetConfirm() {
  if (newPassword.value.newPassword1 === newPassword.value.newPassword2) {
    try {
      await _axios.post(
          '/users/auth/password/reset/confirm/',
          {
            uid: route.query.uid,
            token: route.query.token,
            new_password1: newPassword.value.newPassword1,
            new_password2: newPassword.value.newPassword2
          }
      )
      await router.push({ name: 'Login' })
      notify({
        type: 'positive',
        message: t('notifications.posutive.password-reseted')
      })
    } catch (e) {
      // TODO
      notify({
        type: 'negative',
        message: t('notifications.negative.invalid-request')
      })
    }
  }
  notify({
    type: 'negative',
    message: t('notifications.negative.different-passwords')
  })
}
</script>

<template>
  <q-form
      @submit="resetConfirm"
      class="q-gutter-md"
  >
    <q-input
        filled
        type="password"
        v-model="newPassword.newPassword1"
        :label="$t('forms.new-password')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('forms.required-new-password')]"
    />
    <q-input
        filled
        type="password"
        v-model="newPassword.newPassword2"
        :label="$t('forms.repeat-new-password')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('forms.required-repeat-new-password')]"
    />
    <q-btn :label="$t('forms.send')" type="submit" color="primary"/>
  </q-form>
</template>

<style scoped lang="sass">

</style>
