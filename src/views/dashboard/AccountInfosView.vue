<script lang="ts" setup>
import FormProfilePasswordEdit from '@/components/form/FormProfilePasswordEdit.vue'
import {useI18n} from 'vue-i18n'
import FormUserInfosEdition from '@/components/form/FormUserInfosEdition.vue'
import {useUserStore} from '@/stores/useUserStore'
import {onMounted, watch} from 'vue'
import {useQuasar} from 'quasar'
import useUsers from '@/composables/useUsers'

const {t} = useI18n()
const {loading} = useQuasar()
const {user} = useUsers()
const userStore = useUserStore()

const initValues = () => {
    user.value.firstName = userStore.user?.firstName
    user.value.lastName = userStore.user?.lastName
    user.value.username = userStore.user?.username
    user.value.email = userStore.user?.email
    user.value.phone = userStore.user?.phone as string
}
watch(() => userStore.user, initValues)


onMounted(async () => {
    loading.show
    initValues()
    loading.hide
})
</script>

<template>
    <h2>Modifier mes informations</h2>
    <FormUserInfosEdition :edited-by-staff="false" :user="userStore.user"/>
    <!--
    Nom (obligatoire, remontée)
    Prénom (obligatoire, remontée)
    Email (obligatoire, remontée)
    Bouton modifier mon email -> 2 champs avec confirmation
    Téléphone
    Mon statut actuel : remontée (information pour changement de rôle)
    -->
    <h3>Les associations dont je suis membre</h3>

    <!--
    Liste des associations dont je suis membre (sous forme de cards comme dans l'annuaire)
    Modifier mon rôle dans l'association
    Ajouter une association
    Supprimer une association
    -->
    <h2>Modifier mon mot de passe</h2>
    <FormProfilePasswordEdit/>
</template>
