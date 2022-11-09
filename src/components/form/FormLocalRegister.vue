<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore'
import type {UserRegister, UserAssociations, UserAssociation} from '#/user'
import type {Association, AssociationList} from '#/association'
import _axios from 'axios'
import {useQuasar} from 'quasar'
import {onMounted, ref} from 'vue'


const {notify} = useQuasar()

// Setting newUser data
const newUser = ref<UserRegister>({
  first_name: '',
  last_name: '',
  email: '',
  phone: ''
})

// Setting newUser's associations
const newUserAssociations = ref<UserAssociations>([])

// Loading associations list
const associations = ref<AssociationList>([])
async function loadAssociations() {
  try {
    associations.value = (await _axios.get<Association[]>('http://localhost:8000/associations/')).data
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
    name: '',
    has_office_status: false
  })
}
function removeAssociation(index: number) {
  newUserAssociations.value.splice(index, 1)
}

// Register newUser
const userStore = useUserStore()
async function register() {
  try {
    await userStore.userRegister(newUser.value)
    if (newUserAssociations.value) {
      await userStore.userAssociationsRegister(newUser.value.email, newUserAssociations.value)
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

    <q-separator />

    <span>Je suis membre d'une association</span>

    <div v-for="(association, index) in newUserAssociations" :key="index">
      <q-select filled v-model="association.name" :options="associations" map-options emit-value label="Choisissez votre association" />
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
span
  font-size: 1.5em

.q-separator
  margin: 10px 0 10px 0

.q-btn
  margin: 10px 0 10px 0
</style>