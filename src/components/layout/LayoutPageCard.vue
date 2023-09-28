<script lang="ts" setup>
const props = defineProps<{
    color: 'charter' | 'commission'
    icon: string,
    text: string,
    btnLabel: string,
    to: { name: string, params?: { associationId: number } }
}>()
</script>

<template>
    <div class="page-card flex-column">
        <div>
            <p v-html="props.text"></p>
        </div>
        <div class="flex-row-center">
            <QBtn
                :color="props.color"
                :icon="props.icon"
                :label="props.btnLabel"
                :to="props.to"
                outline
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.page-card {
    width: $fullSize;

    .q-btn {
        width: $fullSize;
    }
}
</style>