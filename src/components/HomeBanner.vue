<script setup lang="ts">
defineProps({
  title: String,
  description: String
})
</script>

<template>

    <q-banner class="bg-primary text-white">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ description }}
      </q-card-section>
    </q-banner>
</template>

<style lang="sass">



</style>