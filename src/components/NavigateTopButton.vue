<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

onMounted(async function () {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(async function () {
    window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
    const main = document.getElementsByTagName('main')[0] as HTMLElement
    if (!main) return
    const scrollRect = main.getBoundingClientRect()
    buttonVisible.value = scrollRect.y < 0
}

function scrollToTop() {
    document.body.scrollTop = document.documentElement.scrollTop = 0
}

const buttonVisible = ref(false)
</script>

<template>
    <div
        class="navigate-top-button"
        :class="{ 'visible': buttonVisible }"
    >
        <button
            :title="t('page-top')"
            @click="scrollToTop"
        >
            <i
                aria-hidden="true"
                class="bi bi-arrow-up-short"
            ></i>
        </button>
    </div>
</template>
