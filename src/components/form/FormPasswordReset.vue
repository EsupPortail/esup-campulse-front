<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { passwordReset } from '@/services/userService'

const { t } = useI18n()
const { notify } = useQuasar()
const email = ref<string>()
const isReset = ref<boolean>(false)

async function reset() {
  try {
    await passwordReset(email.value as string)
    isReset.value = true
  } catch (e) {
    notify({
      type: 'negative',
      message: t('notifications.negative.unknown-email')
    })
  }

}
</script>

<template>
  <div>
    <p v-if="!isReset">{{ $t("forms.password-reset-instructions") }}</p>
    <p v-if="isReset">{{ $t("forms.password-reset-ok") }}</p>
  </div>
  <q-form
      v-if="!isReset"
      @submit="reset"
      class="q-gutter-md"
  >
    <q-input
        filled
        v-model="email"
        :label="$t('forms.email')"
        lazy-rules
        :rules="[ (val, rules) => rules.email(val) || $t('forms.required-email')]"
    />
    <q-btn :label="$t('forms.send')" type="submit" color="primary"/>
  </q-form>
</template>

<style scoped lang="sass">
.q-form
  max-width: 720px
  width: 100%
  margin: auto

div
  text-align: center
  font-size: 1.2em

</style>
