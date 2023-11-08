<script lang="ts" setup>
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
</script>

<template>
    <div class="info-panel">
        <i
            aria-hidden="true"
            class="bi bi-info"
        ></i>
        <p>
            {{ t('forms.required-fields') }}
        </p>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/dashboard.scss";
@import "@/assets/styles/forms.scss";
@import "@/assets/_variables.scss";
</style>