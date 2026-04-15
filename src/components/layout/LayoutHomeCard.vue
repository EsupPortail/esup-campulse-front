<script lang="ts" setup>
import DOMPurify from 'dompurify'
import {computed} from 'vue'

const props = defineProps<{
  description: string,
  link: string,
  cssClass: string,
  buttonLabel: string,
  infoContent: string,
  titleLine1: string,
  titleLine2: string,
  iconClass: string
}>()

const infoContent = computed(() => {
    return DOMPurify.sanitize(props.infoContent)
})

const description = computed(() => {
    return DOMPurify.sanitize(props.description)
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
                    <span>{{ titleLine2 }}</span>
                </h2>

                <div class="section-info">
                    <p v-html="infoContent"></p>
                </div>
            </div>

            <div class="section-content">
                <p v-html="description"></p>
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

h2 {
  line-height: 1.4;
}
</style>
