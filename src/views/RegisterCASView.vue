<script setup lang="ts">
import FormRegister from '@/components/form/FormRegister.vue'
</script>

<template>
  <h1>{{ $t("register.register") }}</h1>
  <q-card class="card">
    <q-card-section>
      <FormRegister />
    </q-card-section>
  </q-card>
</template>

<style scoped lang="sass">
.card
  margin-bottom: 30px
</style>
