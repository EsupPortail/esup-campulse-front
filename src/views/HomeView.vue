<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import HomeCard from '@/components/HomeCard.vue'
import { HomeCards, AppTitle } from '#/index'

const Title = ref<AppTitle>('Bienvenue sur la plateforme')

const Cards = ref<HomeCards>([
  {
    title: "Charte des associations du site Alsace",
    description: "Lorem ipsum description",
    imagePath: "@/assets/logo.svg",
    imageAlt: "Logo charte"
  },
  {
    title: "Annuaire des associations",
    description: "Lorem ipsum description",
    imagePath: "@/assets/logo.svg",
    imageAlt: "Logo annuaire"
  },
  {
    title: "Commission d'aide aux projets étudiants",
    description: "Lorem ipsum description",
    imagePath: "@/assets/logo.svg",
    imageAlt: "Logo commissions"
  }
])

</script>

<template>
  <main>
    <Header></Header>
    <h1>{{ Title }}</h1>
    <HomeCard v-for="(Card, index) in Cards"
          :title="Card.title"
          :description="Card.description"
          :imagePath="Card.imagePath"
          :imageAlt="Card.imageAlt"
          :key="index"
    />
    <Footer></Footer>
  </main>
</template>

<style>

</style>