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
                <div class="card-icon">
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

<style lang="scss">
@import '@/assets/styles/home.scss';
@import '@/assets/_variables.scss';

.home-section {
    .section-title {
        h4 {
            text-align: center;
            font-weight: $semibold-weight;
        }
    }
}

</style>