<script lang="ts" setup>
import GlobalInputDatePicker from '@/components/global/GlobalInputDatePicker.vue'
import useProject from '@/composables/useProject'
import {computed, onMounted, ref, watch} from 'vue'
import {useFundStore} from '@/stores/useFundStore'
import {useProjectStore} from '@/stores/useProjectStore'
import {useQuasar} from 'quasar'
import type {SelectLabel} from '#/global'
import type {ProjectStatus} from '#/project'
import {useI18n} from 'vue-i18n'

const {searchProjectFilters} = useProject()
const fundStore = useFundStore()
const projectStore = useProjectStore()
const {loading} = useQuasar()
const {t} = useI18n()

defineProps<{
  showCommissionField: boolean,
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

const open = ref<boolean>(false)

watch(() => open.value, (val) => {
  if (!val) {
    onClear()
  }
})

async function onGetData() {
  await fundStore.getFunds()
  await projectStore.getProjectCategoryNames()
}

onMounted(async () => {
  loading.show()
  await onGetData()
  loading.hide()
})

const projectStatusOptions = computed<SelectLabel[]>(() => {
  const statuses: ProjectStatus[] = ['PROJECT_DRAFT_PROCESSED', 'PROJECT_REJECTED', 'PROJECT_PROCESSING',
    'PROJECT_VALIDATED', 'PROJECT_REVIEW_DRAFT', 'PROJECT_REVIEW_PROCESSING', 'PROJECT_CANCELED', 'PROJECT_REVIEW_VALIDATED']
  return statuses.map(item => ({
    value: item,
    label: item === 'PROJECT_REVIEW_VALIDATED' ? t('project.status.archived') :
      t(`project.status.${item.replace('PROJECT_', '').replace('_', '-').toLowerCase()}`),
  }))
})
</script>

<template>
  <QExpansionItem
    v-model="open"
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
          v-model="searchProjectFilters.manualIdentifier"
          :label="t('project.id')"
          clearable
          color="commission"
          filled
        />
        <QInput
          v-model="searchProjectFilters.name"
          :label="t('project.name')"
          clearable
          color="commission"
          filled
        />
        <QInput
          v-model="searchProjectFilters.associationName"
          :label="t('association')"
          clearable
          color="commission"
          filled
        />
        <QInput
          v-model="searchProjectFilters.userName"
          :label="t('individual-bearer')"
          clearable
          color="commission"
          filled
        />
      </div>
      <div class="grid-container">
        <GlobalInputDatePicker
          :date-range="searchProjectFilters.editionDate"
          :hint="t('forms.date-range-hint')"
          :label="t('project.edition-date')"
          color="commission"
          @update:date-range="searchProjectFilters.editionDate = $event"
        />
        <GlobalInputDatePicker
          :date-range="searchProjectFilters.commissionDate"
          :disable="!showCommissionField"
          :hint="t('forms.date-range-hint')"
          :label="t('commission.date')"
          color="commission"
          @update:date-range="searchProjectFilters.commissionDate = $event"
        />
      </div>
      <div class="grid-container">
        <QSelect
          v-model="searchProjectFilters.funds"
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
        <QSelect
          v-model="searchProjectFilters.projectStatuses"
          :label="t('status')"
          :options="projectStatusOptions"
          clearable
          color="commission"
          emit-value
          filled
          map-options
          multiple
          use-chips
        />
        <QSelect
          v-model="searchProjectFilters.category"
          :label="t('project.category')"
          :options="projectStore.projectCategoryLabels"
          clearable
          color="commission"
          emit-value
          filled
          map-options
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
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 2rem;
}

.q-form {
  padding: 1rem;
}
</style>