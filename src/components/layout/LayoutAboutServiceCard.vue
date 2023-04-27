<script lang="ts" setup>
defineProps({
    header: String,
    footer: String,
    label: String,
    code: String,
    body: String,
})
</script>


<template>
    <div class="card-item">
        <div class="section-card">
            <div class="section-background">
                <span></span>
            </div>

            <div class="card-icon">
                <i class="bi bi-filter-circle"></i>
            </div>

            <div class="section-title">
                <h4 v-html="header"></h4>
            </div>

            <div class="section-content">
                {{ body }}
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '@/assets/styles/home.scss';
@import '@/assets/_variables.scss';

.section-title {
    h4 {
        font-size: 2rem;
        line-height: 3rem;
        text-transform: uppercase;
        font-weight: $semibold-weight;
    }
}
</style>