<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore'
import type { UserRegister } from '#/user'
import { ref } from 'vue'

const user = ref<UserRegister>({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  associations: []
})

const emailValidation = ref('')

const userStore = useUserStore()

</script>

<template>
  <q-form
      @submit="userStore.register"
      class="q-gutter-md"
  >

    <q-input
        filled
        v-model="user.first_name"
        label="Prénom"
        lazy-rules
    />

    <q-input
        filled
        v-model="user.last_name"
        label="Nom"
        lazy-rules
    />

    <q-input
        filled
        v-model="user.email"
        label="E-mail"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez renseigner votre adresse E-mail']"
    />

    <q-input
        filled
        v-model="emailValidation"
        label="E-mail"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez renseigner votre adresse E-mail']"
    />

    <q-input
        filled
        v-model="user.phone"
        label="Numéro de téléphone (falculatif)"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez renseigner un numéro de téléphone valide']"
    />

    <div>
        <q-input
            filled
            v-model="user.associations[0].name"
            label="Association dont vous êtes membre (facultatif)"
            lazy-rules
        />

        <q-checkbox v-model="user.associations[0].has_office_status" label="Membre du bureau de l'association" />
    </div>

    <div class="btn-group">
      <q-btn label="Envoyer" type="submit" color="primary"/>
    </div>

  </q-form>
</template>

<style scoped lang="sass">

</style>d