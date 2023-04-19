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
import AlertConfirmAssociationUpdate from '@/components/alert/AlertConfirmAssociationUpdate.vue'
import AlertLeaveEdition from '@/components/alert/AlertLeaveEdition.vue'
import router from '@/router'
import useUtility from '@/composables/useUtility'
import type {AssociationLogo, EditedAssociation} from '#/association'
import axios from 'axios'
import useUserGroups from '@/composables/useUserGroups'
import useSecurity from '@/composables/useSecurity'
import * as noLogoSquare from '@/assets/img/no_logo_square.png'
import useErrors from '@/composables/useErrors'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {formatDate} = useUtility()
const {
    checkChanges,
    altLogoText,
    changeAssociationLogo
} = useAssociation()
const {isStaff} = useUserGroups()
const {hasPerm} = useSecurity()
const {catchHTTPError} = useErrors()

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
    amountMembersAllowed: null,
    isPublic: false,
    altLogo: ''
})

const associationStudentCount = ref(0)

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
    association.value.institution = associationStore.institutionLabels.find(({value}) => value === associationStore.association?.institution)?.value
    association.value.institutionComponent = associationStore.institutionComponentLabels.find(({value}) => value === associationStore.association?.institutionComponent)?.value
    association.value.activityField = associationStore.activityFieldLabels.find(({value}) => value === associationStore.association?.activityField)?.value
    association.value.amountMembersAllowed = associationStore.association?.amountMembersAllowed as number
    association.value.isPublic = associationStore.association?.isPublic as boolean
    associationStudentCount.value = associationStore.association?.studentCount as number
}
watch(() => associationStore.association, initValues)

