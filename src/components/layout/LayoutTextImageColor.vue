<script lang="ts" setup>
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

const props = defineProps<{
    color: 'charter' | 'commission'
    title: string,
    text: string,
    img: string,
    imgAlt: string
}>()
</script>

<template>
    <div
        :class="`image-text-section bg-${props.color}-light`"
    >
        <div class="container">
            <div>
                <h2>{{ props.title }}</h2>
                <p>{{ props.text }}</p>
            </div>
            <img
                :alt="t('directory.image-alt')"
                src="@/assets/img/unistra.jpg"
            />
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

        div {
            flex-grow: 3;
        }

        img {
            height: 15rem;
        }
    }
}

</style>