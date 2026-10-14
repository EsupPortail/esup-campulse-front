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
div {
  font-weight: 600;
}

dt {
  font-size: 1.2rem;
  color: #454545;
}

dd {
  font-size: 1.4rem;
}
</style>
