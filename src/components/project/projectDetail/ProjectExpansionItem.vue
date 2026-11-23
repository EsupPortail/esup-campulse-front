<script lang="ts" setup>
defineProps<{
  icon: string;
  label: string;
  disable?: boolean;
  count?: number;
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
        <div class="header-title">
          <h3
            :class="
              {'text-commission-color':
                !disable}"
          >
            {{ label }}
          </h3>
          <QChip
            v-if="count !== undefined"
            :aria-label="`${label} : ${count}`"
            color="commission"
            dense
            text-color="white"
          >
            {{ count }}
          </QChip>
        </div>
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

.header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

h3 {
  font-size: $fontSize;
}
</style>