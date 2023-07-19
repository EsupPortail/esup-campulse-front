<script lang="ts" setup>
defineProps({
    title: String,
    description: String,
    imagePath: String,
    imageAlt: String,
    link: {
        type: String,
        required: true
    },
    cssClass: String,
    buttonLabel: String,
    infoContent: String,
    titleLine1: String,
    titleLine2: String,
    iconClass: String
})
</script>

<template>
    <section :class="['home-section', cssClass]">
        <div class="section-card">
            <div class="section-background">
                <span></span>
            </div>

            <div class="section-title">
                <h2 :aria-label="titleLine1 + ' ' + titleLine2">
                    <span>
                        {{ titleLine1 }}
                        <span
                            aria-hidden="true"
                            class="section-icon"
                        >
                            <span><i :class="[ iconClass ]"></i></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </span>
                    <p>{{ titleLine2 }}</p>
                </h2>

                <div class="section-info">
                    <p v-html="infoContent"></p>
                </div>
            </div>

            <div class="section-content">
                <p>{{ description }}</p>
                <div class="section-buttons">
                    <RouterLink :to="link">
                        {{ buttonLabel }} <i
                            aria-hidden="true"
                            class="bi bi-chevron-compact-right"
                        ></i>
                    </RouterLink>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/home.scss';
</style>
