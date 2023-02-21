<script lang="ts" setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {onBeforeRouteLeave} from 'vue-router'
import {type QFile, useQuasar} from 'quasar'
import useAssociation from '@/composables/useAssociation'
import FormAssociationSocialNetworks from '@/components/form/FormAssociationSocialNetworks.vue'
import AlertConfirmAssociationDeletion from '@/components/alert/AlertConfirmAssociationDeletion.vue'
import AlertConfirmAssociationEnabled from '@/components/alert/AlertConfirmAssociationEnabled.vue'
import AlertConfirmAssociationPublication from '@/components/alert/AlertConfirmAssociationPublication.vue'
import AlertLeaveEdition from '@/components/alert/AlertLeaveEdition.vue'
import router from '@/router'
import useUtility from '@/composables/useUtility'
import type {AssociationLogo, EditedAssociation} from '#/association'
import axios from 'axios'
import useUserGroups from "@/composables/useUserGroups";


const {t} = useI18n()
const {notify, loading} = useQuasar()
const {formatDate} = useUtility()
const {
    checkChanges,
    updateAssociation,
    altLogoText,
    changeAssociationLogo
} = useAssociation()
const {isStaff} = useUserGroups()

const associationStore = useAssociationStore()

const association = ref<EditedAssociation>({
    institution: null,
    institutionComponent: null,
    activityField: null,
    name: '',
    acronym: '',
    socialObject: '',
    currentProjects: '',
    address: '',
    phone: '',
    email: '',
    siret: '',
    website: '',
    presidentNames: '',
    presidentPhone: '',
    approvalDate: '',
    lastGoaDate: '',
    studentCount: null,
    isPublic: false,
    altLogo: ''
})

const initValues = () => {
    association.value.name = associationStore.association?.name as string
    association.value.acronym = associationStore.association?.acronym as string
    association.value.socialObject = associationStore.association?.socialObject as string
    association.value.currentProjects = associationStore.association?.currentProjects as string
    association.value.address = associationStore.association?.address as string
    association.value.phone = associationStore.association?.phone as string
    association.value.email = associationStore.association?.email as string
    association.value.siret = associationStore.association?.siret as string
    association.value.website = associationStore.association?.website as string
    association.value.presidentNames = associationStore.association?.presidentNames as string
    association.value.presidentPhone = associationStore.association?.presidentPhone as string
    association.value.approvalDate = formatDate(associationStore.association?.approvalDate as string) as string
    association.value.lastGoaDate = formatDate(associationStore.association?.lastGoaDate as string) as string
    association.value.institution = associationStore.institutionLabels.find(({value}) => value === associationStore.association?.institution?.id)?.value
    association.value.institutionComponent = associationStore.institutionComponentLabels.find(({value}) => value === associationStore.association?.institutionComponent?.id)?.value
    association.value.activityField = associationStore.activityFieldLabels.find(({value}) => value === associationStore.association?.activityField?.id)?.value
    association.value.studentCount = associationStore.association?.studentCount as number
    association.value.isPublic = associationStore.association?.isPublic as boolean
}
watch(() => associationStore.association, initValues)

onMounted(async () => {
    loading.show
    initValues()
    loading.hide
})

// Logo management
const altLogoComputed = computed<string>(() => {
    return associationStore.association?.altLogo === undefined ? '' : associationStore.association?.altLogo
})
const altLogo = ref<string>(altLogoComputed.value)
const newLogo = ref<undefined | Blob>(undefined)
const pathLogo = ref<AssociationLogo | null | undefined>(associationStore.association?.pathLogo)
watch(() => associationStore.association?.pathLogo, () => {
    pathLogo.value = associationStore.association?.pathLogo
})

// Open alert if user leaves without saving
const openAlert = ref<boolean>(false)
const leaveEdition = ref<boolean>(false)

function onLeaveEdition() {
    leaveEdition.value = true
    router.push(isStaff ? {name: 'ManageAssociations'} : {name: 'AssociationDashboard'})
}

// Check is there are any changes before leaving the page
onBeforeRouteLeave((to, from, next) => {
    if (Object.keys(checkChanges(association.value)).length > 0) {
        openAlert.value = true
        if (!leaveEdition.value) {
            next(false)
        } else {
            next(true)
        }
    } else {
        next(true)
    }
})

// Validate changes
async function onValidateChanges() {
    if (Object.keys(checkChanges(association.value)).length > 0) {
        try {
            await updateAssociation()
            notify({
                message: t('notifications.positive.association-successfully-updated'),
                type: 'positive'
            })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                notify({
                    message: t('notifications.negative.edit-association-error'),
                    type: 'negative'
                })
            }
        }
    } else {
        notify({
            message: t('notifications.positive.association-up-to-date'),
            type: 'positive'
        })
    }
}

