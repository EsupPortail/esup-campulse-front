<script lang="ts" setup>
const props = defineProps<{
    title?: string,
    text?: string,
    img: string,
    copyright?: string
}>()
</script>

<template>
    <div class="image-text-section">
        <div class="container">
            <figure>
                <img
                    :src="props.img"
                    alt=""
                />
                <figcaption v-if="props.copyright">{{ props.copyright }}</figcaption>
            </figure>
            <div>
                <h2 v-html="props?.title"></h2>
                <p v-html="props?.text"></p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.image-text-section {
    padding: 3rem 1rem;
    margin: 2rem 0;

    .container {
        display: flex;
        gap: 3rem;

        img {
            height: 15rem;
        }
    }
}

@media screen and (max-width: $breakpoint-lg) {
    .container {
        flex-wrap: wrap;
    }
}

/* Changing the page's position to fit with the Accessibility Requirement */
@media screen and (min-width: $breakpoint-vsm) {
    .container {
        display: flex;
        flex-direction: column;
    }
}

@media screen and (min-width: $breakpoint-md) {
    .container {
        display: flex;
        flex-direction: row;
    }
}
</style>
