<script setup lang="ts">

</script>

<template>
  <h1>Connexion</h1>
  <section class="login-btn">
    <q-btn color="primary" label="Je suis membre de l'Unistra" />
    <RouterLink to="/login/local"><q-btn color="primary" label="Je suis extérieur à l'Unistra" /></RouterLink>

  </section>
</template>

<style lang="sass">
.login-btn
  display: flex
  justify-content: center
  gap: 30px
</style>