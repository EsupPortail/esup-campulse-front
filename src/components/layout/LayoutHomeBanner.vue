<script lang="ts" setup>
defineProps({
    title: String,
    description: String,
    isDisplayed: Boolean
})
</script>

<template>
    <QBanner v-if="isDisplayed" class="bg-primary text-white">
        <QCardSection>
            <div class="text-h6">{{ title }}</div>
        </QCardSection>

        <QCardSection class="q-pt-none">
            {{ description }}
        </QCardSection>
    </QBanner>
</template>

<style lang="sass" scoped>

</style>
