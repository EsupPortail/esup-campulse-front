<script setup lang="ts">

import FormLocalRegister from "@/components/form/FormLocalRegister.vue";
</script>

<template>
  <h1>Inscription</h1>
    <q-card class="card">
      <q-card-section>
        <FormLocalRegister />
      </q-card-section>
    </q-card>
</template>

<style scoped lang="sass">
.card
  margin-bottom: 30px
</style>