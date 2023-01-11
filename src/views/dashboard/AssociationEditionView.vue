<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {useAssociationStore} from '@/stores/useAssociationStore'
import useDirectory from '@/composables/useDirectory'
import {useRoute} from 'vue-router'
import useAssociation from '@/composables/useAssociation'
import FormAssociationSocialNetworks from '@/components/form/FormAssociationSocialNetworks.vue'

const {t} = useI18n()
const {notify} = useQuasar()
const {loading} = useQuasar()
const {getAssociationDetail} = useDirectory()
const {
    associationInstitutionsLabels,
    getAssociationInstitutions,
    getCurrentInstitutionLabel,
    associationComponentsLabels,
    getAssociationComponents,
    getCurrentComponentLabel,
    associationFieldsLabels,
    getAssociationFields,
    getCurrentFieldLabel
} = useAssociation()

const route = useRoute()
const associationStore = useAssociationStore()

const associationInstitution = ref()
const associationComponent = ref()
const associationField = ref()


onMounted(async function () {
    loading.show
    await onGetAssociationDetail()
    await onGetAssociationInstitutions()
    associationInstitution.value = getCurrentInstitutionLabel()
    await onGetAssociationComponents()
    associationComponent.value = getCurrentComponentLabel()
    await onGetAssociationFields()
    associationField.value = getCurrentFieldLabel()
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

// TODO: add try and catch
async function onGetAssociationInstitutions() {
    await getAssociationInstitutions()
}

// TODO: add try and catch
async function onGetAssociationComponents() {
    await getAssociationComponents()
}

// TODO: add try and catch
async function onGetAssociationFields() {
    await getAssociationFields()
}

async function onValidateChanges() {
    //
}
</script>

<template>
    <h1>{{ associationStore.association?.name }}</h1>
    <QForm
        v-if="associationStore.association"
        @submit.prevent="onValidateChanges"
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
            <legend>{{ t('association.titles.info') }}</legend>
            <QInput
                v-model="associationStore.association.acronym"
                :label="t('association.labels.acronym')"
                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                filled
                lazy-rules
            />
            <QInput
                v-model="associationStore.association.description"
                :label="t('association.labels.description')"
                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                filled
                lazy-rules
                type="textarea"
            />
            <QInput
                v-model="associationStore.association.activities"
                :label="t('association.labels.activities')"
                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                filled
                lazy-rules
                type="textarea"
            />
            <QSelect
                v-model="associationInstitution"
                :label="t('association.labels.institution')"
                :options="associationInstitutionsLabels"
                filled
            />
            <QSelect
                v-model="associationComponent"
                :label="t('association.labels.component')"
                :options="associationComponentsLabels"
                filled
            />
            <QSelect
                v-model="associationField"
                :label="t('association.labels.field')"
                :options="associationFieldsLabels"
                filled
            />
        </fieldset>
        <fieldset>
            <legend>{{ t('association.titles.admin') }}</legend>
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
            <legend>{{ t('association.titles.contact') }}</legend>
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
        </fieldset>
        <FormAssociationSocialNetworks/>
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

.btn-group
    display: flex
    gap: 10px
    padding-left: 15px
    margin: 25px auto 20px auto

.q-select
    margin-bottom: 20px

legend
    background-color: $primary
    color: #fff
    font-size: 2em
    text-align: center
    width: 100%
    margin-bottom: 15px
</style>