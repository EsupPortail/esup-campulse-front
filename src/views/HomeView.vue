<script setup lang="ts">
import { ref } from 'vue'
import {useHomeBanner, useHomeCards} from '@/stores/contentStore'
import HomeCard from '@/components/LayoutHomeCard.vue'
import HomeBanner from "@/components/LayoutHomeBanner.vue";
import type { HomeTitle } from '#/index'


const homeTitle = ref<HomeTitle>('Bienvenue sur la plateforme')
const cards = useHomeCards()
const homeBanner = useHomeBanner()
</script>

<template>
  <main>
    <h1>{{ homeTitle }}</h1>

    <HomeBanner v-if="homeBanner.banner.isDisplayed"
      :title="homeBanner.banner.title"
      :description="homeBanner.banner.description"
    />

    <section>
      <HomeCard v-for="(card, index) in cards.cards"
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

<style scoped lang="sass">
section
  display: flex
  justify-content: center
  padding: 2em
</style>