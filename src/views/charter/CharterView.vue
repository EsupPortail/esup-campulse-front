<script lang="ts" setup>
import LayoutImageText from '@/components/layout/LayoutImageText.vue'
import LayoutTextImageColor from '@/components/layout/LayoutTextImageColor.vue'
import LayoutPageCards from '@/components/layout/LayoutPageCards.vue'
</script>

<template>
    <section>
        <LayoutImageText
            img="unistra.jpg"
            img-alt=""
            text="Pour les associations du site Alsace"
            title="Charte du site Alsace"
        />
        <LayoutTextImageColor
            color="charter"
            img="unistra.jpg"
            img-alt=""
            text="Pour les demandes d'agrément"
            title="Chartes FSDIE/IdEx"
        />
        <LayoutPageCards/>
    </section>
</template>
