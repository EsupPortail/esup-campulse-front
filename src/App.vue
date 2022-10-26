<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <q-layout view="hHh lpR fFf">
      <q-header elevated height-hint="98">
        <q-toolbar>
          <q-avatar>
            <img src="@/assets/logo.svg" alt="Logo de PlanA">
          </q-avatar>
          <q-toolbar-title>PlanA</q-toolbar-title>
          <nav>
            <RouterLink to="/">Accueil</RouterLink>
            <RouterLink to="/charte">Charte</RouterLink>
            <RouterLink to="/annuaire">Annuaire</RouterLink>
            <RouterLink to="/cape">CAPE</RouterLink>
            <RouterLink to="/login">Connexion</RouterLink>
          </nav>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <RouterView />
      </q-page-container>
    </q-layout>
</template>

<style lang="sass">
@import "@/assets/base.css"

nav
  display: flex
  justify-content: flex-end

  RouterLink
    padding-right: 10px

.q-layout
  max-width: 1280px
  margin: 0 auto

</style>
