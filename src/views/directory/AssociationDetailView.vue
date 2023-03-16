<script lang="ts" setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {useAssociationStore} from '@/stores/useAssociationStore'
import useUtility from '@/composables/useUtility'
import {useRoute} from 'vue-router'
import useAssociation from '@/composables/useAssociation'

const {t} = useI18n()
const {notify} = useQuasar()
const {loading} = useQuasar()
const {formatDate} = useUtility()
const route = useRoute()

const associationStore = useAssociationStore()
const {altLogoText} = useAssociation()

const association = ref(associationStore.association)
watch(() => associationStore.association, () => {
    association.value = associationStore.association
})

onMounted(async function () {
    loading.show
    await onGetAssociationDetail()
    loading.hide
})

const hasLogo = computed(() => {
    return association.value ? (association.value.pathLogo !== null && Object.keys(association.value.pathLogo).length > 0) : false
})

async function onGetAssociationDetail() {
    try {
        await associationStore.getAssociationDetail(parseInt(route.params.id as string), true)
    } catch (error) {
        notify({
            type: 'negative',
            message: t('notifications.negative.form-error')
        })
    }
}
</script>

<template>
    <section class="title">
        <div class="logo">
            <QImg v-if="association" :alt="altLogoText(association)"
                  :src="hasLogo ? association?.pathLogo?.detail : '/src/assets/img/no_logo_square.png'"/>
        </div>
        <div class="name">
            <h1>{{ association?.name }}</h1>
            <p v-if="association?.acronym" class="acronym">{{ association?.acronym }}</p>
            <p>{{ t("association.labels.charter-validity") }}</p>
        </div>
    </section>
    <section v-if="association?.socialObject" class="socialObjectSection">
        <p>{{ association?.socialObject }}</p>
    </section>
    <section>
        <h2>{{ t("association.titles.info") }}</h2>
        <article v-if="association?.currentProjects">
            <h3>{{ t("association.labels.current-projects") }}</h3>
            <p>{{ association?.currentProjects }}</p>
        </article>
        <article v-if="association?.institution">
            <h3>{{ t("association.labels.institution") }}</h3>
            <p>{{ association?.institution?.name }}</p>
        </article>
        <article v-if="association?.institutionComponent">
            <h3>{{ t("association.labels.institution-component") }}</h3>
            <p>{{ association?.institutionComponent?.name }}</p>
        </article>
        <article v-if="association?.activityField">
            <h3>{{ t("association.labels.activity-field") }}</h3>
            <p>{{ association?.activityField?.name }}</p>
        </article>
    </section>
    <section
        v-if="association?.presidentNames || association?.presidentPhone || association?.lastGoaDate || association?.siret">
        <h2>{{ t("association.titles.admin") }}</h2>
        <article v-if="association?.presidentNames">
            <h3>{{ t("association.labels.president-name") }}</h3>
            <p>{{ association?.presidentNames }}</p>
        </article>
        <article v-if="association?.presidentPhone">
            <h3>{{ t("association.labels.president-phone") }}</h3>
            <p>{{ association?.presidentPhone }}</p>
        </article>
        <article>
            <h3>{{ t("association.labels.charter-date") }}</h3>
            <p>TODO</p>
        </article>
        <article v-if="association?.lastGoaDate">
            <h3>{{ t("association.labels.last-goa") }}</h3>
            <p>{{ formatDate(association?.lastGoaDate) }}</p>
        </article>
        <article v-if="association?.siret">
            <h3>{{ t("association.labels.siret") }}</h3>
            <p>{{ association?.siret }}</p>
        </article>
    </section>
    <section
        v-if="association?.address || association?.phone || association?.email || association?.website || (association?.socialNetworks && association?.socialNetworks?.length > 0)">
        <h2>{{ t("association.titles.contact") }}</h2>
        <article v-if="association?.address">
            <h3>{{ t("association.labels.address") }}</h3>
            <p>{{ association?.address }}</p>
        </article>
        <article v-if="association?.phone">
            <h3>{{ t("association.labels.phone") }}</h3>
            <p>{{ association?.phone }}</p>
        </article>
        <article v-if="association?.email">
            <h3>{{ t("association.labels.mail") }}</h3>
            <p>{{ association?.email }}</p>
        </article>
        <article v-if="association?.website">
            <h3>{{ t("association.labels.website") }}</h3>
            <a :href="association?.website" :title="`${t('association.labels.website-link')} ${association?.name}`">
                {{ association?.website }}
            </a>
        </article>
        <article v-if="association?.socialNetworks && association?.socialNetworks?.length > 0">
            <h3>{{ t("association.labels.socials") }}</h3>
            <ul>
                <li v-for="(socialNetwork, index) in association?.socialNetworks" :key="index">
                    <a :href="socialNetwork?.location">
                        {{ socialNetwork?.type }}
                    </a>
                </li>
            </ul>
        </article>
    </section>
    <section class="btn-group">
        <QBtn :label="t('association.back-directory')" color="secondary" icon="mdi-arrow-left-circle"
              to="/associations"/>
        <QBtn v-if="association?.email" :href="`mailto:${association?.email}`" :label="t('association.contact')"
              :title="`${t('association.contact')} ${association?.name}`" color="primary" icon="mdi-email"/>
    </section>
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
    width: 150px
    height: 150px

.socialObjectSection
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
</style>
