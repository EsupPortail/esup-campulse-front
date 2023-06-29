<script lang="ts" setup>
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

const props = defineProps<{
    color: 'dashboard' | 'charter'
}>()
</script>

<template>
    <div class="info-panel">
        <i
            aria-hidden="true"
            class="bi bi-info"
        ></i>
        <p>
            {{ t('dashboard.template-document-library-info-message') }}
        </p>
        <div class="btn-group">
            <QBtn
                :color="props.color"
                :label="t('dashboard.template-document-library')"
                :to="{name: 'DocumentsLibrary'}"
                class="btn-lg"
                outline
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/dashboard.scss";
@import "@/assets/styles/forms.scss";
@import "@/assets/_variables.scss";
</style>