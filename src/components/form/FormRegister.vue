<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {QInput, useQuasar} from 'quasar'
import {useUserStore} from '@/stores/useUserStore'
import router from '@/router'
import LayoutGDPRConsent from '@/components/form/FormGDPRConsent.vue'
import useSecurity from '@/composables/useSecurity'
import axios from 'axios'
import FormUserGroups from '@/components/form/FormUserGroups.vue'
import FormRegisterUserAssociations from '@/components/form/FormRegisterUserAssociations.vue'
import useUserGroups from '@/composables/useUserGroups'
import FormAddUserFromLDAP from '@/components/form/FormAddUserFromLDAP.vue'
import useUtility from '@/composables/useUtility'
import useErrors from '@/composables/useErrors'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const userStore = useUserStore()
const {register, newUser, initNewUserData, loadCASUser, emailVerification, addUserAsManager} = useSecurity()
const {groupChoiceIsValid, groupCanJoinAssociation, isStaff} = useUserGroups()
const {phoneRegex} = useUtility()
const {catchHTTPError} = useErrors()


const hasConsent = ref<boolean>(false)

onMounted(async () => {
    loading.show()
    initNewUserData()
    await onLoadCASUser()
    loading.hide()
})

async function onLoadCASUser() {
    try {
        await loadCASUser()
    } catch (error) {
        await router.push({name: 'Login'})
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

// Register newUser
async function onRegister() {
    if (groupChoiceIsValid.value) {
        if (isStaff.value || hasConsent.value) {
            try {
                if (isStaff.value) {
                    await addUserAsManager()
                    notify({
                        type: 'positive',
                        message: t('notifications.positive.account-created')
                    })
                    await router.push({name: 'Dashboard'})
                } else {
                    await register()
                    await router.push({name: 'RegistrationSuccessful'})
                }
                newUser.isCas = false
                newUser.firstName = ''
                newUser.lastName = ''
                newUser.username = ''
                newUser.email = ''
                newUser.phone = ''
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    const data = error.response.data
                    if (data.email) {
                        await router.push({name: 'Login'})
                        notify({
                            type: 'negative',
                            message: t('notifications.negative.email-used')
                        })
                    } else {
                        notify({
                            type: 'negative',
                            message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
                        })
                    }
                }
            }
        } else {
            notify({
                type: 'negative',
                message: t('notifications.negative.need-gdpr-consent')
            })
        }
    }
}
</script>

<template>
    <section class="dashboard-section">
        <QForm
            class="q-gutter-md"
            @submit.prevent="onRegister"
        >
            <section>
                <h2>
                    <i
                        aria-hidden="true"
                        class="bi bi-pencil-square"
                    ></i>
                    {{ t('user.infos') }}
                </h2>
                <div class="form-container">
                    <div class="form">
                        <FormAddUserFromLDAP v-if="isStaff"/>

                        <QInput
                            v-model="newUser.firstName"
                            :disable="!!userStore.isCas || newUser.isCas"
                            :label="t('forms.first-name') + ' *'"
                            :rules="[val => val && val.length > 0 || t('forms.required-first-name')]"
                            aria-required="true"
                            clearable
                            filled
                            lazy-rules
                            autocomplete="given-name"
                        />
                        <QInput
                            v-model="newUser.lastName"
                            :disable="!!userStore.isCas || newUser.isCas"
                            :label="t('forms.last-name') + ' *'"
                            :rules="[val => val && val.length > 0 || t('forms.required-last-name')]"
                            aria-required="true"
                            clearable
                            filled
                            lazy-rules
                            autocomplete="family-name"
                        />
                        <QInput
                            v-model="newUser.email"
                            :disable="!!userStore.isCas || newUser.isCas"
                            :label="t('forms.email') + ' *'"
                            :rules="[(val, rules) => rules.email(val) || t('forms.required-email'),
                                     val => !val.endsWith('unistra.fr') && !userStore.isCas || t('forms.error-unistra-mail-domain')]"
                            aria-required="true"
                            clearable
                            filled
                            lazy-rules
                            type="email"
                            autocomplete="email"
                        >
                        </QInput>
                        <QInput
                            v-model="emailVerification"
                            :disable="!!userStore.isCas || newUser.isCas"
                            :label="t('forms.repeat-email') + ' *'"
                            :rules="[(val, rules) => rules.email(val) && val === newUser.email || t('forms.required-repeat-email')]"
                            aria-required="true"
                            clearable
                            filled
                            lazy-rules
                            type="email"
                            autocomplete="email"
                        />
                        <QInput
                            v-model="newUser.phone"
                            :hint="t('forms.hint-phone')"
                            :label="t('forms.phone')"
                            :rules="newUser.phone?.length ? [val => phoneRegex.test(val) || t('forms.required-phone')] : []"
                            clearable
                            filled
                            lazy-rules
                            type="tel"
                            autocomplete="tel"
                        />
                    </div>
                </div>
            </section>

            <section>
                <h2>
                    <i
                        aria-hidden="true"
                        class="bi bi-pencil-square"
                    ></i>
                    {{ t('user.groups') }}
                </h2>
                <div class="form-container">
                    <div class="form">
                        <FormUserGroups/>
                    </div>
                </div>
            </section>

            <section v-if="groupCanJoinAssociation">
                <h2>
                    <i
                        aria-hidden="true"
                        class="bi bi-pencil-square"
                    ></i>
                    {{ t('user.associations') }}
                </h2>
                <div class="form-container">
                    <div class="form">
                        <FormRegisterUserAssociations/>
                    </div>
                </div>
            </section>


            <section v-if="!isStaff">
                <h2>
                    <i
                        aria-hidden="true"
                        class="bi bi-pencil-square"
                    ></i>
                    {{ t('forms.gdpr-title') }}
                </h2>
                <div :class="['form-container', 'consent-section']">
                    <div class="form">
                        <LayoutGDPRConsent
                            :has-consent="hasConsent"
                            @update-consent="hasConsent = !hasConsent"
                        />
                    </div>
                </div>
            </section>

            <div class="btn-group">
                <QBtn
                    :label="t('forms.send')"
                    icon="bi-check-lg"
                    type="submit"
                />
            </div>
        </QForm>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
</style>
