<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import HomeCard from '@/components/HomeCard.vue'
import { HomeCards, AppTitle } from '#/index'
import { useHomeCards } from '@/stores/homeCards'

const title = ref<AppTitle>('Bienvenue sur la plateforme')
const cards = useHomeCards()
</script>

<template>
  <main>
    <Header></Header>
    <h1>{{ title }}</h1>
    <HomeCard v-for="(card, index) in cards"
      :title="card.title"
      :description="card.description"
      :imagePath="card.imagePath"
      :imageAlt="card.imageAlt"
      :key="index"
    />
    <Footer></Footer>
  </main>
</template>

<style>

</style>