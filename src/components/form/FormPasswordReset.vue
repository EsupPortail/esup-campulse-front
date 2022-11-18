<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { passwordReset } from '@/services/userService'
import axios from 'axios'

const { t } = useI18n()
const { notify } = useQuasar()
const email = ref<string>()
const isReset = ref<boolean>(false)

async function reset() {
  try {
    await passwordReset(email.value as string)
    isReset.value = true
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let errorMessage = null
      switch (error.response?.status) {
        case 404:
          errorMessage = t('notifications.negative.unknown-email')
          break;
        case 403:
          errorMessage = t('notifications.negative.restricted-email')
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
  <div v-if="isReset" class="instructions">
    <p>{{ $t("forms.password-reset-ok") }}</p>
  </div>
  <QForm
      v-if="!isReset"
      @submit="reset"
      class="q-gutter-md"
  >
    <fieldset>
      <legend class="instructions">{{ $t("forms.password-reset-instructions") }}</legend>
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
.q-form
  max-width: 720px
  width: 100%
  margin: auto

.instructions
  text-align: center
  font-size: 1.2em

fieldset
  padding-top: 30px
  border: none

.q-btn
  margin-top: 10px
</style>
