<script lang="ts" setup>
import LayoutHeaderProfileButton from '@/components/layout/LayoutHeaderProfileButton.vue'
import {useUserStore} from '@/stores/useUserStore'

const userStore = useUserStore()
</script>

<template>
  <nav>
    <RouterLink to="/">{{ $t("header.home") }}</RouterLink>
    <RouterLink to="/charter">{{ $t("header.charter") }}</RouterLink>
    <RouterLink to="/directory">{{ $t("header.directory") }}</RouterLink>
    <RouterLink to="/commission">{{ $t("header.commission") }}</RouterLink>
    <RouterLink v-if="!userStore.isAuth" to="/login">{{ $t("header.login") }}
    </RouterLink>
    <LayoutHeaderProfileButton v-if="userStore.isAuth"/>
  </nav>
</template>

<style lang="sass" scoped>
nav
  display: flex
  justify-content: flex-end

nav > *
  color: white
  padding: 0.3em
  text-decoration: none
  font-size: 1.8em

nav > *:hover
  background-color: rgba(255, 255, 255, 0.3)

</style>
