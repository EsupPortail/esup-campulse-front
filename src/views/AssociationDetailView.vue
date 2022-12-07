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
onBeforeMount(getAssociation)

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

function getDate(date: string) {
    const timeStamp = Date.parse(date)
    const formatDate = new Date(timeStamp)
    return formatDate.getDate() + '/' + (formatDate.getMonth() + 1) + '/' + formatDate.getFullYear()
}
</script>

<template>
    <div v-if="!association">{{ $t("loading") }}</div>
    <div v-else>
        <div class="title">
            <div class="logo">
                <img
                    v-if="associationStore.association.pathLogo"
                    :alt="associationStore.association.altLogo"
                    :src="associationStore.association.pathLogo"
                />
                <div v-else></div>
            </div>
            <div class="name">
                <h1>{{ associationStore.association.name }}</h1>
                <p class="acronym">{{ associationStore.association.acronym }}</p>
                <p>{{ $t("association.labels.charter-validity") }}</p>
            </div>
        </div>
        <div class="description">
            <p>{{ associationStore.association.description }}</p>
        </div>
        <section>
            <h2>{{ $t("association.titles.info") }}</h2>
            <div class="item">
                <h3>{{ $t("association.labels.activities") }}</h3>
                <p>{{ associationStore.association.activities }}</p>
            </div>

            <div class="item">
                <h3>{{ $t("association.labels.institution") }}</h3>
                <p>{{ associationStore.association.institution.name }}</p>
            </div>

            <div class="item">
                <h3>{{ $t("association.labels.component") }}</h3>
                <p>{{ associationStore.association.institutionComponent.name }}</p>
            </div>

            <div class="item">
                <h3>{{ $t("association.labels.field") }}</h3>
                <p>{{ associationStore.association.activityField.name }}</p>
            </div>
        </section>
        <section>
            <h2>{{ $t("association.titles.admin") }}</h2>
            <div class="item">
                <h3>{{ $t("association.labels.president-name") }}</h3>
                <p>TODO</p>
            </div>
            <div class="item">
                <h3>{{ $t("association.labels.approval-date") }}</h3>
                <p>{{ getDate(associationStore.association.approvalDate) }}</p>
            </div>
            <div class="item">
                <h3>{{ $t("association.labels.charter-date") }}</h3>
                <p>TODO</p>
            </div>
            <div class="item">
                <h3>{{ $t("association.labels.last-goa") }}</h3>
                <p>{{ getDate(associationStore.association.lastGoaDate) }}</p>
            </div>
            <div class="item">
                <h3>{{ $t("association.labels.siret") }}</h3>
                <p>{{ associationStore.association.siret }}</p>
            </div>
        </section>
        <section>
            <h2>{{ $t("association.titles.contact") }}</h2>
            <div class="item">
                <h3>{{ $t("association.labels.address") }}</h3>
                <p>{{ associationStore.association.address }}</p>
            </div>
            <div class="item">
                <h3>{{ $t("association.labels.phone") }}</h3>
                <p>{{ associationStore.association.phone }}</p>
            </div>
            <div class="item">
                <h3>{{ $t("association.labels.mail") }}</h3>
                <p>{{ associationStore.association.email }}</p>
            </div>
            <div class="item">
                <h3>{{ $t("association.labels.website") }}</h3>
                <a
                    :href="associationStore.association.website"
                    :title="`${$t('association.labels.website-link')} ${associationStore.association.name}`"
                >
                    {{ associationStore.association.website }}
                </a>
            </div>
            <div class="item">
                <h3>{{ $t("association.labels.socials") }}</h3>
                <p>TODO</p>
            </div>
        </section>
    </div>
    <div class="btn-group">
        <QBtn
            :label="$t('association.back-directory')"
            color="secondary"
            icon="mdi-arrow-left-circle"
            to="/associations"
        />
        <QBtn
            :href="`mailto:${associationStore.association.email}`"
            :label="$t('association.contact')"
            :title="`${$t('association.contact')} ${associationStore.association.name}`"
            color="primary"
            icon="mdi-email"
        />
    </div>
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

        p
            font-size: 1.5em

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

.item > *
    margin: 0
    width: 50%

.item
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
</style>