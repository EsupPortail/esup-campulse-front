<script lang="ts" setup>
defineProps({
    title: String,
    description: String,
    imagePath: String,
    imageAlt: String,
    link: String
})
</script>

<template>
    <section>
        <div class="q-pa-md row items-start q-gutter-md">
            <RouterLink :to="link">
                <QCard class="card">
                    <img :alt="imageAlt" :src="imagePath">

                    <QCardSection>
                        <div class="text-h6">{{ title }}</div>
                    </QCardSection>

                    <QCardSection class="q-pt-none">
                        {{ description }}
                    </QCardSection>
                </QCard>
            </RouterLink>
        </div>
    </section>
</template>