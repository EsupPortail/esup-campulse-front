<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore'
import type {UserRegister, UserAssociations} from '#/user'
import type {Association, AssociationList} from '#/association'
import _axios from '@/plugins/axios'
import {useQuasar} from 'quasar'
import {onMounted, ref} from 'vue'
import router from '@/router'
import {useRoute} from 'vue-router'


const {notify} = useQuasar()
const route = useRoute()

// Setting newUser data
const newUser = ref<UserRegister>({
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: ''
})

// Load user infos from CAS
onMounted(async () => {
  try {
    if (route.query.ticket) {
      const response = await _axios.post(
    '/users/auth/cas/login/',
  {
          ticket: route.query.ticket as string,
          service: import.meta.env.VITE_APP_FRONT_URL + '/cas-register'
        }
      )
      const {access_token, refresh_token, user} = response.data
      localStorage.setItem('access', access_token)
      localStorage.setItem('refresh', refresh_token)
      newUser.value.username = user.username
      newUser.value.first_name = user.first_name
      newUser.value.last_name = user.last_name
      newUser.value.email = user.email
      emailVerification.value = user.email
    } else {
      notify({
        message: 'Pas de ticket.'
      })
      await router.push({name: 'Login'})
    }
  } catch (e) {
    notify({
      message: 'Erreur d\'authentification CAS.'
    })
    await router.push({name: 'Login'})
  }
})

// Setup newUser's associations
const newUserAssociations = ref<UserAssociations>([])

// Loading associations list
const associations = ref<AssociationList>([])
async function loadAssociations() {
  try {
    associations.value = (await _axios.get<Association[]>('/associations/')).data
        .map(association => ({
          value: association.id,
          label: association.name
        }))
  } catch (e) {
    notify({
      message: 'Erreur lors du chargement du formulaire, veuillez rafraichir la page.'
    })
  }
}
onMounted(loadAssociations)

// Add or remove new multiple associations
function addAssociation() {
  newUserAssociations.value.push({
    id: null,
    has_office_status: false
  })
}
function removeAssociation(index: number) {
  newUserAssociations.value.splice(index, 1)
}

// Verify Email
const emailVerification = ref<string>('')

// Register newUser
const userStore = useUserStore()
async function register() {
  try {
    await userStore.userCASRegister(newUser.value.phone)
    if (newUserAssociations.value) {
      await userStore.userAssociationsRegister(newUser.value.username, newUserAssociations.value)
    }
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
        disable
        v-model="newUser.first_name"
        label="Prénom *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez renseigner votre prénom']"
    />

    <q-input
        filled
        disable
        v-model="newUser.last_name"
        label="Nom *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez renseigner votre nom']"
    />

    <q-input
        filled
        disable
        v-model="newUser.email"
        label="Adresse mail *"
        lazy-rules
        :rules="[ (val, rules) => rules.email(val) || 'Veuillez renseigner votre adresse mail']"
    />

    <q-input
        filled
        disable
        v-model="emailVerification"
        label="Vérification de l'adresse mail *"
        lazy-rules
        :rules="[ (val, rules) => rules.email(val) || 'Veuillez renseigner votre adresse mail']"
    />

    <q-input
        filled
        v-model="newUser.phone"
        label="Numéro de téléphone (faculatif)"
        mask="## ## ## ## ##"
        hint="Exemple : 06 00 00 00 00"
        lazy-rules
    />

    <q-separator />

    <div class="add-association-info">Je suis membre d'une ou plusieurs associations
      <span>J'ajoute les associations dont je fais partie</span>
    </div>

    <div v-for="(association, index) in newUserAssociations" :key="index">
      <q-select filled v-model="association.id" :options="associations" map-options emit-value label="Choisissez votre association" />
      <q-checkbox v-model="association.has_office_status" label="Je suis membre du bureau de l'association" />
      <div>
        <q-btn @click="removeAssociation(index)" outline color="red" icon="mdi-minus-circle-outline" label="Supprimer l'association" />
      </div>
      <q-separator />
    </div>
    <div>
      <q-btn v-if="newUserAssociations.length < 5" @click="addAssociation" outline color="primary" icon="mdi-plus-circle-outline" label="Ajouter une association" />
    </div>

    <div>
      <q-btn label="Envoyer" type="submit" color="primary"/>
    </div>

  </q-form>
</template>

<style scoped lang="sass">
.add-association-info
  font-size: 1.5em
  span
    font-size: 0.7em
    display: block

.q-separator
  margin: 10px 0 10px 0

.q-btn
  margin: 10px 0 10px 0
</style>