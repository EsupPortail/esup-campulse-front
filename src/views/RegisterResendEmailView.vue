<script lang="ts" setup>
import FormResendEmail from '@/components/form/FormResendEmail.vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
</script>

<template>
    <section class="dashboard-section">
        <div class="dashboard-section-container">
            <div class="container">
                <FormResendEmail/>
            </div>
        </div>
    </section>
</template>
