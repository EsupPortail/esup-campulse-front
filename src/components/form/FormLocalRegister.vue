<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore'
import type { UserRegister } from '#/user'
import { ref } from 'vue'
import {useQuasar} from "quasar";


const newUser = ref<UserRegister>({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  associations: [
    {
      name: '',
      has_office_status: false
    }
  ]
})

const userStore = useUserStore()
const {notify} = useQuasar()

async function register() {
  try {
    await userStore.register('/users/auth/registration/', newUser.value)
  } catch (e) {
    notify({
      message: 'Erreur lors de l\'inscription'
    })
  }
}

</script>

<template>
  <q-form
      @submit="register"
      class="q-gutter-md"
  >

    <q-input
        filled
        v-model="newUser.first_name"
        label="Prénom"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez renseigner votre prénom']"
    />

    <q-input
        filled
        v-model="newUser.last_name"
        label="Nom"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez renseigner votre nom']"
    />

    <q-input
        filled
        v-model="newUser.email"
        label="E-mail"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez renseigner votre adresse E-mail']"
    />

<!--    <q-input
        filled
        v-model="newUser.email"
        label="E-mail"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez renseigner votre adresse E-mail']"
    />-->

    <q-input
        filled
        v-model="newUser.phone"
        label="Numéro de téléphone (falculatif)"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez renseigner un numéro de téléphone valide']"
    />

    <q-input
        filled
        v-model="newUser.associations[0].name"
        label="Association dont vous êtes membre (facultatif)"
        lazy-rules
    />

    <q-checkbox v-model="newUser.associations[0].has_office_status" label="Membre du bureau de l'association" />

    <div class="btn-group">
      <q-btn label="Envoyer" type="submit" color="primary"/>
    </div>

  </q-form>
</template>

<style scoped lang="sass">

</style>d