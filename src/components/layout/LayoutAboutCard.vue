<script lang="ts" setup>
defineProps({
    title: String,
    label: String,
    code: String,
    body: String,
    cssClass: String,
})
</script>


<template>
    <section :class="['home-section', cssClass]">
        <div class="section-card">
            <div class="section-background">
                <span></span>
            </div>

            <div class="section-title">
                <div>
                    <h2>
                        {{ title }}
                    </h2>
                </div>
                <div class="section-info">
                    <p v-html="label"></p>
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