onMounted(async () => {
    loading.show()
    initValues()
    loading.hide()
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
const MAX_FILE_SIZE = 8388608

async function onLogoRejected() {
    notify({
        type: 'negative',
        message: t('notifications.negative.413-error')
    })
}

// Open alert if user leaves without saving
const openAlert = ref<boolean>(false)
const leaveEdition = ref<boolean>(false)
const hasValidated = ref<boolean>(false)

function onLeaveEdition() {
    leaveEdition.value = true
    router.push(isStaff.value ? {name: 'ManageAssociations'} : {
        name: 'AssociationDashboard',
        params: {id: associationStore.association?.id}
    })
}

// Check is there are any changes before leaving the page
onBeforeRouteLeave((to, from, next) => {
    if (Object.keys(checkChanges(association.value)).length > 0 && !hasValidated.value) {
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

// Update association logo details
async function onChangeLogo(action: string) {
    try {
        if (action === 'update') {
            await changeAssociationLogo(newLogo.value, altLogo.value, null)
            altLogo.value = altLogoComputed.value
        } else if (action === 'delete') {
            const deleteLogoData = {'altLogo': null, 'pathLogo': null}
            await changeAssociationLogo(undefined, '', deleteLogoData)
            altLogo.value = ''
            newLogo.value = undefined
        }
        notify({
            message: t('notifications.positive.association-logo-updated'),
            type: 'positive'
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}
</script>

<template>
    <QForm
        id="association-edition"
        @submit.prevent="onChangeLogo('update')"
    >
        <section id="association-logo-title">
            <div class="association-logo">
                <QImg
                    :alt="altLogoText(association)"
                    :ratio="1"
                    :src="(pathLogo && Object.keys(pathLogo).length > 0) ? (pathLogo.detail ? pathLogo.detail : noLogoSquare.default) : noLogoSquare.default"
                />
            </div>

            <div class="association-name">
                <h2>{{ association?.name }}</h2>
                <p
                    v-if="association?.acronym"
                    class="acronym"
                >
                    {{ association?.acronym }}
                </p>
            </div>

            <QFile
                v-model="newLogo"
                :label="t('association.logo.pickup')"
                :max-file-size="MAX_FILE_SIZE"
                accept="image/png, image/jpeg"
                filled
                @rejected="onLogoRejected"
            />
            <QInput
                v-model="altLogo"
                :label="t('association.logo.alt')"
                class="logo-input"
                filled
            />

            <div class="btn-group">
                <QBtn
                    :label="t('association.logo.update')"
                    icon="mdi-check-circle"
                    type="submit"
                />
                <QBtn
                    :label="t('association.logo.remove')"
                    color="delete"
                    icon="mdi-delete"
                    @click="onChangeLogo('delete')"
                />
            </div>
        </section>

        <fieldset>
            <h3><i class="bi bi-book"></i>{{ t("association.titles.info") }}</h3>
            <section class="form-container">
                <div class="display-row">
                    <QInput
                        v-model="association.name"
                        :disable=!isStaff
                        :label="t('association.labels.name')"
                        :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                        filled
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
                    <QSelect
                        v-model="association.institutionComponent"
                        :label="t('association.labels.institution-component')"
                        :options="associationStore.institutionComponentLabels"
                        emit-value
                        filled
                        map-options
                    />
                    <QSelect
                        v-model="association.activityField"
                        :label="t('association.labels.activity-field')"
                        :options="associationStore.activityFieldLabels"
                        emit-value
                        filled
                        map-options
                    />
                </div>
            </section>
        </fieldset>

        <fieldset>
            <h3><i class="bi bi-clipboard-check"></i>{{ t('association.titles.admin') }}</h3>
            <section class="form-container">
                <div class="display-row">
                    <QInput
                        v-model="association.presidentNames"
                        :label="t('association.labels.president-name')"
                        filled
                    />
                    <QInput
                        v-model="association.presidentPhone"
                        :label="t('association.labels.president-phone')"
                        filled
                    />
                    <QInput
                        v-model="association.lastGoaDate"
                        :label="t('association.labels.last-goa')"
                        filled
                        type="date"
                    >
                        <template v-slot:prepend>
                            <QIcon name="mdi-calendar"/>
                        </template>
                    </QInput>
                    <QInput
                        v-model="association.siret"
                        :label="t('association.labels.siret')"
                        filled
                        inputmode="numeric"
                    />
                    <QInput
                        v-if="hasPerm('change_association_all_fields')"
                        v-model="association.amountMembersAllowed"
                        :label="t('association.labels.amount-members-allowed')"
                        :rules="[val => val >= associationStudentCount || t('forms.amount-members-allowed-must-be-superior-to-student-count')]"
                        filled
                        inputmode="numeric"
                        lazy-rules
                        min="0"
                        type="number"
                    />
                </div>
            </section>
        </fieldset>

        <fieldset>
            <h3><i class="bi bi-telephone"></i>{{ t('association.titles.contact') }}</h3>
            <section class="form-container">
                <div class="display-row">
                    <QInput
                        v-model="association.address"
                        :label="t('association.labels.address')"
                        filled
                    />
                    <QInput
                        v-model="association.phone"
                        :label="t('association.labels.phone')"
                        filled
                        type="tel"
                    />
                    <QInput
                        v-model="association.email"
                        :label="t('association.labels.mail')"
                        filled
                        type="email"
                    />
                    <QInput
                        v-model="association.website"
                        :label="t('association.labels.website')"
                        filled
                        type="url"
                    />
                </div>
            </section>
        </fieldset>

        <FormAssociationSocialNetworks/>

        <fieldset>
            <div
                class="btn-group"
            >
                <QBtn
                    :label="isStaff ? t('association.go-back') : t('dashboard.association-user.back-to-association-dashboard')"
                    :to="isStaff ? { name: 'ManageAssociations' } : { name: 'AssociationDashboard' }"
                    color="secondary"
                    icon="mdi-arrow-left-circle"
                />
                <AlertConfirmAssociationUpdate
                    v-if="Object.keys(checkChanges(association)).length > 0"
                    @has-validated="hasValidated = true"
                />
                <AlertConfirmAssociationEnabled
                    v-if="isStaff"
                />
                <AlertConfirmAssociationPublication
                    v-if="associationStore.association?.isEnabled && associationStore.association?.isSite && isStaff"
                />
                <AlertConfirmAssociationDeletion
                    v-if="isStaff && !associationStore.association?.isEnabled"
                />
            </div>
        </fieldset>

        <AlertLeaveEdition
            :open-alert="openAlert"
            :text="t('alerts.leave-association-edition')"
            @closeAlert="openAlert = !openAlert"
            @leaveEdition="onLeaveEdition"
        />
    </QForm>
</template>

<style lang="scss">
@import '@/assets/styles/associations.scss';
@import '@/assets/styles/forms.scss';
</style>
