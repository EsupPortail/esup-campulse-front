<script lang="ts" setup>
const props = defineProps<{
    title: string,
    text: string,
    img: string,
    imgAlt: string
}>()
</script>

<template>
    <div class="image-text-section">
        <div class="container">
            <img
                :alt="props.imageAlt"
                :src="`@/assets/img/${props.img}`"
            />

            <div>
                <h2>{{ props.title }}</h2>
                <p>{{ props.text }}</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.image-text-section {
    padding: 3rem 1rem;

    .container {
        display: flex;
        gap: 3rem;
    }

    img {
        height: 15rem;
    }
}

</style>