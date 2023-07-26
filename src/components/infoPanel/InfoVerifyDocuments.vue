<script lang="ts" setup>
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
</script>

<template>
    <div class="info-panel info-panel-warning">
        <i
            aria-hidden="true"
            class="bi bi-exclamation-lg"
        ></i>
        <p>{{ t('project.document.verify') }}</p>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
</style>