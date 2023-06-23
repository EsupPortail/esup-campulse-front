<script lang="ts" setup>
defineProps({
    title: String,
    description: String,
    isDisplayed: Boolean
})
</script>

<template>
    <div class="container">
        <section
            v-if="isDisplayed"
        >
            <div
                id="home-banner-icon"
                aria-hidden="true"
                class="variant-default"
            >
                <i class="bi bi-info-circle"></i>
            </div>
            <div>
                <h3 class="title-3"><strong>{{ title }}</strong></h3>
                <p class="paragraph">{{ description }}</p>
            </div>
        </section>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/home.scss";
@import "@/assets/_variables.scss";

section {
    display: flex;
    gap: 1rem;
    padding-top: 1rem;
    max-width: $pageWidth;
    width: $fullSize;
    margin: auto;
}
</style>