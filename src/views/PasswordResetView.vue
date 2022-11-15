<script setup lang="ts">
import FormPassWordReset from '@/components/form/FormPasswordReset.vue'
</script>

<template>
  <h1>Mot de passe oublié</h1>
  <FormPassWordReset v-if="!isReset"/>
  <div v-if="isReset">
    <p>Votre demande a bien été prise en compte. Consultez votre boîte mail.</p>
  </div>
</template>

<style scoped lang="sass">

</style>