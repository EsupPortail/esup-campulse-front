<script lang="ts" setup>
import DOMPurify from 'dompurify'

const props = defineProps<{
  header?: string,
  /*label: string,
  code: string,*/
  body?: string,
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
                    <h3 v-html="DOMPurify.sanitize(props.header)"></h3>
                </div>
            </div>
            <div class="section-content">
                <p v-html="DOMPurify.sanitize(props.body)"></p>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/home.scss';
@import '@/assets/styles/forms.scss';
@import '@/assets/_variables.scss';
</style>
