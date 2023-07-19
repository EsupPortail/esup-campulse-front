<script lang="ts" setup>
import LayoutHeaderProfileButton from '@/components/layout/LayoutHeaderProfileButton.vue'
import {useUserStore} from '@/stores/useUserStore'
import {useI18n} from 'vue-i18n'

const userStore = useUserStore()
const {t} = useI18n()

const props = defineProps<{
    device: 'mobile' | 'desktop'
}>()
</script>

<template>
    <nav
        :aria-label="t('primary-nav')"
        :class="`${props.device === 'desktop' ? 'flex-row-right' : 'flex-column'} ${props.device}`"
        role="navigation"
    >
        <ul class="flex-row-center-md">
            <li>
                <RouterLink :to="{name: 'Home'}">{{ t('header.home') }}</RouterLink>
            </li>
            <li>
                <RouterLink
                    :to="{name: 'Associations'}"
                    class="space-1"
                >
                    {{ t('header.associations') }}
                </RouterLink>
            </li>
            <li>
                <RouterLink
                    :to="{name: 'Charter'}"
                    class="space-2"
                >
                    {{ t('header.charter') }}
                </RouterLink>
            </li>
            <li>
                <RouterLink
                    :to="{name: 'Commission'}"
                    class="space-3"
                >
                    {{ t('header.commission') }}
                </RouterLink>
            </li>
            <li>
                <RouterLink
                    :to="{name: 'About'}"
                    class="space-1"
                >
                    {{ t('header.about') }}
                </RouterLink>
            </li>
            <li>
                <RouterLink
                    :to="{name: 'Contact'}"
                    class="space-1"
                >
                    {{ t('header.contact') }}
                </RouterLink>
            </li>
            <li>
                <RouterLink
                    v-if="!userStore.isAuth"
                    :to="{name: 'Login'}"
                >
                    {{ t('header.login') }}
                </RouterLink>
            </li>
            <li>
                <LayoutHeaderProfileButton
                    v-if="userStore.isAuth"
                    class="profile-button"
                />
            </li>
        </ul>
    </nav>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/header.scss';
@import "@/assets/_variables.scss";

nav.mobile a {
    color: $textColor1 !important;
}

.flex-column {
    align-items: flex-end;
    gap: 2.5rem;
    padding: 1rem 0 1rem 0;
}

nav.desktop {
    display: block;

    @media only screen and (max-width: 830px) {
        display: none;
    }
}
</style>
