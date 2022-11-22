<script setup lang="ts">
defineProps({
  title: String,
  description: String,
  is_displayed: Boolean
})
</script>

<template>
    <QBanner v-if="is_displayed" class="bg-primary text-white">
      <QCardSection>
        <div class="text-h6">{{ title }}</div>
      </QCardSection>

      <QCardSection class="q-pt-none">
        {{ description }}
      </QCardSection>
    </QBanner>
</template>

<style scoped lang="sass">

</style>
