<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import _axios from '@/plugins/axios'

const { notify } = useQuasar()
const email = ref<string>()
const isReset = ref<boolean>(false)

async function reset() {
  try {
    await _axios.post('/users/auth/password/reset/', { email: email.value })
    isReset.value = true
  } catch (e) {
    notify({
      type: 'negative',
      message: 'Adresse email non reconnue, veuillez réessayer.'
    })
  }

}
</script>

<template>
  <div>
    <p v-if="!isReset">Veuillez saisir l'adresse mail avec laquelle vous vous connectez d'habitude. Un mail de réinitialisation de mot de passe vous sera envoyé. Cliquez sur le lien dans le mail pour choisir un nouveau mot de passe.</p>
    <p v-if="isReset">Votre demande a bien été prise en compte, consultez votre boîte mail.</p>
  </div>
  <q-form
      v-if="!isReset"
      @submit="reset"
      class="q-gutter-md"
  >
    <q-input
        filled
        v-model="email"
        label="Adresse mail"
        lazy-rules
        :rules="[ (val, rules) => rules.email(val) || 'Veuillez renseigner votre adresse mail']"
    />
    <q-btn label="Envoyer" type="submit" color="primary"/>
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
