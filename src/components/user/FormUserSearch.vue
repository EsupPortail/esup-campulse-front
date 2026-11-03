<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {useUserStore} from '@/stores/useUserStore'
import type {SearchUser, UserFilters} from '#/user'
import axios from 'axios'
import useErrors from '@/composables/useError'
import {useAssociationStore} from '@/stores/useAssociationStore'

const {t} = useI18n()
const userStore = useUserStore()
const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()
const associationStore = useAssociationStore()


const emit = defineEmits(['getUsers'])

const settings = ref<SearchUser>({
  search: '',
  firstName: '',
  lastName: '',
  email: '',
  association: null
})

const associations = ref(associationStore.associationLabels)

async function onGetAssociationNames() {
  try {
    await associationStore.getAssociationNames()
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
}

onMounted(async () => {
  loading.show()
  await onGetAssociationNames()
  loading.hide()
})

function filterAssociations(val: string, update: (cb: () => void) => void) {
  update(() => {
    const lower = val.toLowerCase()
    associations.value = associationStore.associationLabels.filter(obj => obj.label.toLowerCase().includes(lower))
  })
}

async function onSearch() {
  loading.show()
  try {
    const filters: Partial<UserFilters> = {
      search: settings.value.search,
      name: ([settings.value.lastName, settings.value.firstName].join(' ')).trim(),
      email: settings.value.email,
      associationId: settings.value.association
    }
    await userStore.getUsers(filters)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
  loading.hide()
}

// A function that clears the search,
// for API search it re-gets associations, for front search it looks back in store
async function clearSearch() {
  loading.show()
  try {
    settings.value = {
      search: '',
      firstName: '',
      lastName: '',
      email: '',
      association: null
    }
    emit('getUsers')
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
  loading.hide()
}
</script>
<template>
  <section class="container flex-column padding-bottom">
    <h3>{{ t('user.search') }}</h3>
    <QForm
      id="search-form"
      :aria-label="t('user.directory')"
      class="search-text-field flex-column"
      role="search"
      @submit.prevent="onSearch"
    >
      <QInput
        v-model="settings.search"
        :label="t('search')"
        :placeholder="t('search')"
        clearable
        color="dashboard"
        filled
        inputmode="search"
        lazy-rules
      >
        <template v-slot:prepend>
          <QIcon
            aria-hidden="true"
            name="bi-search"
          />
        </template>
      </QInput>
      <QExpansionItem
        :label="t('advanced-search')"
        header-class="text-dashboard"
      >
        <div class="flex-column padding-top">
          <div class="flex-row">
            <QInput
              v-model="settings.firstName"
              :label="t('user.first-name')"
              class="full-width"
              clearable
              color="dashboard"
              filled
              lazy-rules
            />
            <QInput
              v-model="settings.lastName"
              :label="t('user.last-name')"
              class="full-width"
              clearable
              color="dashboard"
              filled
              lazy-rules
            />
          </div>
          <QInput
            v-model="settings.email"
            :label="t('user.email')"
            clearable
            color="dashboard"
            filled
            lazy-rules
          />
          <QSelect
            v-model="settings.association"
            :label="t('user.associations')"
            :options="associations"
            clearable
            color="dashboard"
            emit-value
            filled
            map-options
            use-input
            @filter="filterAssociations"
          />
        </div>
      </QExpansionItem>
      <div class="flex-row">
        <QBtn
          :label="t('search')"
          class="btn-lg"
          color="dashboard"
          icon="bi-chevron-right"
          type="submit"
        />
        <QBtn
          :label="t('cancel-search')"
          class="btn-lg"
          color="dashboard"
          icon="bi-x-lg"
          @click="clearSearch"
        />
      </div>
    </QForm>

    <QForm
      id="advanced-search-form"
      :aria-label="t('user.directory-advanced')"
      role="search"
      @submit.prevent="onSearch"
    >
    </QForm>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms';
@import '@/assets/styles/associations';
</style>
