<script setup lang="ts">

</script>

<template>
  <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
  >
    <q-input
        filled
        v-model="mail"
        label="Adresse E-mail"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez renseigner votre adresse E-mail']"
    />

    <q-input
        filled
        v-model="password"
        label="Mot de passe"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Veuillez saisir votre mot de passe']"
    />

    <div>
      <q-btn label="Connexion" type="submit" color="primary"/>
      <q-btn label="Mot de passe oublié ?" type="reset" color="primary" flat class="q-ml-sm" />
    </div>
  </q-form>
</template>

<style lang="sass">

</style>