<script lang="ts" setup>
import DOMPurify from 'dompurify'

const props = defineProps<{
  header?: string,
  body?: string,
  cssClass: string
}>()
</script>


<template>
    <section :class="['services-section', 'home-section', props.cssClass]">
        <div :class="['section-card', 'service-card']">
            <div class="flex-column">
                <div
                    aria-hidden="true"
                    class="card-icon"
                >
                    <i class="bi bi-filter-circle"></i>
                </div>

                <h3 v-html="DOMPurify.sanitize(props.header)"></h3>

                <div class="section-content">
                    <p v-html="DOMPurify.sanitize(props.body)"></p>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/home.scss';

h3 {
  text-align: center;
}

section > div {
  flex-direction: row !important;
  height: 100%;
  width: 100%;
}

.flex-column {
  width: 100%;
}
</style>
