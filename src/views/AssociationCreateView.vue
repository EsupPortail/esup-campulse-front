<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import FormNewAssociation from "@/components/form/FormNewAssociation.vue";

const {t} = useI18n()
</script>

<template>
  <h1>{{ t("association.titles.create") }}</h1>
  <QCard class="card">
    <QCardSection>
      <FormNewAssociation/>
    </QCardSection>
  </QCard>
</template>

<style>
</style>