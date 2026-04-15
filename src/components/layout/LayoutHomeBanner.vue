<script lang="ts" setup>
import DOMPurify from 'dompurify'
import {computed} from 'vue'

const props = defineProps<{
  title: string,
  description: string,
}>()

const sanitizedTitle = computed(() => {
    return DOMPurify.sanitize(props.title)
})

const sanitizedDescription = computed(() => {
    return DOMPurify.sanitize(props.description)
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
                <h3><strong v-html="sanitizedTitle"></strong></h3>
                <p v-html="sanitizedDescription"></p>
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