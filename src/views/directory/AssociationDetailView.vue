<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {useAssociationStore} from '@/stores/useAssociationStore'
import useDirectory from '@/composables/useDirectory'
import useUtility from '@/composables/useUtility'
import {useRoute} from 'vue-router'
<<<<<<< HEAD
import {useUserStore} from "@/stores/useUserStore";
import router from '@/router'
<<<<<<< HEAD
import useAssociation from "@/composables/useAssociation";
=======
>>>>>>> 9f1d1bc

=======
>>>>>>> 70f31c4

const {t} = useI18n()
const {notify} = useQuasar()
const {loading} = useQuasar()
const {getAssociationDetail} = useDirectory()
const {formatDate} = useUtility()
const route = useRoute()

const associationStore = useAssociationStore()
<<<<<<< HEAD
const userStore = useUserStore()
<<<<<<< HEAD
const {deleteAssociation} = useAssociation()
=======
=======
>>>>>>> 70f31c4

const association = ref(associationStore.association)
watch(() => associationStore.association, () => {
    association.value = associationStore.association
})
>>>>>>> 9f1d1bc

onMounted(async function () {
  loading.show
  await onGetAssociationDetail()
  loading.hide
})

async function onGetAssociationDetail() {
  try {
    await getAssociationDetail(route.params.id as string)
  } catch (error) {
    notify({
      type: 'negative',
      message: t('notifications.negative.form-error')
    })
  }
}
<<<<<<< HEAD

async function onDeleteAssociation() {
  try {
<<<<<<< HEAD
    await deleteAssociation()
=======
    await associationStore.deleteAssociation()
>>>>>>> 9f1d1bc
    await router.push({name: 'Associations'})
    notify({
      type: 'positive',
      message: t('notifications.positive.delete-association')
    })
  } catch (e) {
    notify({
      type: 'negative',
      message: t('notifications.negative.delete-association-error')
    })
  }
}
=======
>>>>>>> 70f31c4
</script>

<template>
<<<<<<< HEAD
  <section class="title">
    <div class="logo">
      <img
          v-if="associationStore.association?.pathLogo"
          :alt="associationStore.association?.altLogo"
          :src="associationStore.association?.pathLogo"
      />
      <div v-else></div>
    </div>
    <div class="name">
      <h1>{{ associationStore.association?.name }}</h1>
      <p class="acronym">{{ associationStore.association?.acronym }}</p>
      <p>{{ t("association.labels.charter-validity") }}</p>
    </div>
  </section>
  <section class="description">
    <p>{{ associationStore.association?.description }}</p>
  </section>
  <section>
    <h2>{{ t("association.titles.info") }}</h2>
    <article>
      <h3>{{ t("association.labels.activities") }}</h3>
      <p>{{ associationStore.association?.activities }}</p>
    </article>
    <article>
      <h3>{{ t("association.labels.institution") }}</h3>
      <p>{{ associationStore.association?.institution?.name }}</p>
    </article>
    <article>
      <h3>{{ t("association.labels.component") }}</h3>
      <p>{{ associationStore.association?.institutionComponent?.name }}</p>
    </article>
    <article>
      <h3>{{ t("association.labels.field") }}</h3>
      <p>{{ associationStore.association?.activityField?.name }}</p>
    </article>
  </section>
  <section>
    <h2>{{ t("association.titles.admin") }}</h2>
    <article>
      <h3>{{ t("association.labels.president-name") }}</h3>
      <p>{{ associationStore.association?.presidentNames }}</p>
    </article>
    <article>
      <h3>{{ t("association.labels.approval-date") }}</h3>
      <p>{{ formatDate(associationStore.association?.approvalDate) }}</p>
    </article>
    <article>
      <h3>{{ t("association.labels.charter-date") }}</h3>
      <p>TODO</p>
    </article>
    <article>
      <h3>{{ t("association.labels.last-goa") }}</h3>
      <p>{{ formatDate(associationStore.association?.lastGoaDate) }}</p>
    </article>
    <article>
      <h3>{{ t("association.labels.siret") }}</h3>
      <p>{{ associationStore.association?.siret }}</p>
    </article>
  </section>
  <section>
    <h2>{{ t("association.titles.contact") }}</h2>
    <article>
      <h3>{{ t("association.labels.address") }}</h3>
      <p>{{ associationStore.association?.address }}</p>
    </article>
    <article>
      <h3>{{ t("association.labels.phone") }}</h3>
      <p>{{ associationStore.association?.phone }}</p>
    </article>
    <article>
      <h3>{{ t("association.labels.mail") }}</h3>
      <p>{{ associationStore.association?.email }}</p>
    </article>
    <article>
      <h3>{{ t("association.labels.website") }}</h3>
      <a
          :href="associationStore.association?.website"
          :title="`${t('association.labels.website-link')} ${associationStore.association?.name}`"
      >
        {{ associationStore.association?.website }}
      </a>
    </article>
    <article>
      <h3>{{ t("association.labels.socials") }}</h3>
      <ul>
        <li
            v-for="socialNetwork in associationStore.association?.socialNetworks"
            :key="socialNetwork?.id"
        >
          <a
              :href="socialNetwork?.location"
          >
            {{ socialNetwork?.type }}
          </a>
        </li>
      </ul>
    </article>
  </section>
  <section class="btn-group">
    <QBtn
        :label="t('association.back-directory')"
        color="secondary"
        icon="mdi-arrow-left-circle"
        to="/associations"
    />
    <QBtn
        :href="`mailto:${associationStore.association?.email}`"
        :label="t('association.contact')"
        :title="`${t('association.contact')} ${associationStore.association?.name}`"
        color="primary"
        icon="mdi-email"
    />
    <QBtn
        v-if="userStore.isUniManager"
        :label="t('association.delete')"
        color="secondary"
        @click="onDeleteAssociation"
    />
  </section>
