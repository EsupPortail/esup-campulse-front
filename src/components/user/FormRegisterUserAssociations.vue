<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useAssociation} from '@/composables/useAssociation'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {computed, onUnmounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import useUserAssociations from '@/composables/useUserAssociation'
import axios from 'axios'
import useErrors from '@/composables/useError'
import type {AssociationOptions} from '#/association'
//import useDocumentUploads from '@/composables/useDocumentUpload'

const associationStore = useAssociationStore()
const route = useRoute()
const {
  userAssociations,
  newUserAssociations,
  addAssociation,
  removeAssociation,
  //updateRegisterRoleInAssociation
} = useUserAssociations()
const {
  verifyAssociationRole,
} = useAssociation()
//const {processDocuments} = useDocumentUploads()
const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()


const title = computed<string>(() => {
  if (routeName.value === 'Registration') return t('dashboard.association-user.add-my-associations')
  else if (routeName.value === 'ManageAccount') return t('dashboard.association-user.add-my-new-associations')
  else return t('user-manager.register-in-new-associations')
})

const associationOptions = ref(associationStore.associationLabels)

const routeName = computed<string>(() => {
  return route.name as string
})

async function loadAssociations() {
  try {
    const filters = {
      allowNewUsers: true,
      isEnabled: true,
    }
    await associationStore.getAssociationNames(filters)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
}

function filterAssociations(val: string, update: (cb: () => void) => void) {
  update(() => {
    const lower = val.toLowerCase()
    associationOptions.value = associationStore.associationLabels.filter(obj => obj.label.toLowerCase().includes(lower))
  })
}

function clearOptions() {
  associationOptions.value = []
}

/*function checkAssociationRole(association: AssociationRole) {
  updateRegisterRoleInAssociation()
  verifyAssociationRole(association)
}*/

/*
watch(() => processDocuments.value[0]?.pathFile, () => {
  newUserAssociations.value.forEach(association => {
    checkAssociationRole(association)
  })
})
*/

async function onAddAssociation() {
  loading.show()
  if (!newUserAssociations.value.length) {
    await loadAssociations()
  }
  addAssociation()
  loading.hide()
}

const canAddUserAssociation = computed<boolean>(() => {
  const isManageAccountRoute = routeName.value === 'ManageAccount'
  return (isManageAccountRoute && newUserAssociations.value.length < (5 - userAssociations.value.length)) ||
      (isManageAccountRoute && !newUserAssociations.value.length)
})

onUnmounted(() => {
  newUserAssociations.value = []
})

</script>

<template>
  <QCard v-if="title">
    <QCardSection class="flex-column">
      <h3>{{ title }}</h3>
      <p>{{ t('dashboard.association-user.add-my-associations-note') }}</p>
      <div
        v-for="(item, index) in newUserAssociations"
        :key="`new-user-association-${index}`"
        class="flex-row new-association"
      >
        <div class="flex-column">
          <QSelect
            v-model="item.associationId"
            :label="t('forms.select-association')"
            :options="associationOptions"
            autofocus
            clearable
            color="dashboard"
            emit-value
            fill-input
            filled
            hide-selected
            input-debounce="0"
            map-options
            use-input
            @filter="filterAssociations"
            @input="clearOptions"
            @update:model-value="verifyAssociationRole(item)"
          />
          <QOptionGroup
            v-model="item.role"
            :aria-label="t('forms.association-role')"
            :options="item.options as AssociationOptions[]"
            color="dashboard"
            inline
            role="radiogroup"
          />
          <QSeparator
            v-if="routeName !== 'ManageAccount'"
            aria-hidden="true"
          />
        </div>
        <QSeparator
          aria-hidden="true"
          inset
          vertical
        />
        <div>
          <QBtn
            :aria-label="t('forms.delete-association')"
            class="btn-lg"
            color="custom-red"
            icon="bi-trash"
            outline
            @click="removeAssociation(index)"
          />
        </div>
      </div>
      <div class="flex-row">
        <QBtn
          v-if="newUserAssociations?.[0]?.associationId && routeName === 'ManageAccount'"
          :label="t('validate')"
          class="btn-lg"
          color="dashboard"
          icon="bi-check2"
          outline
          type="submit"
        />
        <QBtn
          v-if="canAddUserAssociation"
          :disable="newUserAssociations.some(obj => !obj.associationId)"
          :label="t('forms.add-association')"
          class="btn-lg"
          color="dashboard"
          icon="bi-plus-circle"
          outline
          @click="onAddAssociation"
        />
      </div>
    </QCardSection>
  </QCard>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms';
@import '@/assets/styles/associations';
@import '@/assets/_variables';
</style>
