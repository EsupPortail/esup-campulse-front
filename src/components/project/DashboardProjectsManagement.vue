<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import DashboardProjectCommissionsManagement from '@/components/project/DashboardProjectCommissionsManagement.vue'

const {t} = useI18n()

</script>

<template>
    <div class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-folder"
            ></i>
            {{ t('commission.on-going') }}
        </h2>
        <div class="dashboard-section-container">
            <DashboardProjectCommissionsManagement/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';
</style>
