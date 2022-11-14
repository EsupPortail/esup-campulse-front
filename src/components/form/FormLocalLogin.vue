<script setup lang="ts">
import {useUserStore} from '@/stores/useUserStore'
import type {UserLogin} from '#/user'
import {ref} from 'vue'
import {useQuasar} from 'quasar'
import {useRouter} from 'vue-router'

const user = ref<UserLogin>({
  username: '',
  password: ''
})

const userStore = useUserStore()

const {notify} = useQuasar()
const router = useRouter()

async function logIn() {
  try {
    await userStore.logIn(
        '/users/auth/login/',
        {
          username: user.value.username,
          password: user.value.password as string
        }
    )
    await router.push({name: 'Home'})
    notify({
      type: 'positive',
      message: 'Connexion réussie.'
    })
  } catch (e) {
    notify({
      type: 'negative',
      message: 'Erreur identifiants, veuillez réessayer.'
    })
  }
}

</script>

<template>
  <q-form
      @submit="logIn"
      class="q-gutter-md"
  >
    <q-input
        filled
        v-model="user.username"
        label="Adresse mail"
        lazy-rules
        :rules="[ (val, rules) => rules.email(val) || 'Veuillez renseigner votre adresse mail']"
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
      <q-btn color="secondary" label="Créer un compte" href="/register"/>
    </div>
    <q-btn label="Mot de passe oublié ?" type="reset" color="primary" flat class="q-sm"/>
  </q-form>
</template>

<style lang="sass">
.btn-group
  display: flex
  gap: 10px
</style>