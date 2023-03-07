<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue'

onMounted(async function () {
    window.addEventListener('scroll', handleScroll);
})

onUnmounted(async function () {
    window.removeEventListener('scroll', handleScroll);
})

function handleScroll() {
    const main = document.getElementsByTagName('main')[0] as HTMLElement;
    if (!main) return;
    const scrollRect = main.getBoundingClientRect();
    buttonVisible.value = scrollRect.y < 0;
}

function scrollToTop() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
}

const buttonVisible = ref(false);
</script>

<template>
    <div class="navigate-top-button" :class="{ 'visible': buttonVisible }">
        <button @click="scrollToTop">
            <i class="bi bi-arrow-up-short"></i>
        </button>
    </div>
</template>