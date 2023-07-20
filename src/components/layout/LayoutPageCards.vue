<script lang="ts" setup>
import LayoutPageCard from '@/components/layout/LayoutPageCard.vue'
import type {PageCard} from '#/index'

const props = defineProps<{
    color: 'charter' | 'commission',
    pageCards: PageCard[]
}>()
</script>

<template>
    <div
        :style="`background-image: url('./src/assets/img/resized/background-${props.color === 'charter' ? 'charte' : 'cape'}.jpg');`"
        class="page-card-container"
    >
        <div class="container">
            <LayoutPageCard
                v-for="(card, index) in props.pageCards"
                :key="index"
                :btn-label="card.btnLabel"
                :color="props.color"
                :icon="card.icon"
                :text="card.text"
                :to="card.to"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.page-card-container {
    background-position: center center;
    padding: 3rem 0;
    margin: 5rem 0 6rem 0;

    div {
        padding: 3rem;
        display: flex;
        gap: 3rem;
        justify-content: center;
        background-color: #fff;
        border-radius: 1rem;
    }
}
</style>
