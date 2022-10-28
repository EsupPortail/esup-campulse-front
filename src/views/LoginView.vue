<script setup lang="ts">
import FormLocalLogin from '@/components/FormLocalLogin.vue'
</script>

<template>
  <h1>Connexion</h1>
  <div class="no-account">Je n'ai pas de compte <span><q-btn color="secondary" label="Créer un compte" /></span></div>
  <q-card class="card">
    <q-card-section>
      <div class="card-content">
        <span class="card-title">Je suis membre de l'Université de Strasbourg</span>
        Connexion avec un compte CAS
      </div>
      <q-btn label="Connexion" type="button" color="primary"/>
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

.no-account
  text-align: center
  font-size: 1.5em
  margin-bottom: 30px
  display: flex
  flex-direction: column

.no-account span
  margin-top: 10px
</style>