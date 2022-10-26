<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Accueil</RouterLink>
        <RouterLink to="/charte">Charte</RouterLink>
        <RouterLink to="/annuaire">Annuaire</RouterLink>
        <RouterLink to="/cape">CAPE</RouterLink>
        <RouterLink to="/login">Connexion</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView/>
</template>

<style>
@import "@/assets/base.css";

</style>
