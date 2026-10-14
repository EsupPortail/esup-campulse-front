<script lang="ts" setup>
import type {Commission} from '#/commission'
import AtomicDefinition from '@/components/atomic/AtomicDefinition.vue'

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
          <AtomicDefinition title="Date de commission">
            {{ commission.commissionDate }}
          </AtomicDefinition>
          <AtomicDefinition title="Date de soumission">
            {{ commission.submissionDate }}
          </AtomicDefinition>
          <AtomicDefinition title="Date de modification">
            TODO
          </AtomicDefinition>
          <AtomicDefinition title="Financeurs">
            TODO
          </AtomicDefinition>
          <AtomicDefinition title="Projets soumis">
            TODO
          </AtomicDefinition>
          <AtomicDefinition title="Bilans en retard">
            TODO
          </AtomicDefinition>
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