<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <div class="platform">
        <img src="./assets/logo.svg">
        <p>PLATEFORME</p>
      </div>
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

<style lang="sass">
@import "@/assets/base.css"

.wrapper
  background-color: red

nav
  display: flex
  justify-content: flex-end

  RouterLink
    padding-right: 10px


.platform
  display: flex
  float: left
  background-color: green

  img
    width: 50px
    height: 50px

  p
    align-items: center
    justify-content: center


</style>
