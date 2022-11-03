<script setup lang="ts">
import { ref } from 'vue'
import {useHomeBanner, useHomeCards} from '@/stores/useContentStore'
import HomeCard from '@/components/layout/LayoutHomeCard.vue'
import HomeBanner from "@/components/layout/LayoutHomeBanner.vue";
import type { HomeTitle } from '#/index'


const homeTitle = ref<HomeTitle>('Bienvenue sur la plateforme')
const cards = useHomeCards()
const homeBanner = useHomeBanner()
</script>

<template>
    <h1>{{ homeTitle }}</h1>

    <HomeBanner
      :title="homeBanner.banner.title"
      :description="homeBanner.banner.description"
      :is_displayed="homeBanner.banner.isDisplayed"
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
</template>

<style scoped lang="sass">
section
  display: flex
  justify-content: center
  padding: 2em
</style>