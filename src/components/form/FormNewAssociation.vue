<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {useAssociationStore} from '@/stores/useAssociationStore'
import type {Association} from "#/association";
//import {useRoute} from 'vue-router'

const {t} = useI18n()
const {notify} = useQuasar()
//const route = useRoute()

const associationStore = useAssociationStore()

async function onCreate(association: Association) {
  try {
    await associationStore.createAssociation(association.name, {
      name: association.name
    })
    notify({
      type: 'positive',
      message: t('notifications.positive.validate-asso')
    })
  } catch (e) {
    notify({
      type: 'negative',
      message: t('notifications.negative.error-asso')
    })
  }
}
</script>

<template>
  <section>
    <article>
      <h3>{{ t("association.labels.new-asso") }}</h3>
      <input type="text">
    </article>
  </section>
  <section class="btn-group">
    <QBtn
        :label="t('home.back-dashboard')"
        color="secondary"
        icon="mdi-arrow-left-circle"
        to="/associations"
    />
    <QBtn
        :label="t('manager.validate')"
        color="primary"
        v-on:click="onCreate(associationStore.association)"
    />
  </section>
</template>

<style lang="sass" scoped>
h2
  background-color: $primary
  color: #fff
  font-size: 2em
  text-align: center

article > *
  margin: 0
  width: 50%

article
  display: flex
  align-items: center
  background-color: lightgrey
  padding: 0 20px 0 20px
  margin: 5px 0

h3
  font-size: 1.2em
  text-transform: uppercase

.btn-group
  display: flex
  gap: 10px

</style>