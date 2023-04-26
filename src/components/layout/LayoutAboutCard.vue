<script lang="ts" setup>
defineProps({
    header: String,
    label: String,
    code: String,
    body: String,
})
</script>


<template>
    <section :class="['home-section', cssClass]">
        <div class="section-card">
            <div class="section-background">
                <span></span>
            </div>

            <div class="section-title">
                <div class="section-info">
                    <h2 v-html="header"></h2>
                </div>
            </div>
            <div class="section-content">
                <p>{{ body }}</p>
            </div>
        </div>
    </section>
</template>

<style lang="scss">
@import '@/assets/styles/home.scss';
</style>