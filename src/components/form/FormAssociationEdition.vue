<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {onBeforeRouteLeave} from 'vue-router'
import useAssociation from '@/composables/useAssociation'
import FormAssociationSocialNetworks from '@/components/form/FormAssociationSocialNetworks.vue'
import AlertConfirmAssociationDeletion from '@/components/alert/AlertConfirmAssociationDeletion.vue'
import AlertConfirmAssociationEnabled from '@/components/alert/AlertConfirmAssociationEnabled.vue'
import AlertLeaveAssociationEdition from '@/components/alert/AlertLeaveAssociationEdition.vue'
import router from '@/router'
import useUtility from '@/composables/useUtility'
import type {EditedAssociation} from '#/association'
import {useQuasar, type QFile} from "quasar";
import axios from "axios";


const {t} = useI18n()
const {notify} = useQuasar()
const {formatDate} = useUtility()
const {
    checkChanges,
    changedData,
} = useAssociation()

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
    siret: '',
    website: '',
    presidentNames: '',
    phonePres: '',
    approvalDate: '',
    lastGoaDate: ''
})

const initValues = () => {
    association.value.name = associationStore.association?.name as string
    association.value.acronym = associationStore.association?.acronym as string
    association.value.description = associationStore.association?.description as string
    association.value.activities = associationStore.association?.activities as string
    association.value.address = associationStore.association?.address as string
    association.value.phone = associationStore.association?.phone as string
    association.value.email = associationStore.association?.email as string
    association.value.siret = associationStore.association?.siret as string
    association.value.website = associationStore.association?.website as string
    association.value.presidentNames = associationStore.association?.presidentNames as string
    association.value.phonePres = associationStore.association?.phonePres as string
    association.value.approvalDate = formatDate(associationStore.association?.approvalDate as string) as string
    association.value.lastGoaDate = formatDate(associationStore.association?.lastGoaDate as string) as string
    association.value.institution = associationStore.institutionLabels.find(({value}) => value === associationStore.association?.institution?.id)?.value
    association.value.institutionComponent = associationStore.componentLabels.find(({value}) => value === associationStore.association?.institutionComponent?.id)?.value
    association.value.activityField = associationStore.fieldLabels.find(({value}) => value === associationStore.association?.activityField?.id)?.value
}
watch(() => associationStore.association, initValues)

onMounted(async () => {
    //initLabels()
    initValues()
})

// Open alert if user leaves without saving
const openAlert = ref<boolean>(false)
const leaveEdition = ref<boolean>(false)
const altLogo = ref<string>('')
const newLogo = ref()
const pathLogo = ref<string | null | undefined>(associationStore.association?.pathLogo)
watch(() => associationStore.association?.pathLogo, () => {pathLogo.value = associationStore.association?.pathLogo})

function onLeaveEdition() {
    leaveEdition.value = true
    router.push({name: 'ManageAssociations'})
}

onBeforeRouteLeave((to, from, next) => {
    checkChanges(association.value)
    if (Object.keys(changedData).length > 0) {
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
    checkChanges(association.value)
    // await associationStore.updateAssociation()
}

// Update association logo details
async function onChangeLogo() {
  const patchLogoData = new FormData()
  patchLogoData.append('pathLogo', newLogo.value)
  patchLogoData.append('altLogo', altLogo.value)
  try {
    await associationStore.updateAssociationLogo(patchLogoData, associationStore.association?.id as number)
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

  <QForm
      class="logo"
      @submit.prevent="onChangeLogo"
  >
    <QImg
        v-if="pathLogo"
        :alt="associationStore.association?.altLogo"
        :src="pathLogo"
        :ratio="1"
    />
    <QFile
       filled
       accept=".jpg, .jpeg, .png"
       :label="t('association.logo.pickup')"
       v-model="newLogo"
    />
    <QInput
       v-model="altLogo"
       :label="t('association.logo.alt')"
       :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
       filled
       lazy-rules
    />
    <QBtn
        color="primary"
        icon="mdi-check-circle"
        :label="t('association.logo.update')"
        type="submit"
    />
  </QForm>

  <QForm
      @submit.prevent="onValidateChanges"
  >
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
                v-model="association.institution"
                :label="t('association.labels.institution')"
                :options="associationStore.institutionLabels"
                emit-value
                filled
                map-options
            />
            <QSelect
                v-model="association.institutionComponent"
                :label="t('association.labels.component')"
                :options="associationStore.componentLabels"
                emit-value
                filled
                map-options
            />
            <QSelect
                v-model="association.activityField"
                :label="t('association.labels.field')"
                :options="associationStore.fieldLabels"
                emit-value
                filled
                map-options
            />
        </fieldset>
        <fieldset>
            <legend>{{ t('association.titles.admin') }}</legend>
            <QInput
                v-model="association.presidentNames"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="t('association.labels.president-name')"
                lazy-rules
            />
            <QInput
                v-model="association.phonePres"
                filled
                label="t('association.labels.president-phone')"
                lazy-rules
                class="without-rules"
            />
          <!-- Warning : Removed approval date input -->
            <QInput
                v-model="association.lastGoaDate"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="t('association.labels.last-goa')"
                lazy-rules
                type="date"
            >
                <template v-slot:prepend>
                    <QIcon name="mdi-calendar"/>
                </template>
            </QInput>
          <!-- Warning : Removed not-empty rules on siret input -->
            <QInput
                v-model="association.siret"
                filled
                inputmode="numeric"
                label="t('association.labels.siret')"
                lazy-rules
                class="without-rules"
            />
        </fieldset>
        <fieldset>
            <legend>{{ t('association.titles.contact') }}</legend>
            <QInput
                v-model="association.address"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="t('association.labels.address')"
                lazy-rules
            />
            <QInput
                v-model="association.phone"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="t('association.labels.phone')"
                lazy-rules
                type="tel"
            />
            <QInput
                v-model="association.email"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="t('association.labels.mail')"
                lazy-rules
                type="email"
            />
            <QInput
                v-model="association.website"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                filled
                label="t('association.labels.website')"
                lazy-rules
                type="url"
            />
        </fieldset>
        <FormAssociationSocialNetworks/>
        <section class="btn-group">
            <QBtn
                :to="{name: 'ManageAssociations'}"
                color="secondary"
                icon="mdi-arrow-left-circle"
                label="t('association.go-back')"
            />
            <QBtn
                color="primary"
                icon="mdi-check-circle"
                label="t('association.validate-all-changes')"
                type="submit"
            />
            <AlertConfirmAssociationEnabled/>
            <AlertConfirmAssociationDeletion v-if="!associationStore.association.isEnabled"/>
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

.without-rules
  margin-bottom: 1rem

legend
    background-color: $primary
    color: #fff
    font-size: 2em
    text-align: center
    width: 100%
    margin-bottom: 15px
</style>
