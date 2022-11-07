<script setup lang="ts">
import LayoutHeaderProfileButton from '@/components/layout/LayoutHeaderProfileButton.vue'
import { useUserStore } from '@/stores/useUserStore'

const userStore = useUserStore()
</script>

<template>
  <nav>
    <RouterLink to="/">Accueil</RouterLink>
    <RouterLink to="/charter">Charte</RouterLink>
    <RouterLink to="/directory">Annuaire</RouterLink>
    <RouterLink to="/commission">CAPE</RouterLink>
    <RouterLink to="/login" v-if="!userStore.isAuth">Connexion</RouterLink>
    <LayoutHeaderProfileButton  v-if="userStore.isAuth"/>
  </nav>
</template>

<style scoped lang="sass">
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