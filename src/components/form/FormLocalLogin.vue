<script setup lang="ts">
import { useUserLoginStore } from '@/stores/useUserStore'
import type { UserLogin } from "#/user"
import { ref } from 'vue'

const user = ref<UserLogin>({
  username: '',
  password: '',
  first_name: ''
})

const store = useUserLoginStore()

function onLogin() {
  store.user.username = user.value.username
  store.user.password = user.value.password
  store.login()
}
</script>

<template>
  <q-form
      @submit="onLogin"
      class="q-gutter-md"
  >
    <q-input
        filled
        v-model="user.username"
        label="Adresse E-mail"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez renseigner votre adresse E-mail']"
    />

    <q-input
        filled
        type="password"
        v-model="user.password"
        label="Mot de passe"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez saisir votre mot de passe']"
    />

    <div class="btn-group">
      <q-btn label="Connexion" type="submit" color="primary"/>
      <q-btn color="secondary" label="Créer un compte" />
    </div>
    <q-btn label="Mot de passe oublié ?" type="reset" color="primary" flat class="q-sm" />
  </q-form>
</template>

<style lang="sass">
.btn-group
  display: flex
  gap: 10px
</style>