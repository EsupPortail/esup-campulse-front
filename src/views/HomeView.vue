<script lang="ts" setup>
import HomeCard from '@/components/layout/LayoutHomeCard.vue'
import HomeBanner from '@/components/layout/LayoutHomeBanner.vue'
import {useHomeContent} from '@/stores/useContentStore'
import {useI18n} from "vue-i18n";

const home = useHomeContent()
const {t} = useI18n()
</script>

<template>
    <!-- <h1>{{ t("home.title") }}</h1> -->

    <HomeBanner
        :description="home.banner.description"
        :is-displayed="home.banner.isDisplayed"
        :title="home.banner.title"
        id="home-info-panel"
    />

    <section id="home-sections">
        <HomeCard v-for="(card, index) in home.cards"
                  :key="index"
                  :description="card.description"
                  :imageAlt="card.imageAlt"
                  :imagePath="card.imagePath"
                  :link="card.link"
                  :title="card.title" 
                  :cssClass="card.cssClass"
                  :buttonLabel="card.buttonLabel"
                  :infoContent="card.infoContent"
                  :titleLine1="card.titleLine1"
                  :titleLine2="card.titleLine2"
                  :iconClass="card.iconClass"
        />
    </section>
</template>

