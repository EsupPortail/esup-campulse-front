<script lang="ts" setup>
import {onBeforeMount, ref} from 'vue'
import {useRoute} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {useAssociationStore} from "@/stores/useAssociationStore";
import type {Association} from "#/association";

const route = useRoute()
const {t} = useI18n()
const {notify} = useQuasar()

const associationStore = useAssociationStore()
const association = ref<Association>()


// onMounted(getAssociation)
onBeforeMount(async () => [
  await getAssociation()
])

async function getAssociation() {
  if (route.params.id) {
    try {
      const id = parseInt(route.params.id as string)
      await associationStore.getAssociationDetail(id)
      association.value = associationStore.association
    } catch (e) {
      notify({
        type: 'negative',
        message: t('notifications.negative.form-error')
      })
    }
  }
}
</script>

<template>
  <div v-if="!association">Loading...</div>
  <div v-else>
    <div class="title">
      <div class="logo">
        <img v-if="associationStore.association.pathLogo" :src="associationStore.association.pathLogo" alt=""/>
        <div v-else></div>
      </div>
      <div class="name">
        <h1>{{ associationStore.association.name }}</h1>
        <span>Charte valide jusqu'au XX/XX/XX</span>
      </div>
    </div>
    <div class="description">
      <p>{{ associationStore.association.description }}</p>
    </div>

    <div class="cardbox">
      <h2>{{ t("association.info-title") }}</h2>
      <div class="cardbox-item">
        <h3>{{ t("association.activities-sub-title") }}</h3>
        <p>{{ associationStore.association.activities }}</p>
      </div>

      <div class="cardbox-item">
        <h3>{{ t("association.services-sub-title") }}</h3>
        <p>{{ associationStore.association.institution.name }}</p>
      </div>

      <div class="cardbox-item">
        <h3>{{ t("association.institut-sub-title") }}</h3>
        <p>{{ associationStore.association.institutionComponent.name }}</p>
      </div>

      <div class="cardbox-item">
        <h3>{{ t("association.domain-sub-title") }}</h3>
        <p>{{ associationStore.association.activityField.name }}</p>
      </div>

    </div>
    <div class="cardbox">
      <h2>{{ t("association.admin-title") }}</h2>

      <div class="cardbox-item">
        <h3>{{ t("association.president-name-sub-title") }}</h3>
        <p>{{ associationStore.association.institution.name }}</p>
      </div>

      <div class="cardbox-item">
        <h3>{{ t("association.phone-sub-title") }}</h3>
        <p>{{ associationStore.association.phone }}</p>
      </div>

      <!-- AJOUTER LA VARIABLE DU MAIL DU PRESIDENT DANS LE MODELE ASSOCIATION-->
      <div class="cardbox-item">
        <h3>{{ t("association.president-main-sub-title") }}</h3>
        <p>{{ associationStore.association.email }}</p>
      </div>

      <div class="cardbox-item">
        <h3>{{ $t("association.siret-sub-title") }}</h3>
        <p>{{ associationStore.association.siret }}</p>
      </div>

      <!-- AJOUTER LES VARIABLES LASTAGO ET CHARTDATE DANS LE MODELE ASSOCIATION-->
      <div class="cardbox-item">
        <h3>{{ t("association.lastago-sub-title") }}</h3>
        <p>{{ associationStore.association.email }}</p>
      </div>

      <div class="cardbox-item">
        <h3>{{ t("association.chart-date-sub-title") }}</h3>
        <p>{{ associationStore.association.email }}</p>
      </div>
      <!-- AJOUTER LES VARIABLES LASTAGO ET CHARTDATE DANS LE MODELE ASSOCIATION-->

    </div>

    <div class="cardbox">
      <h2>{{ t("association.contact-title") }}</h2>

      <div class="cardbox-item">
        <h3>{{ t("association.address-sub-title") }}</h3>
        <p>{{ associationStore.association.address }}</p>
      </div>

      <div class="cardbox-item">
        <h3>{{ t("association.asso-mail-sub-title") }}</h3>
        <p>{{ associationStore.association.email }}</p>
      </div>

      <!-- AJOUTER LES VARIABLES DES RESEAUX SOCIAUX DANS LE MODELE ASSOCIATION-->
      <div class="cardbox-item">
        <h3>{{ t("association.socials-sub-title") }}</h3>
        <p>{{ associationStore.association.website }}</p>
      </div>
      <!-- AJOUTER LES VARIABLES DES RESEAUX SOCIAUX DANS LE MODELE ASSOCIATION-->

      <div class="cardbox-item">
        <h3>{{ t("website.chart-date-sub-title") }}</h3>
        <p>{{ associationStore.association.website }}</p>
      </div>
    </div>
  </div>
  <QBtn color="secondary" label="Retourner aux associations" to="/associations"/>
</template>

<style lang="sass" scoped>
.title
  display: flex
  gap: 20px
  margin-top: 50px
  align-items: flex-start

  .name
    h1
      font-size: 3em
      line-height: 0

    span
      font-size: 1.5em

  .logo
    max-width: 150px
    width: 100%
    height: 150px
    background-color: grey

.description
  margin-top: 30px

h2
  background-color: $primary
  color: #fff
  font-size: 2em
  text-align: center

.cardbox
  .cardbox-item > *
    margin: 0
    width: 50%

  .cardbox-item
    display: flex
    align-items: center
    background-color: lightgrey
    padding: 0 20px 0 20px
    margin: 5px 0

    h3
      font-size: 1.2em
      text-transform: uppercase

.q-btn
  margin: 20px 0
</style>