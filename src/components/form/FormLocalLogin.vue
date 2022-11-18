<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import type { UserLogin } from '#/user'
import { useUserStore } from '@/stores/useUserStore'

const user = ref<UserLogin>({
  username: '',
  password: ''
})

const { t } = useI18n()
const { notify } = useQuasar()
const userStore = useUserStore()

async function logIn() {
  try {
    await userStore.logIn('/users/auth/login/', {username: user.value.username, password: user.value.password as string})
    notify({
      type: 'positive',
      message: t('notifications.positive.login-success')
    })
  } catch (e) {
    notify({
      type: 'negative',
      message: t('notifications.negative.unknown-credentials')
    })
  }
}

</script>

<template>
  <QForm
      @submit="logIn"
      class="q-gutter-md"
  >
    <QInput
        filled
        v-model="user.username"
        :label="$t('forms.email')"
        lazy-rules
        :rules="[ (val, rules) => rules.email(val) || $t('forms.required-email')]"
    />
    <QInput
        filled
        type="password"
        v-model="user.password"
        :label="$t('forms.password')"
        lazy-rules
        :rules="[ val => val && val.length > 0 || $t('forms.required-password')]"
    />
    <div class="btn-group">
      <QBtn :label="$t('forms.login')" type="submit" color="primary"/>
      <QBtn :label="$t('forms.create-account')" color="secondary" to="/register"/>
    </div>
    <QBtn :label="$t('forms.reset-password')" color="primary" flat class="q-sm" to="/password-reset"/>
  </QForm>
</template>

<style scoped lang="sass">
.btn-group
  display: flex
  gap: 10px
</style>
