<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/stores/useUserStore'

const {t} = useI18n()
const userStore = useUserStore()
</script>

<template>
    <section class="page-section">
        <h1 class="title-1">{{ t('404.title') }}</h1>
        <p class="paragraph">{{ t('404.description') }}</p>
        <div class="btn-group">
            <QBtn
                :label="t('back-to-home')"
                :to="{name: 'Home'}"
                icon="mdi-home-outline"
            />
            <QBtn
                v-if="userStore.isAuth"
                :label="t('back-to-dashboard')"
                :to="{name: 'Dashboard'}"
                icon="mdi-account"
            />
        </div>
    </section>
</template>

<style lang="scss">
@import '@/assets/styles/forms.scss';
</style>

<style lang="sass" scoped>
.page-section, .page-section *
    text-align: center

.page-section
    margin-top: 3rem
    display: flex
    flex-direction: column
    gap: 1rem
</style>


