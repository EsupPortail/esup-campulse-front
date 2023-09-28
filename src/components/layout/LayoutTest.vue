<script lang="ts" setup>
const testMessage = import.meta.env.VITE_APP_HOME_TEST_MESSAGE
</script>

<template>
    <p v-if="testMessage !== ''">{{ testMessage }}</p>
</template>

<style lang="scss" scoped>
p {
    background-color: #FF0000;
    color: #FFFFFF;
    font-weight: bold;
    margin-bottom: 0;
    text-align: center;
}
</style>
