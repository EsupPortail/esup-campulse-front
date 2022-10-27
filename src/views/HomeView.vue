<script setup lang="ts">
import { ref } from 'vue'
import HomeCard from '@/components/HomeCard.vue'
import type { HomeTitle } from '#/index'
import {useHomeBanner, useHomeCards} from '@/stores/contentStore'
import HomeBanner from "@/components/HomeBanner.vue";

const homeTitle = ref<HomeTitle>('Bienvenue sur la plateforme')
const store = useHomeCards()
const homeBanner = useHomeBanner()
</script>

<template>
  <main>
    <h1>{{ homeTitle }}</h1>

    <HomeBanner
      :title="homeBanner.banner.title"
      :description="homeBanner.banner.description"
    />

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

</style>