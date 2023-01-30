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

const {t} = useI18n()
const {notify, loading} = useQuasar()
const userStore = useUserStore()
const {register, newUser, loadCASUser, emailVerification, addUserAsManager} = useSecurity()
const {groupChoiceIsValid} = useUserGroups()
const {groupUnabledSelectingAssociation} = useUserGroups()
//const unistraMail =


const hasConsent = ref<boolean>(false)

onMounted(async () => {
    loading.show
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
        if (userStore.managerGroup || hasConsent.value) {
            try {
                if (userStore.managerGroup) {
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
    <QForm
        class="q-gutter-md"
        @submit.prevent="onRegister"
    >
        <QInput
            v-model="newUser.firstName"
            :disable="!!userStore.isCas"
            :label="t('forms.first-name')"
            :rules="[ val => val && val.length > 0 || t('forms.required-first-name')]"
            filled
            lazy-rules
        />
        <QInput
            v-model="newUser.lastName"
            :disable="!!userStore.isCas"
            :label="t('forms.last-name')"
            :rules="[ val => val && val.length > 0 || t('forms.required-last-name')]"
            filled
            lazy-rules
        />
        <QInput
            v-model="newUser.email"
            :disable="!!userStore.isCas"
            :label="t('forms.email')"
            :rules="[ (val, rules) => rules.email(val) || t('forms.required-email'),
            val => !val.endsWith('unistra.fr') && !userStore.isCas || t('forms.error-unistra-mail-domain')]"
            filled
            lazy-rules
        >
        </QInput>
        <QInput
            v-model="emailVerification"
            :disable="!!userStore.isCas"
            :label="t('forms.repeat-email')"
            :rules="[ (val, rules) => rules.email(val) && val === newUser.email || t('forms.required-repeat-email')]"
            filled
            lazy-rules
        />
        <QInput
            v-model="newUser.phone"
            :label="t('forms.phone')"
            filled
            hint="Format : 06 00 00 00 00"
            lazy-rules
            mask="## ## ## ## ##"
        />
        <FormUserGroups/>
        <QSeparator/>
        <!-- If manager role checked we do not display this form -->
        <FormRegisterUserAssociations v-if="groupUnabledSelectingAssociation"/>
        <QSeparator/>
        <LayoutGDPRConsent
            v-if="!userStore.managerGroup"
            :has-consent="hasConsent"
            @update-consent="hasConsent = !hasConsent"
        />
        <QBtn :label="t('forms.send')" color="primary" type="submit"/>
    </QForm>
</template>

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
