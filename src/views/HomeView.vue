<script setup lang="ts">
import HomeCard from '@/components/layout/LayoutHomeCard.vue'
import HomeBanner from '@/components/layout/LayoutHomeBanner.vue'
import { useHomeContent } from '@/stores/useContentStore'

const home = useHomeContent()
</script>

<template>
    <h1>{{ $t("home.title") }}</h1>

    <HomeBanner
      :title="home.banner.title"
      :description="home.banner.description"
      :is_displayed="home.banner.isDisplayed"
    />

    <section>
      <HomeCard v-for="(card, index) in home.cards"
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
