<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { resendEmail } from '@/services/userService'
import axios from 'axios'

const { t } = useI18n()
const { notify } = useQuasar()
const email = ref<string>()
const isResend = ref<boolean>(false)

async function resend() {
  try {
    await resendEmail(email.value as string)
    isResend.value = true
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let errorMessage = null
      switch (error.response?.status) {
        case 404:
          errorMessage = t('notifications.negative.unknown-email')
          break;
        default:
          errorMessage = t('notifications.negative.invalid-request')
          break;
      }
      notify({
        type: 'negative',
        message: errorMessage
      })
    }
  }
}
</script>

<template>
  <div class="instructions">
    <p v-if="isResend" >{{ $t("forms.resend-email-ok") }}</p>
  </div>
  <QForm
      v-if="!isResend"
      @submit="resend"
      class="q-gutter-md"
  >
    <fieldset>
      <legend class="instructions">{{ $t("forms.resend-email-confirmation") }}</legend>
      <QInput
          filled
          v-model="email"
          :label="$t('forms.email')"
          lazy-rules
          :rules="[ (val, rules) => rules.email(val) || $t('forms.required-email')]"
      />
      <QBtn :label="$t('forms.send')" type="submit" color="primary"/>
    </fieldset>
  </QForm>
</template>

<style scoped lang="sass">
.instructions
  font-size: 1.2em

  p
    text-align: center

.q-form, .instructions
  max-width: 720px
  width: 100%
  margin: auto

fieldset
  padding-top: 30px
  border: none

.q-btn
  margin-top: 10px
</style>
