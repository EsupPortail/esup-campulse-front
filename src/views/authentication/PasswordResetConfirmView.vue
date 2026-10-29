<script lang="ts" setup>
import {ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRoute} from 'vue-router'
import {useQuasar} from 'quasar'
import type {PasswordReset} from '#/user'
import router from '@/router'
import useSecurity from '@/composables/useAuthentication'
import axios from 'axios'
import useErrors from '@/composables/useError'
import type {PasswordChecker} from '#/global'
import FormPasswordChecker from '@/components/authentication/FormPasswordChecker.vue'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {passwordResetConfirm, checkPasswordStrength} = useSecurity()
const route = useRoute()
const {catchHTTPError} = useErrors()

const newPassword = ref<PasswordReset>({
  newPassword1: '',
  newPassword2: ''
})

const passwordChecker = ref<PasswordChecker>(checkPasswordStrength(''))
watch(() => newPassword.value.newPassword1, () => {
  let password = ''
  if (newPassword.value.newPassword1) password = newPassword.value.newPassword1
  passwordChecker.value = checkPasswordStrength(password)
})

async function resetConfirm() {
  loading.show()
  try {
    const payload = {
      uid: route.query.uid as string,
      token: route.query.token as string,
      newPassword1: newPassword.value.newPassword1,
      newPassword2: newPassword.value.newPassword2
    }
    await passwordResetConfirm(payload)
    await router.push({name: 'Login'})
    notify({
      type: 'positive',
      message: t('notifications.positive.password-reseted')
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
  <section class="dashboard-section">
    <div class="dashboard-section-container">
      <div class="container">
        <div class="form-container">
          <div class="form">
            <QForm
              class="flex-column"
              @submit.prevent="resetConfirm"
            >
              <QInput
                v-model="newPassword.newPassword1"
                :label="t('forms.new-password')"
                :rules="[
                  val => val && val.length > 0 || t('forms.required-new-password'),
                  val => val && passwordChecker.valid || t('forms.required-strong-password')
                ]"
                autocomplete="new-password"
                bottom-slots
                clearable
                color="dashboard"
                filled
                for="new-password-to-check"
                lazy-rules
                type="password"
              >
                <template v-slot:hint>
                  <p aria-describedby="new-password-to-check">
                    {{
                      t('forms.strong-password-hint')
                    }}
                  </p>
                </template>
              </QInput>
              <QInput
                v-model="newPassword.newPassword2"
                :label="t('forms.repeat-new-password')"
                :rules="[
                  val => val && val.length > 0 || t('forms.required-repeat-new-password'),
                  val => val && val === newPassword.newPassword1 || t('forms.passwords-are-not-equal')
                ]"
                autocomplete="new-password"
                clearable
                color="dashboard"
                filled
                lazy-rules
                type="password"
              />
              <FormPasswordChecker
                :password="newPassword.newPassword1"
                :password-checker="passwordChecker"
              />
              <div>
                <QBtn
                  :disable="!passwordChecker.valid || newPassword.newPassword1 !== newPassword.newPassword2"
                  :label="t('forms.send')"
                  class="btn-lg"
                  color="dashboard"
                  icon="bi-check-lg"
                  type="submit"
                />
              </div>
            </QForm>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms";

.q-form {
  margin: 3rem 0;
}
</style>
