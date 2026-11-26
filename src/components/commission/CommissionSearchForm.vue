<script lang="ts" setup>
import GlobalInputDatePicker from '@/components/global/GlobalInputDatePicker.vue'
import {onMounted, ref, watch} from 'vue'
import {useFundStore} from '@/stores/useFundStore'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useCommissionSearch from '@/composables/useCommissionSearch'

const {openCommissionSearch, searchCommissionFilters} = useCommissionSearch()
const fundStore = useFundStore()
const {loading} = useQuasar()
const {t} = useI18n()

defineProps<{
  fields: Partial<{
    name: boolean,
    commissionDate: boolean,
    submissionDate: boolean,
    editionDate: boolean,
    funds: boolean,
  }>
}>()

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

watch(() => openCommissionSearch.value, (val) => {
  if (!val) {
    onClear()
  }
})

async function onGetData() {
  await fundStore.getFunds()
}

onMounted(async () => {
  loading.show()
  await onGetData()
  loading.hide()
})

</script>

<template>
  <QExpansionItem
    v-model="openCommissionSearch"
    bordered
    class="rounded-borders bg-white"
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
        <span :class="{'text-commission-color': true}">{{ t('research') }}</span>
      </QItemSection>
    </template>
    <QForm
      class="flex-column"
      @submit.prevent="onSearch"
    >
      <div class="grid-container">
        <QInput
          v-model="searchCommissionFilters.name"
          :label="t('commission.name')"
          clearable
          color="commission"
          filled
        />
        <QSelect
          v-model="searchCommissionFilters.funds"
          :label="t('commission.funds')"
          :options="fundStore.fundLabels"
          clearable
          color="commission"
          emit-value
          filled
          map-options
          multiple
          use-chips
        />
      </div>
      <div class="grid-container">
        <GlobalInputDatePicker
          :date-range="searchCommissionFilters.commissionDate"
          :hint="t('forms.date-range-hint')"
          :label="t('commission.date')"
          color="commission"
          @update:date-range="searchCommissionFilters.commissionDate = $event"
        />
        <GlobalInputDatePicker
          :date-range="searchCommissionFilters.submissionDate"
          :hint="t('forms.date-range-hint')"
          :label="t('commission.submission-date')"
          color="commission"
          @update:date-range="searchCommissionFilters.submissionDate = $event"
        />
        <GlobalInputDatePicker
          :date-range="searchCommissionFilters.editionDate"
          :hint="t('forms.date-range-hint')"
          :label="t('edition-date')"
          color="commission"
          @update:date-range="searchCommissionFilters.editionDate = $event"
        />
      </div>
      <div class="btn flex-row-center">
        <QBtn
          :label="t('search')"
          class="btn-lg"
          color="commission"
          icon="bi-search"
          type="submit"
        />
        <QBtn
          v-if="searchIsActive"
          :label="t('cancel-search')"
          class="btn-lg"
          color="commission"
          flat
          icon="bi-x"
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
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 2rem;
}

.q-form {
  padding: 1rem;
}
</style>