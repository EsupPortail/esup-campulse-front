<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import type {CharterStatus} from '#/charters'
import {onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'

const props = defineProps<{
    charterStatus: CharterStatus
}>()

const {t} = useI18n()
const route = useRoute()

const spanClasses = ref('')

const initSpanClasses = () => {
    spanClasses.value = 'form-state' + ' ' + (route.name === 'CharterDashboard' ? 'form-state-charter' : '')
}

onMounted(initSpanClasses)

</script>

<template>
    <span
        v-if="props.charterStatus === 'NOT_SITE'"
        :class="spanClasses"
    >
        {{ t('charter.status.not-site') }}
    </span>
    <span
        v-if="props.charterStatus === 'NO_CHARTER'"
        :class="spanClasses"
    >
        {{ t('charter.status.no-charter') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-grey"
        ><i class="bi bi-dash"></i></span>
    </span>
    <span
        v-if="props.charterStatus === 'VALIDATED'"
        :class="spanClasses"
    >
        {{ t('charter.status.validated') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-green"
        ><i class="bi bi-check"></i></span>
    </span>
    <span
        v-if="props.charterStatus === 'EXPIRED'"
        :class="spanClasses"
    >
        {{ t('charter.status.expired') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-red"
        ><i class="bi bi-x"></i></span>
    </span>
    <span
        v-if="props.charterStatus === 'PROCESSING'"
        :class="spanClasses"
    >
        {{ t('charter.status.processing') }}
        <span
            aria-hidden="true"
            class="form-state-icon form-state-orange"
        ><i class="bi bi-dash"></i></span>
    </span>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
</style>