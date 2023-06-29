<script lang="ts" setup>
defineProps({
    title: String,
    description: String,
    isDisplayed: Boolean
})
</script>

<template>
    <div class="container">
        <div
            v-if="isDisplayed"
            class=" flex-row"
        >
            <div
                aria-hidden="true"
                class="home-banner-icon"
            >
                <i class="bi bi-info-circle"></i>
            </div>
            <div>
                <h3><strong>{{ title }}</strong></h3>
                <p>{{ description }}</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/home.scss";
@import "@/assets/_variables.scss";
</style>