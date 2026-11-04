<script lang="ts" setup>
defineProps<{
  state: boolean,
  ariaLabelTrue: string,
  ariaLabelFalse: string,
}>()
</script>
<template>
  <p class="form-state form-state-cape">
    <span
      v-if="state"
      :aria-label="ariaLabelTrue"
      class="form-state-icon form-state-green"
    ><i
      aria-hidden="true"
      class="bi bi-check"
    ></i></span>
    <span
      v-else
      :aria-label="ariaLabelFalse"
      class="form-state-icon form-state-red"
    ><i
      aria-hidden="true"
      class="bi bi-x"
    ></i></span>
  </p>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
</style>