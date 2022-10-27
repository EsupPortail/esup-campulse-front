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
            <RouterLink to="/" class="li">Accueil</RouterLink>
            <RouterLink to="/charte" class="li">Charte</RouterLink>
            <RouterLink to="/annuaire" class="li">Annuaire</RouterLink>
            <RouterLink to="/cape" class="li">CAPE</RouterLink>
            <RouterLink to="/login" class="li">Connexion</RouterLink>
          </nav>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <RouterView />
      </q-page-container>

      <q-footer elevated>
        <q-toolbar>
          <q-toolbar-title class="test">2017 - 2022 - PLATEFORME - Tous droits réservés</q-toolbar-title>
          <RouterLink to="/" class="li">A propos</RouterLink>
          <RouterLink to="/" class="li">Mentions légales</RouterLink>
          <RouterLink to="/" class="li">Contact</RouterLink>

        </q-toolbar>
      </q-footer>

    </q-layout>
</template>

<style lang="sass">
@import "@/assets/base.css"

nav
  display: flex
  justify-content: flex-end

.li
  color: white
  padding: 1em

.li:hover
  background-color: rgba(255, 255, 255, 0.3)

.q-layout
  max-width: 1280px
  margin: 0 auto

q-footer

  .test
    display: flex
    justify-content: center

</style>
