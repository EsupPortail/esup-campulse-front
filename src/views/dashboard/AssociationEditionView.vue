<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {useAssociationStore} from '@/stores/useAssociationStore'
import useDirectory from '@/composables/useDirectory'
import {onBeforeRouteLeave, useRoute} from 'vue-router'
import useAssociation from '@/composables/useAssociation'
import FormAssociationSocialNetworks from '@/components/form/FormAssociationSocialNetworks.vue'
import AlertLeaveAssociationEdition from '@/components/alert/AlertLeaveAssociationEdition.vue'
import router from '@/router'
import useUtility from '@/composables/useUtility'
import type {AssociationSocialNetwork, EditedAssociation} from '#/association'

const {t} = useI18n()
const {formatDate, dateRegex} = useUtility()
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

const association = ref<EditedAssociation>({
    institution: null,
    institutionComponent: null,
    activityField: null,
    name: '',
    acronym: '',
    description: '',
    activities: '',
    address: '',
    phone: '',
    email: '',
    siret: null,
    website: '',
    presidentNames: '',
    approvalDate: '',
    lastGoaDate: '',
    socialNetworks: []
})

const associationInstitution = ref()
const associationComponent = ref()
const associationField = ref()

const initLabels = () => {
    associationInstitution.value = getCurrentInstitutionLabel()
    associationComponent.value = getCurrentComponentLabel()
    associationField.value = getCurrentFieldLabel()
}
watch(() => associationStore.association, initLabels)

const initValues = () => {
    association.value.name = associationStore.association?.name as string
    association.value.acronym = associationStore.association?.acronym as string
    association.value.description = associationStore.association?.description as string
    association.value.activities = associationStore.association?.activities as string
    association.value.address = associationStore.association?.address as string
    association.value.phone = associationStore.association?.phone as string
    association.value.email = associationStore.association?.email as string
    association.value.siret = associationStore.association?.siret as number
    association.value.website = associationStore.association?.website as string
    association.value.presidentNames = associationStore.association?.presidentNames as string
    association.value.approvalDate = formatDate(associationStore.association?.approvalDate as string) as string
    association.value.lastGoaDate = formatDate(associationStore.association?.lastGoaDate as string) as string
    association.value.socialNetworks = associationStore.association?.socialNetworks as AssociationSocialNetwork[]
    association.value.institution = associationInstitution.value.value
    association.value.institutionComponent = associationComponent.value.value
    association.value.activityField = associationField.value.value
}
watch(() => associationStore.association, initValues)

onMounted(async function () {
    loading.show
    await onGetAssociationInstitutions()
    await onGetAssociationComponents()
    await onGetAssociationFields()
    await onGetAssociationDetail()
    loading.hide
})
watch(() => associationStore.association, initValues)


const openAlert = ref<boolean>(false)
const leaveEdition = ref<boolean>(false)

onBeforeRouteLeave((to, from, next) => {
    openAlert.value = true
    if (!leaveEdition.value) {
        next(false)
    } else {
        next(true)
    }
})

function onLeaveEdition() {
    leaveEdition.value = true
    router.push({name: 'ManageAssociations'})
    associationStore.association = undefined
}

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

function onCheckChanges() {
    checkChanges(association)
}

async function onValidateChanges() {
    //
    onCheckChanges()
    await associationStore.updateAssociation()
}
</script>

<template>
    <h1>{{ association?.name }}</h1>
    <QForm
        v-if="association"
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
                v-model="association.acronym"
                :label="t('association.labels.acronym')"
                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                filled
                lazy-rules
            />
            <QInput
                v-model="association.description"
                :label="t('association.labels.description')"
                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                filled
                lazy-rules
                type="textarea"
            />
            <QInput
                v-model="association.activities"
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
                v-model="association.presidentNames"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="Nom du président ou de la présidente"
                lazy-rules
            />
            <QInput
                v-model="association.approvalDate"
                :rules="[ val => val && val.length > 0 && dateRegex.test(val) || 'Please type something']"
                filled
                label="Date d'agrément"
                lazy-rules
                mask="##/##/####"
            >
                <template v-slot:prepend>
                    <QIcon name="mdi-calendar"/>
                </template>
            </QInput>
            <QInput
                v-model="association.lastGoaDate"
                :rules="[ val => val && val.length > 0 && dateRegex.test(val) || 'Please type something']"
                filled
                label="Date de la dernière AGO"
                lazy-rules
                mask="##/##/####"
            >
                <template v-slot:prepend>
                    <QIcon name="mdi-calendar"/>
                </template>
            </QInput>
            <QInput
                v-model="association.siret"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="Siret"
                lazy-rules
            />
        </fieldset>
        <fieldset>
            <legend>{{ t('association.titles.contact') }}</legend>
            <QInput
                v-model="association.address"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="Adresse postale"
                lazy-rules
            />
            <QInput
                v-model="association.phone"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="Téléphone"
                lazy-rules
            />
            <QInput
                v-model="association.email"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="Adresse mail"
                lazy-rules
            />
            <QInput
                v-model="association.website"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="Site web"
                lazy-rules
            />
        </fieldset>
        <FormAssociationSocialNetworks :social-networks="association.socialNetworks"/>
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
                type="submit"
                @click="onValidateChanges"
            />
            <QBtn
                color="red"
                icon="mdi-delete"
                label="Supprimer la fiche"
            />
        </section>
        <AlertLeaveAssociationEdition
            :open-alert="openAlert"
            @closeAlert="openAlert = !openAlert"
            @leaveEdition="onLeaveEdition"
        />
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