<script lang="ts" setup>
import FormNewAssociation from '@/components/form/FormNewAssociation.vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
</script>

<template>
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-plus-square"
            ></i>
            {{ t('dashboard.create-association') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <FormNewAssociation/>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
</style>
