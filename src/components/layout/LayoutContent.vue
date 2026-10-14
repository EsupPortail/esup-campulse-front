<script lang="ts" setup>
import {RouterView, useRoute} from 'vue-router'
import AlertAbortedCasRegistration from '@/components/authentication/AlertAbortedCasRegistration.vue'
import useColorVariants from '@/composables/useColorVariant'
import NavigateTopButton from '@/components/layout/NavigateTopButton.vue'

const {colorVariant} = useColorVariants()
const route = useRoute()

</script>


<template>
  <main
    id="main"
    :class="'variant-' + colorVariant"
    role="main"
  >
    <NavigateTopButton/>
    <Suspense>
      <RouterView/>
    </Suspense>
    <AlertAbortedCasRegistration v-if="route.name !== 'Registration'"/>
  </main>
</template>
