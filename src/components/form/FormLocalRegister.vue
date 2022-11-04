<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore'
import type { UserRegister } from '#/user'
import { ref } from 'vue'

const user = ref<UserRegister>({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  asso_name: '',
  asso_has_office_status: false
})

const userStore = useUserStore()

</script>

<template>
  <q-form
      @submit="register"
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
        v-model="user.email"
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

    <q-input
        filled
        v-model="user.asso_name"
        label="Association dont vous êtes membre (facultatif)"
        lazy-rules
    />

    <q-checkbox v-model="user.asso_has_office_status" label="Membre du bureau de l'association" />



  </q-form>
</template>

<style lang="sass">
.btn-group
  display: flex
  gap: 10px
</style>d