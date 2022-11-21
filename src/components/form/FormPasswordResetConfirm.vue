<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import type { PasswordReset } from '#/user'
import router from '@/router'
import { passwordResetConfirm } from "@/services/userService";

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
      await passwordResetConfirm(route.query.uid as string, route.query.token as string, newPassword.value.newPassword1, newPassword.value.newPassword2)
      await router.push({ name: 'Login' })
      notify({
        type: 'positive',
        message: t('notifications.positive.password-reseted')
      })
    } catch (e) {
      notify({
        type: 'negative',
        message: t('notifications.negative.invalid-request')
      })
    }
  }
  else {
    notify({
      type: 'negative',
      message: t('notifications.negative.different-passwords')
    })
  }
}
</script>

<template>
  <QForm
      @submit="resetConfirm"
      class="q-gutter-md"
  >
    <QInput
        filled
        type="password"
        v-model="newPassword.newPassword1"
        :label="$t('forms.new-password')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('forms.required-new-password')]"
    />
    <QInput
        filled
        type="password"
        v-model="newPassword.newPassword2"
        :label="$t('forms.repeat-new-password')"
        lazy-rules
        :rules="[
          val => val && val.length > 0 || $t('forms.required-repeat-new-password'),
          val => val && val === newPassword.newPassword1 || $t('forms.passwords-are-not-equal')
        ]"
    />
    <QBtn :label="$t('forms.send')" type="submit" color="primary"/>
  </QForm>
</template>

<style scoped lang="sass">

</style>
