<script lang="ts" setup>
defineProps<{
  title: string
  richText?: boolean
}>()
</script>

<template>
  <div>
    <dt>{{ title }}</dt>
    <dd :class="{'rich-text': richText}">
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

dd.rich-text {
  background-color: #ffffff;
  border: 1px solid #d7d7d7;
  border-radius: 0.4rem;
  font-weight: $normal-weight;
  line-height: 1.5;
  padding: 1.2rem;
  white-space: pre-line;
}
</style>
