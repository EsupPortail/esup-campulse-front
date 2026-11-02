<script lang="ts" setup>
import type {Commission} from '#/commission'
import GlobalDefinition from '@/components/global/GlobalDefinition.vue'

defineProps<{
  commission: Commission,
  headingLevel: number
}>()
</script>

<template>
  <div class="display-row">
    <div class="flex-row-space-between">
      <div>
        <p
          :aria-level="headingLevel"
          class="row-title"
          role="heading"
        >
          {{ commission.name }}
        </p>
        <dl class="flex-row-space-between">
          <GlobalDefinition title="Date de commission">
            {{ commission.commissionDate }}
          </GlobalDefinition>
          <GlobalDefinition title="Date de soumission">
            {{ commission.submissionDate }}
          </GlobalDefinition>
          <GlobalDefinition title="Date de modification">
            TODO
          </GlobalDefinition>
          <GlobalDefinition title="Financeurs">
            TODO
          </GlobalDefinition>
          <GlobalDefinition title="Projets soumis">
            TODO
          </GlobalDefinition>
          <GlobalDefinition title="Bilans en retard">
            TODO
          </GlobalDefinition>
        </dl>
      </div>
      <QBtn
        flat
        icon="bi-arrow-right"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

p[role="heading"] {
  font-weight: 600 !important;
}
</style>