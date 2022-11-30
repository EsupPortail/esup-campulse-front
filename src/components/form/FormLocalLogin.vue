<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import type {UserLogin} from '#/user'
import {useUserStore} from '@/stores/useUserStore'
import router from "@/router";

const user = ref<UserLogin>({
  username: '',
  password: ''
})

const {t} = useI18n()
const {notify} = useQuasar()
const userStore = useUserStore()

async function logIn() {
  try {
    await userStore.logIn('/users/auth/login/', {
      username: user.value.username,
      password: user.value.password as string
    })
    await router.push({name: 'Dashboard'})
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
      class="q-gutter-md"
      @submit="logIn"
  >
    <QInput
        v-model="user.username"
        :label="$t('forms.email')"
        :rules="[ (val, rules) => rules.email(val) || $t('forms.required-email')]"
        filled
        lazy-rules
    />
    <QInput
        v-model="user.password"
        :label="$t('forms.password')"
        :rules="[ val => val && val.length > 0 || $t('forms.required-password')]"
        filled
        lazy-rules
        type="password"
    />
    <div class="btn-group">
      <QBtn :label="$t('forms.login')" color="primary" type="submit"/>
      <QBtn :label="$t('forms.create-account')" color="secondary" to="/register"/>
    </div>
    <QBtn :label="$t('forms.reset-password')" class="q-sm" color="primary" flat to="/password-reset"/>
  </QForm>
</template>

<style lang="sass" scoped>
.btn-group
  display: flex
  gap: 10px
</style>
