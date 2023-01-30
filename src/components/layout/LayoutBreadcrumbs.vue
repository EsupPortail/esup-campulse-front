<script lang="ts" setup>
import {RouterLink} from 'vue-router'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
</script>

<template>
  <div id="layout-breadcrumbs" class="variant-minimal">
    <q-breadcrumbs gutter="none" separator="">
      <q-breadcrumbs-el label="Accueil" to="/" />
      <q-breadcrumbs-el label="Annuaire des associations" to="/" />
      <q-breadcrumbs-el label="Consulter" />
    </q-breadcrumbs>
  </div>
</template>
