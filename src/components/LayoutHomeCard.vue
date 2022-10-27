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
  <section>
    <div class="q-pa-md row items-start q-gutter-md">
      <a :href="link">
        <q-card class="card">
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
  </section>
</template>

<style scoped lang="sass">
.card
  width: 100%
  min-height: 25em
  max-width: 250px

a
  text-decoration: none
  color: black

@media screen and (max-width: 450px)

  section
    display: block

  .card
    width: 100%
    min-height: 23em
</style>