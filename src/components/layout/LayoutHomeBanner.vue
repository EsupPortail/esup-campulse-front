<script lang="ts" setup>
defineProps({
  title: String,
  description: String,
  isDisplayed: Boolean
})
</script>

<template>
  <QBanner v-if="isDisplayed" class="bg-primary text-white">
    <div id="home-banner-icon" class="variant-default">
      <i class="bi bi-info-circle"></i>
    </div>

    <QCardSection>
      <div class="text-h6">{{ title }}</div>
    </QCardSection>

    <QCardSection class="q-pt-none">
      {{ description }}
    </QCardSection>

    <QCardSection class="q-pt-none">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat.
    </QCardSection>
  </QBanner>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.text-h6 {
  font-weight: $xbold-weight;
}
</style>
