<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUserLoginStore } from '@/stores/loginUserStore'

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
        <!-- if user is logged in -->
        <div class="user-avatar" v-if="store.user.first_name"><span>{{ store.userNameFirstLetter }}</span></div>
      </nav>
    </q-toolbar>
  </q-header>
</template>

<style lang="sass">
.home-link
  color: white
  text-decoration: none
  font-size: 1.3em

nav
  display: flex
  justify-content: flex-end

nav > *
  color: white
  padding: 0.3em
  text-decoration: none

nav > *:hover
  background-color: rgba(255, 255, 255, 0.3)

.user-avatar
  width: 32px
  height: 32px
  border-radius: 50%
  border: 2px solid #fff
  position: relative
  margin-left: 5px

.user-avatar span
  position: absolute
  text-align: center
  font-size: 30px
  line-height: 0
  top: 15px
  left: 6px

</style>