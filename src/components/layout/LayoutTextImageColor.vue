<script lang="ts" setup>
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

const props = defineProps<{
    color: 'charter' | 'commission'

}>()
</script>

<template>
    <div
        :class="`image-text-section bg-${props.color}-light`"
    >
        <div class="container">
            <div>
                <h2>{{ t('directory.subtitle') }}</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                    labore
                    et
                    dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat. Duis aute irure
                    dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                    sint
                    occaecat cupidatat non
                    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </div>
            <img
                :alt="t('directory.image-alt')"
                class="image"
                src="@/assets/img/unistra.jpg"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

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