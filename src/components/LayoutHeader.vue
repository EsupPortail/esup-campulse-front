<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUserLoginStore } from '@/stores/loginUserStore'
import LayoutNavProfileButton from "@/components/LayoutNavProfileButton.vue";

const store = useUserLoginStore()
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
        <RouterLink to="/charte">Charte</RouterLink>
        <RouterLink to="/annuaire">Annuaire</RouterLink>
        <RouterLink to="/cape">CAPE</RouterLink>
        <RouterLink to="/login" v-if="!store.user.first_name">Connexion</RouterLink>
        <LayoutNavProfileButton />
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