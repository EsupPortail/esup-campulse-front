<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/stores/useUserStore'

const {t} = useI18n()
const userStore = useUserStore()
</script>

<template>
    <section class="dashboard-section">
        <h2 class="flex-row-center">
            <i class="bi bi-exclamation-triangle"></i>
            {{ t('error-404.title') }}
        </h2>

        <div class="dashboard-section-container">
            <div class="container">
                <p class="flex-row-center">{{ t('error-404.description') }}</p>

                <div class="flex-row-center padding-top padding-bottom">
                    <QBtn
                        :label="t('back-to-home')"
                        :to="{name: 'Home'}"
                        class="btn-lg"
                        color="association"
                        icon="bi-house"
                    />
                    <QBtn
                        v-if="userStore.isAuth"
                        :label="t('back-to-dashboard')"
                        :to="{name: 'Dashboard'}"
                        class="btn-lg"
                        color="association"
                        icon="bi-person-circle"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/_variables.scss';
@import '@/assets/styles/dashboard.scss';
</style>

