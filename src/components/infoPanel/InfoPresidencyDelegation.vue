<script lang="ts" setup>
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
</script>

<template>
    <div class="info-panel info-panel-warning">
        <i
            aria-hidden="true"
            class="bi bi-info"
        ></i>
        <p>
            {{ t('dashboard.association-user.delegate-presidency-info.message') }}
        </p>
        <ul>
            <li>
                {{ t('dashboard.association-user.delegate-presidency-info.perm-1') }}
            </li>
            <li>
                {{ t('dashboard.association-user.delegate-presidency-info.perm-2') }}
            </li>
            <li>
                {{ t('dashboard.association-user.delegate-presidency-info.perm-3') }}
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/dashboard.scss";
@import "@/assets/styles/forms.scss";
</style>