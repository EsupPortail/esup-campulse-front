<script setup lang="ts">
import { ref } from 'vue'
import HomeCard from '@/components/HomeCard.vue'
import type { HomeTitle } from '#/index'
import { useHomeCards } from '@/stores/contentStore'

const homeTitle = ref<HomeTitle>('Bienvenue sur la plateforme')
const store = useHomeCards()
</script>

<template>
  <main>
    <h1>{{ homeTitle }}</h1>
    <section>
      <HomeCard v-for="(card, index) in store.cards"
        :title="card.title"
        :description="card.description"
        :imagePath="card.imagePath"
        :imageAlt="card.imageAlt"
        :link="card.link"
        :key="index"
      />
    </section>
  </main>
</template>

<style lang="sass">
h1
  text-align: center

@media screen and (max-width: 400px)
  h1
    font-size: 2.3em

</style>