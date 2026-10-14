<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import type {Tab} from '#/global'
import useSecurity from '@/composables/useAuthentication'

const {hasPerm} = useSecurity()

const props = defineProps<{
  tabList: Tab[]
}>()

const tabs = ref<HTMLElement[]>([])

const currentTab = defineModel<number>('currentTab')

// Function to set the active macro
const setActiveTab = (index: number) => {
  currentTab.value = index
  tabs.value[index]?.focus()
}

// Handles keyboard navigation between tabs using the arrow key for accessibility
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowRight' && currentTab.value < props.tabList.length - 1) {
    setActiveTab(currentTab.value + 1)
  } else if (event.key === 'ArrowLeft' && currentTab.value > 0) {
    setActiveTab(currentTab.value - 1)
  }
}

// Get macro elements on mount
onMounted(() => {
  tabs.value = Array.from(document.querySelectorAll('[role="macro"]'))
})

</script>

<template>
  <QTabPanel
    name="infos"
  >
    <QTabs v-model="currentTab">
      <QTab
        v-for="(tab, index) in tabList.filter(tl => !tl.permission || hasPerm(tl.permission))"
        :key="`tab-${index}`"
        :aria-selected="currentTab === index"
        :disable="tab.disable"
        :icon="tab.icon"
        :label="tab.label"
        :name="index"
        :tabindex="currentTab === index ? 0 : 1"
        @keydown="handleKeydown"
      />
    </QTabs>
  </QTabPanel>

  <QTabPanels
    v-model="currentTab"
    animated
  >
    <QTabPanel
      v-for="(tab, index) in tabList.filter(tl => !tl.permission || hasPerm(tl.permission))"
      :key="`slot-${index}`"
      :name="index"
      class="tab-content"
    >
      <slot :name="tab.slotName"/>
    </QTabPanel>
  </QTabPanels>
</template>

<style lang="scss" scoped>
.q-tab-panels {
  background-color: transparent;
}

.q-tab-panel, .q-tab {
  width: 100%;
}

.tab-content {
  margin: 2rem auto;
}
</style>
