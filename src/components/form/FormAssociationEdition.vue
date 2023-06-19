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
import AlertConfirmAssociationProjectSubmission from '@/components/alert/AlertConfirmAssociationProjectSubmission.vue'
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
const {formatDate, phoneRegex, urlRegex} = useUtility()
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
    zipcode: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    siret: '',
    website: '',
    presidentNames: '',
    presidentPhone: '',
    approvalDate: '',
    lastGoaDate: '',
    amountMembersAllowed: '',
    isPublic: false,
    altLogo: '',
    studentCount: ''
})

const initValues = () => {
    association.value.name = associationStore.association?.name as string
    association.value.acronym = associationStore.association?.acronym as string
    association.value.socialObject = associationStore.association?.socialObject as string
    association.value.currentProjects = associationStore.association?.currentProjects as string
    association.value.address = associationStore.association?.address as string
    association.value.zipcode = associationStore.association?.zipcode as string
    association.value.city = associationStore.association?.city as string
    association.value.country = associationStore.association?.country as string
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
    association.value.amountMembersAllowed = associationStore.association?.amountMembersAllowed ? associationStore.association.amountMembersAllowed.toString() : '0'
    association.value.isPublic = associationStore.association?.isPublic as boolean
    association.value.studentCount = associationStore.association?.studentCount ? associationStore.association.studentCount.toString() : '0'
}
watch(() => associationStore.association, initValues)

const membersCount = ref<number>(0)

const initMembersCount = () => {
    if (associationStore.association) {
        associationStore.getAssociationUsers(associationStore.association.id)
        membersCount.value = associationStore.associationUsers.length
    }
}
watch(() => associationStore.association, initMembersCount)

