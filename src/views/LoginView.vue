<script setup lang="ts">
import FormLocalLogin from '@/components/form/FormLocalLogin.vue'

const CASUrlLogin = `https://cas-dev.unistra.fr/cas/login?service=${encodeURIComponent(import.meta.env.VITE_APP_FRONT_URL + "/cas-login")}`
const CASUrlRegister = `https://cas-dev.unistra.fr/cas/login?service=${encodeURIComponent(import.meta.env.VITE_APP_FRONT_URL + "/cas-register")}`
</script>

<template>
  <h1>Connexion</h1>
  <q-card class="card">
    <q-card-section>
      <div class="card-content">
        <span class="card-title">{{ $t("login.im-cas-user") }}</span>
        {{ $t("login.login-with-cas") }}
      </div>
      <div class="btn-group">
        <q-btn :label="$t('login.login')" color="primary" :href="CASUrlLogin" type="a"/>
        <q-btn :label="$t('login.create-account')" color="secondary" :href="CASUrlRegister" />
      </div>
    </q-card-section>
  </q-card>
  <q-card class="card">
    <q-card-section>
      <div class="card-content">
        <span class="card-title">{{ $t("login.im-not-cas-user") }}</span>
        {{ $t("login.login-without-cas") }}
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
