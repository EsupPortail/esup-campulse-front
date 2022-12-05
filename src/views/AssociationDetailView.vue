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
            <h2>Informations</h2>
            <div class="cardbox-item">
                <h3>Activités</h3>
                <p>{{ associationStore.association.activities }}</p>
            </div>

            <div class="cardbox-item">
                <h3>Institution</h3>
                <p>{{ associationStore.association.institution.name }}</p>
            </div>

            <div class="cardbox-item">
                <h3>Composante</h3>
                <p>{{ associationStore.association.institutionComponent.name }}</p>
            </div>

            <div class="cardbox-item">
                <h3>Domaines</h3>
                <p>{{ associationStore.association.activityField.name }}</p>
            </div>

        </div>
        <div class="cardbox">
            <h2>Administration</h2>

            <div class="cardbox-item">
                <h3>Institution</h3>
                <p>{{ associationStore.association.institution.name }}</p>
            </div>

            <div class="cardbox-item">
                <h3>Téléphone</h3>
                <p>{{ associationStore.association.phone }}</p>
            </div>

            <div class="cardbox-item">
                <h3>Adresse mail</h3>
                <p>{{ associationStore.association.email }}</p>
            </div>

            <div class="cardbox-item">
                <h3>Numéro Siret</h3>
                <p>{{ associationStore.association.siret }}</p>
            </div>
        </div>

        <div class="cardbox">
            <h2>Contact</h2>

            <div class="cardbox-item">
                <h3>Adresse</h3>
                <p>{{ associationStore.association.address }}</p>
            </div>

            <div class="cardbox-item">
                <h3>Adresse mail</h3>
                <p>{{ associationStore.association.email }}</p>
            </div>

            <div class="cardbox-item">
                <h3>Site web</h3>
                <p>{{ associationStore.association.website }}</p>
            </div>

            <div class="cardbox-item">
                <h3>Réseaux sociaux</h3>
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