<script lang="ts" setup>
import HomeCard from '@/components/layout/LayoutHomeCard.vue'
import HomeBanner from '@/components/layout/LayoutHomeBanner.vue'
import {useHomeContent} from '@/stores/useContentStore'

const home = useHomeContent()
</script>

<template>
    <!-- <h1>{{ t("home.title") }}</h1> -->

    <HomeBanner
        id="home-info-panel"
        :description="home.banner.description"
        :is-displayed="home.banner.isDisplayed"
        :title="home.banner.title"
    />

    <section id="home-sections">
        <HomeCard
            v-for="(card, index) in home.cards"
            :key="index"
            :buttonLabel="card.buttonLabel"
            :cssClass="card.cssClass"
            :description="card.description"
            :iconClass="card.iconClass"
            :imageAlt="card.imageAlt"
            :imagePath="card.imagePath"
            :infoContent="card.infoContent"
            :link="card.link"
            :title="card.title"
            :titleLine1="card.titleLine1"
            :titleLine2="card.titleLine2"
        />
    </section>
</template>

