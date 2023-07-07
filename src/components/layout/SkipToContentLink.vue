<script lang="ts" setup>
import {ref, watch} from 'vue'
import {useRoute} from 'vue-router'

const route = useRoute()
const skipLink = ref()

watch(
    () => route.path,
    () => {
        skipLink.value.focus()
    }
)
</script>

<template>
    <div
        ref="skipLink"
        tabindex="-1"
    ></div>
    <a
        class="skip-link"
        href="#main"
    >
        Aller au contenu
    </a>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

/*a {
    color: $textColor1;
    background-color: #fff;
    text-decoration: none;
    display: inline-block;
    padding: 0.5em;
    position: absolute;
    left: -99999rem;
    z-index: 99999;
}

a:focus {
    left: 0;
}*/

.skip-link {
    white-space: nowrap;
    top: 0;
    position: absolute;
    color: $textColor1;
    left: -99rem;
    background-color: #fff;
    text-decoration: none;
    display: inline-block;
    padding: 0.5em;
    margin: 1em;
    z-index: 99999;
}

.skip-link:focus {
    left: 0;
}
</style>