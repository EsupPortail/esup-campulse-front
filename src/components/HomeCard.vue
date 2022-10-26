<script setup lang="ts">
defineProps({
  title: String,
  description: String,
  imagePath: String,
  imageAlt: String,
  link: String
})
</script>

<template>
  <div class="card">
    <a :href="link">
      <img :src="imagePath" :alt="imageAlt" />
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </a>
  </div>
</template>

<style>

</style>