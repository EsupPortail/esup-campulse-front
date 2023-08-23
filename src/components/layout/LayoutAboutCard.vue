<script lang="ts" setup>

const props = defineProps<{
    header: string,
    /*label: string,
    code: string,*/
    body: string,
    cssClass: string
}>()
</script>


<template>
    <section :class="['home-section', 'form-container', props.cssClass]">
        <div class="section-card">
            <div class="section-background">
                <span></span>
            </div>

            <div class="section-title">
                <div class="section-info">
                    <h3 v-html="props.header"></h3>
                </div>
            </div>
            <div class="section-content">
                <p v-html="props.body"></p>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/home.scss';
@import '@/assets/styles/forms.scss';
@import '@/assets/_variables.scss';
</style>
