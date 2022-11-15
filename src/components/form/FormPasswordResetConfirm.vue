<script setup lang="ts">
import { ref } from 'vue'
import _axios from '@/plugins/axios'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import type { PasswordReset } from '#/user'
import router from '@/router'

const route = useRoute()
const { notify } = useQuasar()


const newPassword = ref<PasswordReset>({
  newPassword1: '',
  newPassword2: ''
})

async function resetConfirm() {
  if (newPassword.value.newPassword1 === newPassword.value.newPassword2) {
    try {
      await _axios.post(
          '/users/auth/password/reset/confirm/',
          {
            uid: route.query.uid,
            token: route.query.token,
            new_password1: newPassword.value.newPassword1,
            new_password2: newPassword.value.newPassword2
          }
      )
      await router.push({name: 'Login'})
      notify({
        type: 'positive',
        message: 'Votre mot de passe a bien été réinitialisé. Vous pouvez tenter de vous connecter.'
      })
    } catch (e) {
      // TODO
    }
  }
  notify({
    type: 'negative',
    message: 'Les 2 mots de passe ne sont identiques.'
  })
}
</script>

<template>
  <q-form
      @submit="resetConfirm"
      class="q-gutter-md"
  >
    <q-input
        filled
        type="password"
        v-model="newPassword.newPassword1"
        label="Nouveau mot de passe"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez saisir votre mot de passe']"
    />
    <q-input
        filled
        type="password"
        v-model="newPassword.newPassword2"
        label="Nouveau mot de passe"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez saisir votre mot de passe']"
    />
    <q-btn label="Envoyer" type="submit" color="primary"/>
  </q-form>
</template>

<style scoped lang="sass">

</style>
