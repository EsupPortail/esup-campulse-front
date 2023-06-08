<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import useSecurity from '@/composables/useSecurity'
import DashboardProjectCommissionsManagement from '@/components/dashboard/DashboardProjectCommissionsManagement.vue'

const {t} = useI18n()
const {hasPerm} = useSecurity()

</script>

<template>
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-folder2-open"
            ></i>
            {{ t('commission.on-going') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <DashboardProjectCommissionsManagement/>
            </div>
        </div>
    </section>
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-archive"
            ></i>
            {{ t('commission.archived') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <div class="button-group">
                    <QBtn
                        :label="t('dashboard.manage-archived-projects')"
                        :to="{name: 'ArchivedCommission'}"
                    />
                </div>
            </div>
        </div>
    </section>
    <section
        v-if="hasPerm('change_commissiondate')"
        class="dashboard-section"
    >
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-calendar-check"
            ></i>
            {{ t('commission.dates') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <div class="button-group">
                    <QBtn
                        :label="t('dashboard.manage-commission-dates')"
                        :to="{name: 'ManageCommissionDates'}"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';

.form {
    width: 75% !important;
}
</style>