=======
    <section class="title">
        <div class="logo">
            <img
                v-if="association?.pathLogo"
                :alt="association?.altLogo"
                :src="association?.pathLogo"
            />
            <div v-else></div>
        </div>
        <div class="name">
            <h1>{{ association?.name }}</h1>
            <p class="acronym">{{ association?.acronym }}</p>
            <p>{{ t("association.labels.charter-validity") }}</p>
        </div>
    </section>
    <section class="description">
        <p>{{ association?.description }}</p>
    </section>
    <section>
        <h2>{{ t("association.titles.info") }}</h2>
        <article>
            <h3>{{ t("association.labels.activities") }}</h3>
            <p>{{ association?.activities }}</p>
        </article>
        <article>
            <h3>{{ t("association.labels.institution") }}</h3>
            <p>{{ association?.institution?.name }}</p>
        </article>
        <article>
            <h3>{{ t("association.labels.component") }}</h3>
            <p>{{ association?.institutionComponent?.name }}</p>
        </article>
        <article>
            <h3>{{ t("association.labels.field") }}</h3>
            <p>{{ association?.activityField?.name }}</p>
        </article>
    </section>
    <section>
        <h2>{{ t("association.titles.admin") }}</h2>
        <article>
            <h3>{{ t("association.labels.president-name") }}</h3>
            <p>{{ association?.presidentNames }}</p>
        </article>
        <article>
            <h3>{{ t("association.labels.approval-date") }}</h3>
            <p>{{ formatDate(association?.approvalDate) }}</p>
        </article>
        <article>
            <h3>{{ t("association.labels.charter-date") }}</h3>
            <p>TODO</p>
        </article>
        <article>
            <h3>{{ t("association.labels.last-goa") }}</h3>
            <p>{{ formatDate(association?.lastGoaDate) }}</p>
        </article>
        <article>
            <h3>{{ t("association.labels.siret") }}</h3>
            <p>{{ association?.siret }}</p>
        </article>
    </section>
    <section>
        <h2>{{ t("association.titles.contact") }}</h2>
        <article>
            <h3>{{ t("association.labels.address") }}</h3>
            <p>{{ association?.address }}</p>
        </article>
        <article>
            <h3>{{ t("association.labels.phone") }}</h3>
            <p>{{ association?.phone }}</p>
        </article>
        <article>
            <h3>{{ t("association.labels.mail") }}</h3>
            <p>{{ association?.email }}</p>
        </article>
        <article>
            <h3>{{ t("association.labels.website") }}</h3>
            <a
                :href="association?.website"
                :title="`${t('association.labels.website-link')} ${association?.name}`"
            >
                {{ association?.website }}
            </a>
        </article>
        <article>
            <h3>{{ t("association.labels.socials") }}</h3>
            <ul>
                <li
                    v-for="(socialNetwork, index) in association?.socialNetworks"
                    :key="index"
                >
                    <a
                        :href="socialNetwork?.location"
                    >
                        {{ socialNetwork?.type }}
                    </a>
                </li>
            </ul>
        </article>
    </section>
    <section class="btn-group">
        <QBtn
            :label="t('association.back-directory')"
            color="secondary"
            icon="mdi-arrow-left-circle"
            to="/associations"
        />
        <QBtn
            :href="`mailto:${association?.email}`"
            :label="t('association.contact')"
            :title="`${t('association.contact')} ${association?.name}`"
            color="primary"
            icon="mdi-email"
        />
    </section>
>>>>>>> 9f1d1bc
</template>

<style lang="sass" scoped>
.title
  display: flex
  gap: 20px
  margin-top: 50px
  align-items: flex-start

h1
  font-size: 3em
  line-height: 0

.acronym
  font-size: 1.8em

.logo
  max-width: 150px
  width: 100%
  height: 150px
  background-color: grey

.description
  margin-top: 30px
  font-size: 1.3em

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

.q-btn
  margin: 20px 0

.btn-group
  display: flex
  gap: 10px

li
  list-style: none

ul
  padding-left: 0
<<<<<<< HEAD
</style>
=======
</style>
>>>>>>> 9f1d1bc
