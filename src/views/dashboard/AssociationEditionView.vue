<script lang="ts" setup>
import {onMounted} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {useAssociationStore} from '@/stores/useAssociationStore'
import useDirectory from '@/composables/useDirectory'
import {useRoute} from 'vue-router'

const {t} = useI18n()
const {notify} = useQuasar()
const {loading} = useQuasar()
const {getAssociationDetail} = useDirectory()
const route = useRoute()
const associationStore = useAssociationStore()

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
</script>

<template>
    <h1>{{ associationStore.association?.name }}</h1>
    <QForm
        v-if="associationStore.association"
        @submit.prevent="onSubmit"
    >
        <!--        <div class="logo">
                <img
                    v-if="associationStore.association?.pathLogo"
                    :alt="associationStore.association?.altLogo"
                    :src="associationStore.association?.pathLogo"
                />
                <div v-else></div>
            </div>-->
        <fieldset>
            <legend>Informations générales</legend>
            <QInput
                v-model="associationStore.association.acronym"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="Acronyme"
                lazy-rules
            />
            <QInput
                v-model="associationStore.association.description"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="Description"
                lazy-rules
                type="textarea"
            />
            <QInput
                v-model="associationStore.association.activities"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="Activités"
                lazy-rules
                type="textarea"
            />
            <QInput
                v-if="associationStore.association.institution"
                v-model="associationStore.association.institution.name"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="Etablissement"
                lazy-rules
            />
            <QInput
                v-if="associationStore.association.institutionComponent"
                v-model="associationStore.association.institutionComponent.name"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="Composante"
                lazy-rules
            />
            <QInput
                v-if="associationStore.association.activityField"
                v-model="associationStore.association.activityField.name"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="Domaine"
                lazy-rules
            />
        </fieldset>
        <fieldset>
            <legend>Informations administratives</legend>
            <QInput
                v-model="associationStore.association.presidentNames"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="Nom du président ou de la présidente"
                lazy-rules
            />
            <!--            <article>
                            <h3>{{ t("association.labels.last-goa") }}</h3>
                        </article>-->
            <QInput
                v-model="associationStore.association.siret"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="Siret"
                lazy-rules
            />
        </fieldset>
        <fieldset>
            <legend>Informations de contact</legend>
            <QInput
                v-model="associationStore.association.address"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="Adresse postale"
                lazy-rules
            />
            <QInput
                v-model="associationStore.association.phone"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="Téléphone"
                lazy-rules
            />
            <QInput
                v-model="associationStore.association.email"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="Adresse mail"
                lazy-rules
            />
            <QInput
                v-model="associationStore.association.website"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="Site web"
                lazy-rules
            />
            <!-- TODO: social networks -->
        </fieldset>
        <section class="btn-group">
            <QBtn
                :to="{name: 'ManageAssociations'}"
                color="secondary"
                icon="mdi-arrow-left-circle"
                label="Revenir aux associations"
            />
            <QBtn
                color="primary"
                icon="mdi-check-circle"
                label="Valider les changements"
            />
            <QBtn
                color="red"
                icon="mdi-delete"
                label="Supprimer la fiche"
            />
        </section>
    </QForm>
</template>

<style lang="sass" scoped>
fieldset
    border: none

legend
    background-color: $primary
    color: #fff
    font-size: 2em
    text-align: center
    width: 100%
    margin-bottom: 15px

.btn-group
    display: flex
    gap: 10px
    padding-left: 15px
</style>