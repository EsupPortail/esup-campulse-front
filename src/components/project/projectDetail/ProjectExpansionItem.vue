<script lang="ts" setup>
defineProps<{
  icon: string;
  label: string;
  disable?: boolean;
}>()
</script>
<template>
  <QExpansionItem
    :disable="disable"
    expand-separator
  >
    <template v-slot:header>
      <QItemSection
        v-if="icon"
        aria-hidden="true"
        avatar
      >
        <QIcon
          :class="{'text-commission-color': !disable}"
          :name="icon"
        />
      </QItemSection>

      <QItemSection>
        <h3
          :class="
            {'text-commission-color':
              !disable}"
        >
          {{ label }}
        </h3>
      </QItemSection>
    </template>

    <div class="slot">
      <slot/>
    </div>
  </QExpansionItem>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.slot {
  padding: 1rem;
}

::v-deep(.text-commission-color) {
  color: $commissionColor;
}

h3 {
  font-size: $fontSize;
}
</style>