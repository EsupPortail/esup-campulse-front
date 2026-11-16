<script lang="ts" setup>
defineProps<{
  title: string
}>()
</script>

<template>
  <div>
    <dt>{{ title }}</dt>
    <dd>
      <slot/>
    </dd>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

dt {
  font-size: 1.3rem;
  color: #454545;
}

dd {
  font-size: 1.5rem;
  font-weight: $semibold-weight;
}
</style>
