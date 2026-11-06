<script lang="ts" setup>
import GlobalInputDatePicker from '@/components/global/GlobalInputDatePicker.vue'
import useProject from '@/composables/useProject'
import {ref, watch} from 'vue'

const {searchProjectFilters} = useProject()

const emit = defineEmits<{
  (e: 'search'): void,
  (e: 'clear'): void
}>()

const searchIsActive = ref<boolean>(false)

function onSearch() {
  searchIsActive.value = true
  emit('search')
}

function onClear() {
  searchIsActive.value = false
  emit('clear')
  emit('search')
}

const open = ref<boolean>(false)

watch(() => open.value, (val) => {
  if (!val) {
    onClear()
  }
})

async function onGetData() {
  // getFunds
}

</script>

<template>
  <QExpansionItem
    v-model="open"
    bordered
    class="rounded-borders bg-white"
    expand-separator
  >
    <template v-slot:header>
      <QItemSection
        aria-hidden="true"
        avatar
      >
        <QIcon
          :class="{'text-commission-color': true}"
          name="bi-search"
        />
      </QItemSection>

      <QItemSection>
        <span :class="{'text-commission-color': true}">Recherche</span>
      </QItemSection>
    </template>
    <QForm
      class="flex-column"
      @submit.prevent="onSearch"
    >
      <div class="grid-container">
        <QInput
          v-model="searchProjectFilters.manualIdentifier"
          clearable
          color="commission"
          filled
          label="Identifiant"
        />
        <QInput
          v-model="searchProjectFilters.name"
          clearable
          color="commission"
          filled
          label="Nom du projet"
        />
        <QInput
          v-model="searchProjectFilters.associationName"
          clearable
          color="commission"
          filled
          label="Association"
        />
        <QInput
          v-model="searchProjectFilters.userName"
          clearable
          color="commission"
          filled
          label="Porteur individuel"
        />
      </div>
      <div class="grid-container">
        <GlobalInputDatePicker
          :date-range="searchProjectFilters.editionDate"
          color="commission"
          label="Date de dernière modification"
          @update:date-range="searchProjectFilters.editionDate = $event"
        />
        <GlobalInputDatePicker
          :date-range="searchProjectFilters.commissionDate"
          color="commission"
          label="Date de commission"
          @update:date-range="searchProjectFilters.commissionDate = $event"
        />
      </div>
      <div class="grid-container">
        <QSelect
          v-model="searchProjectFilters.funds"
          clearable
          color="commission"
          emit-value
          filled
          label="Financeurs"
          map-options
          multiple
          use-chips
        />
        <QSelect
          clearable
          color="commission"
          emit-value
          filled
          label="Statut"
          map-options
        />
        <QSelect
          clearable
          color="commission"
          emit-value
          filled
          label="Catégorie"
          map-options
        />
      </div>
      <div class="btn flex-row-center">
        <QBtn
          class="btn-lg"
          color="commission"
          icon="bi-search"
          label="Rechercher"
          type="submit"
        />
        <QBtn
          v-if="searchIsActive"
          class="btn-lg"
          color="commission"
          flat
          icon="bi-x"
          label="Annuler la recherche"
          @click="onClear"
        />
      </div>
    </QForm>
  </QExpansionItem>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

::v-deep(.text-commission-color) {
  color: $commissionColor;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 2rem;
}

.q-form {
  padding: 1rem;
}
</style>