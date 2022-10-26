<script setup lang="ts">
defineProps({
    title: String,
    description: String,
    imagePath: String,
    imageAlt: String
})
</script>

<template>
  <img :src="imagePath" :alt="imageAlt" />
  <h2>{{ title }}</h2>
  <p>{{ description }}</p>
</template>

<style>

</style>