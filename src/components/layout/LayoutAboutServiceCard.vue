<script lang="ts" setup>

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

                <h3 v-html="props.header"></h3>

                <div class="section-content">
                    <p v-html="props.body"></p>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/home.scss';

h3 {
    text-align: left;
}
</style>
