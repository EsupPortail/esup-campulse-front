<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <q-header elevated height-hint="98">
    <q-toolbar>
      <!--<q-avatar>
        <img src="@/assets/logo.svg" alt="Logo de PlanA">
      </q-avatar>-->
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
</template>

<style lang="sass">
/** Nav **/
nav
  display: flex
  justify-content: flex-end

.li
  color: white
  padding: 0.3em

.li:hover
  background-color: rgba(255, 255, 255, 0.3)
</style>