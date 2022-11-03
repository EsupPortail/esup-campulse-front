<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import LayoutHeaderProfileButton from "@/components/layout/LayoutHeaderProfileButton.vue"

const userStore = useUserStore()
</script>

<template>
  <q-header elevated height-hint="98">
    <q-toolbar>
      <!--<q-avatar>
        <img src="@/assets/logo.svg" alt="Logo de PlanA">
      </q-avatar>-->
      <q-toolbar-title><RouterLink to="/" class="home-link">PlanA</RouterLink></q-toolbar-title>
      <nav>
        <RouterLink to="/">Accueil</RouterLink>
        <RouterLink to="/charter">Charte</RouterLink>
        <RouterLink to="/directory">Annuaire</RouterLink>
        <RouterLink to="/commission">CAPE</RouterLink>
        <RouterLink to="/login" v-if="!userStore.user">Connexion</RouterLink>
        <LayoutHeaderProfileButton />
      </nav>
    </q-toolbar>
  </q-header>
</template>

<style scoped lang="sass">
.home-link
  color: white
  text-decoration: none
  font-size: 2em

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