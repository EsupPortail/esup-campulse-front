<script lang="ts" setup>
import {useUserStore} from '@/stores/useUserStore'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const {getUser} = useUsers()

async function onGetUser() {
  try {
    await getUser()
  }
}
</script>

<template>

</template>

<style lang="sass" scoped>
</style>
