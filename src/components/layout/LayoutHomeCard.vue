<script lang="ts" setup>
defineProps({
    title: String,
    description: String,
    imagePath: String,
    imageAlt: String,
    link: String,
    backgroundImagePath: String,
    cssClass: String,
    buttonLabel: String
})
</script>

<template>
    <section :class="['home-section', cssClass]">
        <!-- <div class="q-pa-md row items-start q-gutter-md">
            <RouterLink :to="link">
                <QCard class="card">
                    <img :alt="imageAlt" :src="imagePath">

                    <QCardSection>
                        <div class="text-h6">{{ title }}</div>
                    </QCardSection>

                    <QCardSection class="q-pt-none">
                        {{ description }}
                    </QCardSection>
                </QCard>
            </RouterLink>
        </div> -->
        <div class="section-card">
            <div class="section-background"><span></span></div>
            <div class="section-title">
                <div v-html="title"></div>
            </div>
            <div class="section-content">
                <p>{{ description }}</p>
                <div class="section-buttons">
                    <RouterLink :to="link">{{ buttonLabel }} <i class="bi bi-chevron-compact-right"></i></RouterLink>
                </div>
            </div>
        </div>
    </section>
</template>