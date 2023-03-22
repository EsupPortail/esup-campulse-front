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

const {t} = useI18n()
const {notify, loading} = useQuasar()
const userStore = useUserStore()
const {register, newUser, initNewUserData, loadCASUser, emailVerification, addUserAsManager} = useSecurity()
const {groupChoiceIsValid, groupCanJoinAssociation, isStaff} = useUserGroups()


const hasConsent = ref<boolean>(false)

onMounted(async () => {
    loading.show
    initNewUserData()
    await onLoadCASUser()
    loading.hide
})

async function onLoadCASUser() {
    try {
        await loadCASUser()
    } catch (error) {
        await router.push({name: 'Login'})
        notify({
            type: 'negative',
            message: t('notifications.negative.cas-authentication-error')
        })
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
                    if (!newUser.isCas) await router.push({name: 'RegistrationSuccessful'})
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const data = error.response?.data
                    if (data.email) {
                        notify({
                            type: 'negative',
                            message: t('notifications.negative.email-used')
                        })
                        await router.push({name: 'Login'})
                    } else {
                        notify({
                            type: 'negative',
                            message: t('notifications.negative.invalid-request')
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
    <div class="form-container">
        <div class="form">

            <h3 class="section-title"><i class="bi bi-card-text"></i>{{ t('user.infos') }}</h3>

            <FormAddUserFromLDAP v-if="isStaff"/>

            <QForm class="q-gutter-md" @submit.prevent="onRegister">
                <QInput
                    v-model="newUser.firstName"
                    :disable="!!userStore.isCas || newUser.isCas"
                    :label="t('forms.first-name')"
                    :rules="[val => val && val.length > 0 || t('forms.required-first-name')]"
                    filled lazy-rules
                />
                <QInput
                    v-model="newUser.lastName"
                    :disable="!!userStore.isCas || newUser.isCas"
                    :label="t('forms.last-name')"
                    :rules="[val => val && val.length > 0 || t('forms.required-last-name')]"
                    filled
                    lazy-rules
                />
                <QInput
                    v-model="newUser.email"
                    :disable="!!userStore.isCas || newUser.isCas"
                    :label="t('forms.email')" :rules="[(val, rules) => rules.email(val) || t('forms.required-email'),
            val => !val.endsWith('unistra.fr') && !userStore.isCas || t('forms.error-unistra-mail-domain')]"
                    filled
                    lazy-rules
                >
                </QInput>
                <QInput
                    v-model="emailVerification"
                    :disable="!!userStore.isCas || newUser.isCas"
                    :label="t('forms.repeat-email')"
                    :rules="[(val, rules) => rules.email(val) && val === newUser.email || t('forms.required-repeat-email')]"
                    filled
                    lazy-rules
                />
                <QInput v-model="newUser.phone" :label="t('forms.phone')" filled hint="Format : 06 00 00 00 00"
                        lazy-rules
                        mask="## ## ## ## ##"/>

                <h3 class="section-title"><i class="bi bi-card-text"></i>{{ t('status') }}</h3>
                <FormUserGroups/>

                <div v-if="groupCanJoinAssociation">
                    <h3 class="section-title"><i class="bi bi-card-text"></i>{{ t('associations') }}</h3>
                    <FormRegisterUserAssociations/>
                </div>

                <LayoutGDPRConsent
                    v-if="!isStaff"
                    :has-consent="hasConsent"
                    @update-consent="hasConsent = !hasConsent"
                />
                <QBtn :label="t('forms.send')" color="primary" type="submit"/>
            </QForm>
        </div>
    </div>
</template>

<style lang="sass">
@import '@/assets/styles/forms.scss'
</style>

<style lang="sass" scoped>
.q-separator
    margin: 10px 0

fieldset + .q-separator
    margin-left: 15px

.q-btn[type="submit"]
    margin: 15px 0 5px 15px

fieldset
    border: none
</style>
