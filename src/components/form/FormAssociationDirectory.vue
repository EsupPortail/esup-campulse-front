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
  await loadAssociationsFields()
  loading.hide
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

function filterAssociations() {
    associationStore.associations.forEach((association, index) => {

    })
}
</script>

<template>
  <QInput
    :label="t('directory.labels.association-name')"
    @change="filterAssociations()"
    filled
    lazy-rules
  />
  <QInput
    :label="t('directory.labels.association-acronym')"
    @change="filterAssociations()"
    filled
    lazy-rules
  />
  <QSelect
    :v-model="associationStore.institutions"
    :label="t('directory.labels.association-institution')"
    :options="associationStore.institutionNames"
    @change="filterAssociations()"
    emit-value
    filled
    map-options
  />
  <QSelect
    :v-model="associationStore.institutionComponents"
    :label="t('directory.labels.association-component')"
    :options="associationStore.institutionComponentNames"
    @change="filterAssociations()"
    emit-value
    filled
    map-options
  />
  <QSelect
    :v-model="associationStore.activityFields"
    :label="t('directory.labels.association-field')"
    :options="associationStore.activityFieldNames"
    @change="filterAssociations()"
    emit-value
    filled
    map-options
  />
</template>

<style lang="sass" scoped>
</style>
