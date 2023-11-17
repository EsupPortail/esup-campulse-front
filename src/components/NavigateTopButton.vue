<script lang="ts" setup>
import {onMounted, onUnmounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import useUtility from '@/composables/useUtility'

const {t} = useI18n()
const {openMenu} = useUtility()

const buttonVisible = ref(false)
watch(() => openMenu.value, () => {
    buttonVisible.value = !openMenu.value
})

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
</script>

<template>
    <div
        :class="{ 'visible': buttonVisible }"
        class="navigate-top-button"
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
