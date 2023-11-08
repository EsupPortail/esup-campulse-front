<script lang="ts" setup>
defineProps({
    title: String,
    description: String,
})
</script>

<template>
    <div class="container">
        <div class="flex-row">
            <div
                aria-hidden="true"
                class="home-banner-icon"
            >
                <i class="bi bi-info-circle"></i>
            </div>
            <div>
                <h3><strong v-html="title"></strong></h3>
                <p v-html="description"></p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/home.scss";
@import "@/assets/_variables.scss";

.flex-row {
    align-items: start;
    gap: 2rem;
}
</style>