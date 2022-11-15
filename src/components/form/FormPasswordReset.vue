<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const {notify} = useQuasar()
const email = ref<string>()

function reset() {
  // if reset is ok
  return true
}
</script>

<template>
  <div>
    <p>Veuillez saisir l'adresse mail avec laquelle vous vous connectez d'habitude. Un mail de réinitialisation de mot de passe vous sera envoyé. Cliquez sur le lien dans le mail pour choisir un nouveau mot de passe.</p>
  </div>
  <q-form
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