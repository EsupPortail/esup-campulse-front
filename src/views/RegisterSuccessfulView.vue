<script setup lang="ts">

</script>

<template>
  <h1>Demande d'inscription réussie</h1>
    <div>
      <p>{{ $t("register.registration-ok") }}</p>
      <RouterLink to="/">{{ $t("register.back-to-home") }}</RouterLink>
    </div>
</template>

<style scoped lang="sass">
div
  text-align: center
</style>
