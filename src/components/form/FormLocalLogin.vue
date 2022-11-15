<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import type { UserLogin } from '#/user'
import { useUserStore } from '@/stores/useUserStore'

const user = ref<UserLogin>({
  username: '',
  password: ''
})

const { notify } = useQuasar()
const router = useRouter()
const userStore = useUserStore()

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
      message: 'Identifiants non reconnus, veuillez réessayer.'
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
        label="Adresse email"
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
      <q-btn label="Créer un compte" color="secondary" to="/register"/>
    </div>
    <q-btn label="Mot de passe oublié ?" color="primary" flat class="q-sm" to="/password-reset"/>
  </q-form>
</template>

<style scoped lang="sass">
.btn-group
  display: flex
  gap: 10px
</style>
