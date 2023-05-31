<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/stores/useUserStore'
import useUtility from '@/composables/useUtility'
import useSubmitProject from '@/composables/useSubmitProject'
import axios from 'axios'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {onMounted, watch} from 'vue'
import useUsers from '@/composables/useUsers'

const {t} = useI18n()
const {phoneRegex} = useUtility()
const userStore = useUserStore()
const {projectBasicInfos, projectAssociation, initProjectAssociation} = useSubmitProject()
const associationStore = useAssociationStore()
const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()
const {userToUpdate} = useUsers()

const props = defineProps<{
    association: number | null
}>()

const initUser = () => {
    if (!props.association && userStore.user) {
        userToUpdate.value.firstName = userStore.user.firstName
        userToUpdate.value.lastName = userStore.user.lastName
        userToUpdate.value.email = userStore.user.email
        userToUpdate.value.phone = userStore.user.phone
        userToUpdate.value.address = userStore.user.address
        userToUpdate.value.zipcode = userStore.user.zipcode
        userToUpdate.value.city = userStore.user.city
        userToUpdate.value.country = userStore.user.country
    }
}

// Get association details if applicant is an association
async function onGetAssociationDetails() {
    if (props.association) {
        try {
            await associationStore.getAssociationDetail(props.association, false)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
                })
            }
        }
    }
}

onMounted(async () => {
    loading.show()
    await onGetAssociationDetails()
    initProjectAssociation()
    initUser()
    loading.hide()
})

watch(() => associationStore.association, initProjectAssociation)
watch(() => userStore.user, initUser)

</script>

<template>
    <fieldset>
        <legend class="title-3">{{ t('project.contact-infos') }}</legend>
        <section v-if="props.association">
            <div class="info-panel info-panel-warning">
                <i
                    aria-hidden="true"
                    class="bi bi-exclamation-lg"
                ></i>
                <p>{{ t('project.verify-contact-infos') }}</p>
            </div>
            <fieldset>
                <legend class="title-4">{{ t('association.association') }}</legend>
                <QInput
                    v-model="projectAssociation.name"
                    :label="t('association.labels.name')"
                    filled
                    readonly
                />
                <QInput
                    v-model="projectAssociation.email"
                    :label="t('association.labels.mail')"
                    :rules="projectAssociation.email ? [(val, rules) => rules.email(val) || t('forms.required-email')] : []"
                    clearable
                    filled
                    type="email"
                />
                <QInput
                    v-model="projectAssociation.phone"
                    :label="t('association.labels.phone')"
                    :rules="projectAssociation.phone ? [val => phoneRegex.test(val) || t('forms.required-phone')] : []"
                    clearable
                    filled
                    type="tel"
                />
                <fieldset class="address-fields">
                    <legend class="title-4">{{ t('association.labels.address') }}</legend>
                    <QInput
                        v-model="projectAssociation.address"
                        :label="t('address.address')"
                        clearable
                        filled
                    />
                    <div class="flex-section">
                        <QInput
                            v-model="projectAssociation.zipcode"
                            :label="t('address.zipcode')"
                            clearable
                            filled
                        />
                        <QInput
                            v-model="projectAssociation.city"
                            :label="t('address.city')"
                            clearable
                            filled
                        />
                        <QInput
                            v-model="projectAssociation.country"
                            :label="t('address.country')"
                            clearable
                            filled
                        />
                    </div>
                </fieldset>
            </fieldset>
            <fieldset>
                <legend class="title-4">{{ t('association.president') }}</legend>
                <QInput
                    v-model="projectAssociation.presidentNames"
                    :label="t('association.labels.president-name')"
                    :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                    clearable
                    filled
                    lazy-rules
                />
                <!--                                <QInput
                    v-model="association.presidentEmail"
                    :label="t('association.labels.president-mail')"
                    :rules="association.presidentEmail ? [(val, rules) => rules.email(val) || t('forms.required-email')] : []"
                    clearable
                    filled
                    type="email"
                />-->
                <QInput
                    v-model="projectAssociation.presidentPhone"
                    :label="t('association.labels.president-phone')"
                    :rules="projectAssociation.presidentPhone ? [val => phoneRegex.test(val) || t('forms.required-phone')] : []"
                    class="no-rules"
                    clearable
                    filled
                    type="tel"
                />
            </fieldset>
            <fieldset>
                <legend class="title-4">{{ t('project.applicant') }}</legend>
                <QInput
                    v-model="projectBasicInfos.otherFirstName"
                    :label="t('project.other-first-name')"
                    class="no-rules"
                    clearable
                    filled
                    lazy-rules
                />
                <QInput
                    v-model="projectBasicInfos.otherLastName"
                    :label="t('project.other-last-name')"
                    class="no-rules"
                    clearable
                    filled
                    lazy-rules
                />
                <QInput
                    v-model="projectBasicInfos.otherEmail"
                    :label="t('project.other-email')"
                    :rules="projectBasicInfos.otherEmail ? [(val, rules) => rules.email(val) || t('forms.required-email')] : []"
                    class="no-rules"
                    clearable
                    filled
                    lazy-rules
                    type="mail"
                />
                <QInput
                    v-model="projectBasicInfos.otherPhone"
                    :label="t('project.other-phone')"
                    :rules="projectBasicInfos.otherPhone ? [val => phoneRegex.test(val) || t('forms.required-phone')] : []"
                    class="no-rules"
                    clearable
                    filled
                    type="tel"
                />
            </fieldset>
        </section>
        <section v-else>
            <div class="info-panel info-panel-warning">
                <i
                    aria-hidden="true"
                    class="bi bi-exclamation-lg"
                ></i>
                <p>{{ t('project.verify-contact-infos') }}</p>
            </div>
            <fieldset>
                <QInput
                    v-model="userToUpdate.firstName"
                    :label="t('user.first-name')"
                    filled
                    readonly
                />
                <QInput
                    v-model="userToUpdate.lastName"
                    :label="t('user.last-name')"
                    filled
                    readonly
                />
                <QInput
                    v-model="userToUpdate.email"
                    :label="t('user.email')"
                    filled
                    readonly
                />
                <QInput
                    v-model="userToUpdate.phone"
                    :label="t('user.phone')"
                    :rules="userToUpdate.phone ? [val => phoneRegex.test(val) || t('forms.required-phone')] : []"
                    clearable
                    filled
                    type="tel"
                />
                <fieldset>
                    <QInput
                        v-model="userToUpdate.address"
                        :label="t('address.address')"
                        clearable
                        filled
                    />
                    <div class="flex-section">
                        <QInput
                            v-model="userToUpdate.zipcode"
                            :label="t('address.zipcode')"
                            clearable
                            filled
                        />
                        <QInput
                            v-model="userToUpdate.city"
                            :label="t('address.city')"
                            clearable
                            filled
                        />
                        <QInput
                            v-model="userToUpdate.country"
                            :label="t('address.country')"
                            clearable
                            filled
                        />
                    </div>
                </fieldset>
            </fieldset>
        </section>
    </fieldset>
</template>

<style lang="scss" scoped>
.flex-section {
    display: flex;
    gap: 1rem;
}

.flex-section > * {
    width: 100%;
}

fieldset {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>