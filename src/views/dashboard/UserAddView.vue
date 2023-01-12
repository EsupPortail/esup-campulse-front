<script lang="ts" setup>
import FormRegister from '@/components/form/FormRegister.vue'
import {useI18n} from "vue-i18n";

const {t} = useI18n()
</script>

<template>
  <h1>{{ t("user-manager.add-user") }}</h1>
  <QCard class="card">
    <QCardSection>
      <FormRegister/>
    </QCardSection>
  </QCard>
</template>

<style lang="sass" scoped>
.card
  margin-bottom: 30px
</style>
