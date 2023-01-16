<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useI18n} from "vue-i18n";
import {useQuasar} from "quasar";
import {onMounted, reactive} from "vue";
import type {AssociationSearch} from "#/types/association";

const associationStore = useAssociationStore()
const {t} = useI18n()
const {notify, loading} = useQuasar()

onMounted(async () => {
  loading.show
  await loadAssociationsFields()
  loading.hide
})

const settings = reactive<AssociationSearch>({
    name: "",
    acronym: "",
    institution: null,
    institutionComponent: null,
    activityField: null
})

async function loadAssociationsFields() {
  try {
    await associationStore.getAssociationsListFields()
  } catch (e) {
    notify({
      type: 'negative',
      message: t('notifications.negative.form-error')
    })
  }
}
</script>

<template>
  <QInput
    :model-value="settings.name"
    :label="t('directory.labels.association-name')"
    @update:model-value="$emit('filterAssociations', settings)"
    filled
    lazy-rules
  />
  <QInput
    :model-value="settings.acronym"
    :label="t('directory.labels.association-acronym')"
    @update:model-value="$emit('filterAssociations', settings)"
    filled
    lazy-rules
  />
  <QSelect
    :model-value="settings.institution"
    :label="t('directory.labels.association-institution')"
    :options="associationStore.institutionNames"
    @update:model-value="$emit('filterAssociations', settings)"
    emit-value
    filled
    map-options
  />
  <QSelect
    :model-value="settings.institutionComponent"
    :label="t('directory.labels.association-component')"
    :options="associationStore.institutionComponentNames"
    @update:model-value="$emit('filterAssociations', settings)"
    emit-value
    filled
    map-options
  />
  <QSelect
    :model-value="settings.activityField"
    :label="t('directory.labels.association-field')"
    :options="associationStore.activityFieldNames"
    @update:model-value="$emit('filterAssociations', settings)"
    emit-value
    filled
    map-options
  />
</template>

<style lang="sass" scoped>
</style>
