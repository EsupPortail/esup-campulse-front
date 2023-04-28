<script lang="ts" setup>
defineProps({
    header: String,
    label: String,
    code: String,
    body: String,
    cssClass: String
})
</script>


<template>
    <section :class="['home-section', 'form-container', cssClass]">
        <div class="section-card">
            <div class="section-background">
                <span></span>
            </div>

            <div class="section-title">
                <div class="section-info">
                    <p v-html="header"></p>
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
@import '@/assets/styles/forms.scss';
@import '@/assets/_variables.scss';

.section-title {
    p {
        font-size: 2.5rem;
        font-weight: $semibold-weight;
        line-height: 3rem;
    }
}
</style>