onMounted(async () => {
    loading.show()
    initValues()
    initMembersCount()
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
    loading.show()
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
    loading.hide()
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
                    :aria-hidden="(pathLogo && Object.keys(pathLogo).length > 0) ? (pathLogo.detail ? false : true) : true"
                    :ratio="1"
                    :src="(pathLogo && Object.keys(pathLogo).length > 0) ? (pathLogo.detail ? pathLogo.detail : noLogoSquare.default) : noLogoSquare.default"
                />
            </div>

            <div class="association-name">
                <!--<h2>{{ association?.name }}</h2>-->
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
                clearable
                filled
                @rejected="onLogoRejected"
            />
            <QInput
                v-model="altLogo"
                :label="t('association.logo.alt') + ' *'"
                :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                aria-required="true"
                class="logo-input"
                clearable
                filled
            />

            <div class="btn-group">
                <QBtn
                    :label="t('association.logo.update')"
                    icon="bi-check-lg"
                    type="submit"
                />
                <QBtn
                    :label="t('association.logo.remove')"
                    class="bg-delete"
                    icon="bi-trash"
                    @click="onChangeLogo('delete')"
                />
            </div>
        </section>

        <fieldset>
            <h3>
                <i
                    aria-hidden="true"
                    class="bi bi-book"
                ></i>{{ t('association.titles.info') }}
            </h3>
            <section class="form-container">
                <div class="display-row">
                    <QInput
                        v-model="association.name"
                        :disable=!isStaff
                        :label="t('association.labels.name') + ' *'"
                        :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                        aria-required="true"
                        clearable
                        filled
                        lazy-rules
                    />
                    <QInput
                        v-model="association.acronym"
                        :label="t('association.labels.acronym')"
                        clearable
                        filled
                    />
                    <QInput
                        v-model="association.socialObject"
                        :hint="t('forms.social-object-hint')"
                        :label="t('association.labels.social-object')"
                        clearable
                        filled
                        type="textarea"
                    />
                    <QInput
                        v-model="association.currentProjects"
                        :label="t('association.labels.current-projects')"
                        clearable
                        filled
                        type="textarea"
                    />
                    <QSelect
                        v-model="association.institution"
                        :label="t('association.labels.institution') + ' *'"
                        :options="associationStore.institutionLabels"
                        :rules="[val => val || t('forms.fill-field')]"
                        aria-required="true"
                        clearable
                        emit-value
                        filled
                        map-options
                    />
                    <QSelect
                        v-model="association.institutionComponent"
                        :label="t('association.labels.institution-component')"
                        :options="associationStore.institutionComponentLabels"
                        clearable
                        emit-value
                        filled
                        map-options
                    />
                    <QSelect
                        v-model="association.activityField"
                        :label="t('association.labels.activity-field') + ' *'"
                        :options="associationStore.activityFieldLabels"
                        :rules="[val => val || t('forms.fill-field')]"
                        aria-required="true"
                        clearable
                        emit-value
                        filled
                        map-options
                    />
                </div>
            </section>
        </fieldset>

        <fieldset>
            <h3>
                <i
                    aria-hidden="true"
                    class="bi bi-clipboard-check"
                ></i>{{ t('association.titles.admin') }}
            </h3>
            <section class="form-container">
                <div class="display-row">
                    <QInput
                        v-model="association.presidentNames"
                        :label="t('association.labels.president-name')"
                        clearable
                        filled
                    />
                    <QInput
                        v-model="association.presidentPhone"
                        :label="t('association.labels.president-phone')"
                        :rules="association.presidentPhone ? [val => phoneRegex.test(val) || t('forms.required-phone')] : []"
                        clearable
                        filled
                        type="tel"
                    />
                    <QInput
                        v-model="association.lastGoaDate"
                        :label="t('association.labels.last-goa')"
                        clearable
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
                        clearable
                        filled
                        inputmode="numeric"
                    />
                    <QInput
                        v-if="hasPerm('change_association_all_fields')"
                        v-model="association.amountMembersAllowed"
                        :hint="`${t('forms.amount-student-allowed-cannot-be-inferior-to-members')} : ${membersCount}`"
                        :label="t('association.labels.amount-members-allowed')"
                        :rules="[val => parseInt(val) >= membersCount || t('forms.amount-members-allowed-must-be-superior-to-members')]"
                        clearable
                        filled
                        inputmode="numeric"
                        lazy-rules
                        min="0"
                        type="number"
                    />
                    <QInput
                        v-model="association.studentCount"
                        :label="t('forms.association-student-count')"
                        clearable
                        filled
                        inputmode="numeric"
                        min="0"
                        type="number"
                    />
                </div>
            </section>
        </fieldset>

        <fieldset>
            <h3>
                <i
                    aria-hidden="true"
                    class="bi bi-telephone"
                ></i>{{ t('association.titles.contact') }}
            </h3>
            <section class="form-container">
                <div class="display-row">
                    <fieldset class="address-fields">
                        <legend>{{ t('association.labels.address') }}</legend>
                        <QInput
                            v-model="association.address"
                            :label="t('association.labels.address')"
                            clearable
                            filled
                        />
                        <div>
                            <QInput
                                v-model="association.zipcode"
                                :label="t('address.zipcode')"
                                clearable
                                filled
                            />
                            <QInput
                                v-model="association.city"
                                :label="t('address.city')"
                                clearable
                                filled
                            />
                            <QInput
                                v-model="association.country"
                                :label="t('address.country')"
                                clearable
                                filled
                            />
                        </div>
                    </fieldset>
                    <QSeparator
                        aria-hidden="true"
                        role="presentation"
                    />
                    <QInput
                        v-model="association.phone"
                        :label="t('association.labels.phone')"
                        :rules="association.phone ? [val => phoneRegex.test(val) || t('forms.required-phone')] : []"
                        clearable
                        filled
                        type="tel"
                    />
                    <QInput
                        v-model="association.email"
                        :label="t('association.labels.mail')"
                        :rules="association.email ? [(val, rules) => rules.email(val) || t('forms.required-email')] : []"
                        clearable
                        filled
                        type="email"
                    />
                    <QInput
                        v-model="association.website"
                        :label="t('association.labels.website')"
                        :rules="association.website ? [val => urlRegex.test(val) || t('forms.required-valid-url')] : []"
                        clearable
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
                    HEAD
                    icon="bi-box-arrow-left"
                />
                <AlertConfirmAssociationUpdate
                    v-if="Object.keys(checkChanges(association)).length > 0"
                    @has-validated="hasValidated = true"
                />
                <AlertConfirmAssociationEnabled
                    v-if="isStaff"
                    @has-validated="hasValidated = true"
                />
                <AlertConfirmAssociationPublication
                    v-if="isStaff && associationStore.association?.isEnabled && associationStore.association?.isSite"
                    @has-validated="hasValidated = true"
                />
                <AlertConfirmAssociationProjectSubmission
                    v-if="isStaff && associationStore.association?.isEnabled"
                    @has-validated="hasValidated = true"
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

<style lang="scss" scoped>
@import '@/assets/styles/associations.scss';
@import '@/assets/styles/forms.scss';

.address-fields div {
  display: flex;
  gap: 1rem;

  * {
    width: 100%;
  }
}

.q-separator {
  margin: 0.5rem 0 1rem 0;
}
</style>
