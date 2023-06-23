<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/stores/useUserStore'

const {t} = useI18n()
const userStore = useUserStore()
</script>

<template>
    <section class="page-section">
        <h1>{{ t('404.title') }}</h1>
        <p>{{ t('404.description') }}</p>
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
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/_variables.scss';

.page-section, .page-section * {
    text-align: center;
}

.page-section {
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>


