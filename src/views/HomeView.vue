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

    <section>
        <HomeCard v-for="(card, index) in home.cards"
                  :key="index"
                  :description="card.description"
                  :imageAlt="card.imageAlt"
                  :imagePath="card.imagePath"
                  :link="card.link"
                  :title="card.title" 
                  :cssClass="card.cssClass"
                  :buttonLabel="card.buttonLabel"
        />
    </section>
</template>

