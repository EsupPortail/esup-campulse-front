<script setup lang="ts">
import FormLocalLogin from '@/components/form/FormLocalLogin.vue'

const casUrl = `https://cas-dev.unistra.fr/cas/login?service=${encodeURIComponent(import.meta.env.VITE_APP_FRONT_URL + "/cas-login")}`
</script>

<template>
  <h1>Connexion</h1>
  <q-card class="card">
    <q-card-section>
      <div class="card-content">
        <span class="card-title">Je suis étudiant ou personnel de l'Université de Strasbourg</span>
        Connexion avec un compte CAS
      </div>
      <div class="btn-group">
        <q-btn label="Connexion" type="a" color="primary" :href="casUrl"/>
        <RouterLink to="register"><q-btn color="secondary" label="Créer un compte" /></RouterLink>
      </div>
    </q-card-section>
  </q-card>
  <q-card class="card">
    <q-card-section>
      <div class="card-content">
        <span class="card-title">Je suis extérieur à l'Université de Strasbourg</span>
        Connexion avec un compte externe
      </div>
      <FormLocalLogin />
    </q-card-section>
  </q-card>
</template>

<style scoped lang="sass">
.card
  max-width: 700px
  width: 100%
  margin: auto auto 30px auto
  height: auto

.card-content
  display: flex
  flex-direction: column
  font-size: 18px
  margin-bottom: 10px

.card-title
  font-size: 1.4em

.btn-group
  display: flex
  gap: 10px
</style>
