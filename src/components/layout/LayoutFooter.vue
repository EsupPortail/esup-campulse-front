<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <q-footer elevated>
    <q-toolbar>
      <div class="footer-text">
        <q-toolbar-title>2017-2022 - PLATEFORME - Tous droits réservés</q-toolbar-title>
        <RouterLink to="/" class="li-footer">A propos</RouterLink>
        <RouterLink to="/" class="li-footer">Mentions légales</RouterLink>
        <RouterLink to="/" class="li-footer">Contact</RouterLink>
      </div>
    </q-toolbar>
  </q-footer>
</template>

<style scoped lang="sass">
.q-toolbar
  justify-content: center

.footer-text
  text-align: center

.li-footer
  color: white
  padding: 0.3em

.li-footer:after
  content: "|"
  padding-left: 0.5em

.li-footer:last-child:after
  content: none

</style>
