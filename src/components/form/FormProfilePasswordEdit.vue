<script setup lang="ts">
import _axios from '@/plugins/axios'
import router from '@/router'
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import type { PasswordEdit } from '#/user'

const { notify } = useQuasar()

const editPassword = ref<PasswordEdit>({
  oldPassword: '',
  newPassword1: '',
  newPassword2: ''
})

async function passwordConfirm() {
  if (editPassword.value.newPassword1 === editPassword.value.newPassword2) {
    try {
      await _axios.post(
          '/users/auth/password/change/',
          {
            old_password: editPassword.value.oldPassword,
            new_password1: editPassword.value.newPassword1,
            new_password2: editPassword.value.newPassword2
          }
      )
      await router.push({name: 'Home'})
      notify({
        type: 'positive',
        message: 'Votre mot de passe a bien été modifié.'
      })
    } catch (e) {
      notify({
        type: 'negative',
        message: 'Erreur de requête.'
      })
    }
  } else {
    notify({
      type: 'negative',
      message: 'Les 2 nouveaux mots de passe ne sont pas identiques.'
    })
  }
}
</script>

<template>
  <q-form
      @submit="passwordConfirm"
      class="q-gutter-md"
  > 
    <q-input
        filled
        type="password"
        v-model="editPassword.oldPassword"
        label="Mot de passe actuel"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez saisir votre ancien mot de passe']"
    />
    <q-input
        filled
        type="password"
        v-model="editPassword.newPassword1"
        label="Nouveau mot de passe"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez saisir votre nouveau mot de passe']"
    />
    <q-input
        filled
        type="password"
        v-model="editPassword.newPassword2"
        label="Répéter votre nouveau mot de passe"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez répéter votre nouveau mot de passe']"
    />
    <q-btn label="Envoyer" type="submit" color="primary"/>
  </q-form>
</template>

<style scoped lang="sass">

</style>
