<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import type {CharterStatus} from '#/charters'

const props = defineProps<{
    charterStatus: CharterStatus
}>()

const {t} = useI18n()

</script>

<template>
    <span
        v-if="props.charterStatus === 'NO_CHARTER'"
    >
        {{ t('charter.status.no-charter') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-grey"
        ><i class="bi bi-dash"></i></span>
    </span>
    <span
        v-if="props.charterStatus === 'VALIDATED'"
    >
        {{ t('charter.status.validated') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-green"
        ><i class="bi bi-check"></i></span>
    </span>
    <span
        v-if="props.charterStatus === 'EXPIRED'"
    >
        {{ t('charter.status.expired') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-red"
        ><i class="bi bi-x"></i></span>
    </span>
    <span
        v-if="props.charterStatus === 'PROCESSING'"
    >
        {{ t('charter.status.processing') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-orange"
        ><i class="bi bi-dash"></i></span>
    </span>
</template>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
</style>