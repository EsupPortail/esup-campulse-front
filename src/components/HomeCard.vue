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
  <!--<div class="card">
    <a :href="link">
      <img :src="imagePath" :alt="imageAlt" />
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </a>
  </div>-->
  <div class="q-pa-md row items-start q-gutter-md">
    <a :href="link">
      <q-card class="my-card">
        <img :src="imagePath" :alt="imageAlt">

        <q-card-section>
          <div class="text-h6">{{ title }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ description }}
        </q-card-section>
      </q-card>
    </a>
  </div>
</template>

<style lang="sass">
.card
  width: 100%
  max-width: 250px

a
  text-decoration: none
  color: black
</style>