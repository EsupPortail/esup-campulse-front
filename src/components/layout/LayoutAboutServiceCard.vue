<script lang="ts" setup>
defineProps({
    header: String,
    footer: String,
    label: String,
    code: String,
    body: String,
    cssClass: String
})
</script>


<template>
    <section :class="['services-section', 'home-section', cssClass]">
        <div :class="['section-card', 'service-card']">
            <div>
                <div
                    aria-hidden="true"
                    class="card-icon"
                >
                    <i class="bi bi-filter-circle"></i>
                </div>

                <div :class="['section-title', 'services-title']">
                    <h4 v-html="header"></h4>
                </div>

                <div class="section-content">
                    {{ body }}
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/home.scss';
</style>
