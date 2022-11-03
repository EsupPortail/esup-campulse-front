<script setup lang="ts">
defineProps({
  title: String,
  description: String,
  is_displayed: Boolean
})
</script>

<template>
    <q-banner v-if="is_displayed" class="bg-primary text-white">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ description }}
      </q-card-section>
    </q-banner>
</template>

<style scoped lang="sass">

</style>