<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useI18n} from "vue-i18n";
import {useQuasar} from "quasar";
import {onMounted} from "vue";

const associationStore = useAssociationStore()
const {t} = useI18n()
const {notify, loading} = useQuasar()

onMounted(async () => {
  loading.show
  await loadAssociations()
  loading.hide
})

async function loadAssociations() {
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
    :label="t('directory.labels.association-name')"
    filled
    lazy-rules
  />
  <QInput
    :label="t('directory.labels.association-acronym')"
    filled
    lazy-rules
  />
  <QSelect
    :label="t('directory.labels.association-institution')"
    :options="associationStore.institutionNames"
    emit-value
    filled
    map-options
  />
  <QSelect
    :label="t('directory.labels.association-component')"
    :options="associationStore.institutionComponentNames"
    emit-value
    filled
    map-options
  />
  <QSelect
    :label="t('directory.labels.association-field')"
    :options="associationStore.activityFieldNames"
    emit-value
    filled
    map-options
  />
</template>

<style lang="sass" scoped>
</style>