// Update association logo details
async function onChangeLogo(action: string) {
    try {
        if (action === 'update') {
            await changeAssociationLogo(newLogo.value, altLogo.value, null)
            altLogo.value = altLogoComputed.value
        } else if (action === 'delete') {
            const deleteLogoData = {'altLogo': null, 'pathLogo': null}
            await changeAssociationLogo(undefined, "", deleteLogoData)
            altLogo.value = ""
            newLogo.value = undefined
        }
        notify({
            message: t('notifications.positive.association-logo-updated'),
            type: 'positive'
        })
    } catch (error) {
        if (axios.isAxiosError(error)) {
            notify({
                message: t('notifications.negative.association-logo-edit-error'),
                type: 'negative'
            })
        }
    }
}
</script>

<template>
    <QForm @submit.prevent="onChangeLogo('update')">
        <fieldset>
            <div class="logo">
                <QImg :alt="altLogoText(association)" :ratio="1"
                      :src="(pathLogo && Object.keys(pathLogo).length > 0) ? (pathLogo.detail ? pathLogo.detail : '/images/no_logo.png') : '/images/no_logo.png'"/>
            </div>
            <QFile v-model="newLogo" :label="t('association.logo.pickup')" accept=".jpg, .jpeg, .png" filled/>
            <QInput v-model="altLogo" :label="t('association.logo.alt')" filled/>
            <QBtn :label="t('association.logo.update')" color="primary" icon="mdi-check-circle" type="submit"/>
            <QBtn :label="t('association.logo.remove')" color="red" icon="mdi-delete" @click="onChangeLogo('delete')"/>
        </fieldset>
    </QForm>

    <QForm @submit.prevent="onValidateChanges">
        <fieldset>
            <legend>{{ t('association.titles.info') }}</legend>
            <QInput
                v-model="association.name"
                :disable=!isStaff
                :label="t('association.labels.name')"
                :rules="[val => val && val.length > 0 || t('forms.fill-field')]" filled
                lazy-rules
            />
            <QInput
                v-model="association.acronym"
                :label="t('association.labels.acronym')"
                filled
            />
            <QInput
                v-model="association.socialObject"
                :hint="t('forms.social-object-hint')"
                :label="t('association.labels.social-object')"
                filled
                type="textarea"
            />
            <QInput
                v-model="association.currentProjects"
                :label="t('association.labels.current-projects')"
                filled
                type="textarea"
            />
            <QSelect
                v-model="association.institution"
                :label="t('association.labels.institution')"
                :options="associationStore.institutionLabels"
                emit-value
                filled
                map-options
            />
            <QSelect v-model="association.institutionComponent" :label="t('association.labels.institution-component')"
                     :options="associationStore.institutionComponentLabels" emit-value filled map-options/>
            <QSelect v-model="association.activityField" :label="t('association.labels.activity-field')"
                     :options="associationStore.activityFieldLabels" emit-value filled map-options/>
        </fieldset>
        <fieldset>
            <legend>{{ t('association.titles.admin') }}</legend>
            <QInput v-model="association.presidentNames" :label="t('association.labels.president-name')" filled/>
            <QInput v-model="association.presidentPhone" :label="t('association.labels.president-phone')" filled/>
            <QInput v-model="association.lastGoaDate" :label="t('association.labels.last-goa')" filled type="date">
                <template v-slot:prepend>
                    <QIcon name="mdi-calendar"/>
                </template>
            </QInput>
            <QInput v-model="association.siret" :label="t('association.labels.siret')" filled inputmode="numeric"/>
        </fieldset>
        <fieldset>
            <legend>{{ t('association.titles.contact') }}</legend>
            <QInput
                v-model="association.address"
                :label="t('association.labels.address')"
                filled
            />
            <QInput v-model="association.phone" :label="t('association.labels.phone')" filled type="tel"/>
            <QInput v-model="association.email" :label="t('association.labels.mail')" filled type="email"/>
            <QInput v-model="association.website" :label="t('association.labels.website')" filled type="url"/>
        </fieldset>
        <FormAssociationSocialNetworks/>
        <section class="btn-group">
            <QBtn
                :label="t('association.go-back')"
                :to="isStaff ? { name: 'ManageAssociations' } : { name: 'AssociationDashboard' }"
                color="secondary"
                icon="mdi-arrow-left-circle"
            />
            <!-- Add confirmation pop up -->
            <QBtn
                :label="t('association.validate-all-changes')"
                color="primary"
                icon="mdi-check-circle"
                type="submit"
            />
            <AlertConfirmAssociationEnabled
                v-if="isStaff"
            />
            <AlertConfirmAssociationPublication
                v-if="associationStore.association?.isEnabled && associationStore.association?.isSite"/>
            <AlertConfirmAssociationDeletion
                v-if="isStaff && !associationStore.association?.isEnabled"
            />
        </section>
        <AlertLeaveEdition
            :open-alert="openAlert"
            :text="t('alerts.leave-association-edition')"
            @closeAlert="openAlert = !openAlert"
            @leaveEdition="onLeaveEdition"
        />
    </QForm>
</template>

<style lang="sass" scoped>
fieldset
    border: none

.logo
    width: 150px
    height: 150px

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
