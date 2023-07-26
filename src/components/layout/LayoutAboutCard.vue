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
                    <h3 v-html="header"></h3>
                </div>
            </div>
            <div class="section-content">
                <p v-html="body"></p>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
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
