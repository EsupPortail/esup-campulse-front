<script lang="ts" setup>
import LayoutPageCard from '@/components/layout/LayoutPageCard.vue'
import type {PageCard} from '#/index'
import CharterBackgroundImage from '@/assets/img/background-charter.jpg'
import CommissionBackgroundImage from '@/assets/img/background-cape.jpg'


const props = defineProps<{
    color: 'charter' | 'commission',
    pageCards: PageCard[]
}>()
</script>

<template>
    <div
        :style="`background-image: url(\'${props.color === 'charter' ? CharterBackgroundImage : CommissionBackgroundImage}\');`"
        class="page-card-container"
    >
        <div class="container">
            <LayoutPageCard
                v-for="(card, index) in props.pageCards"
                :key="index"
                :btn-label="card.btnLabel ? card.btnLabel : ''"
                :color="props.color"
                :icon="card.icon"
                :text="card.text ? card.text : ''"
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
        padding: 2rem;
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
        justify-content: space-around;
        background-color: #fff;
        border-radius: 1rem;
    }

    div > * {
        width: 40rem;
    }
}
</style>
