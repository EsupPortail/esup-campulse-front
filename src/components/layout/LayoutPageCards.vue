<script lang="ts" setup>
import LayoutPageCard from '@/components/layout/LayoutPageCard.vue'
</script>

<template>
    <div class="page-card-container">
        <div class="container">
            <LayoutPageCard
                :to="{name: 'ManageCharters'}"
                btn-label="Gérer et signer vos chartes"
                color="charter"
                icon="bi-pencil"
                text="Lorem ipsum"
            />
            <LayoutPageCard
                :to="{name: 'DocumentsLibrary'}"
                btn-label="Télécharger les documents"
                color="charter"
                icon="bi-download"
                text="Lorem ipsum"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.page-card-container {
    background-image: url("@/assets/img/resized/background-charte.jpg");
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
        flex-wrap: wrap;
    }
}
</style>
