<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRoute} from 'vue-router'
import {useQuasar} from 'quasar'
import type {PasswordReset} from '#/user'
import router from '@/router'
import useSecurity from '@/composables/useSecurity'
import axios from 'axios/index'
import useErrors from '@/composables/useErrors'

const {t} = useI18n()
const {notify} = useQuasar()
const {passwordResetConfirm} = useSecurity()
const route = useRoute()
const {catchHTTPError} = useErrors()

const newPassword = ref<PasswordReset>({
    newPassword1: '',
    newPassword2: ''
})

async function resetConfirm() {
    if (newPassword.value.newPassword1 === newPassword.value.newPassword2) {
        try {
            await passwordResetConfirm(route.query.uid as string, route.query.token as string, newPassword.value.newPassword1, newPassword.value.newPassword2)
            await router.push({name: 'Login'})
            notify({
                type: 'positive',
                message: t('notifications.positive.password-reseted')
            })
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
                })
            }
        }
    } else {
        notify({
            type: 'negative',
            message: t('notifications.negative.different-passwords')
        })
    }
}
</script>

<template>
    <QForm
        class="q-gutter-md"
        @submit="resetConfirm"
    >
        <QInput
            v-model="newPassword.newPassword1"
            :label="t('forms.new-password')"
            :rules="[val => val && val.length > 0 || t('forms.required-new-password')]"
            filled
            lazy-rules
            type="password"
        />
        <QInput
            v-model="newPassword.newPassword2"
            :label="t('forms.repeat-new-password')"
            :rules="[
                val => val && val.length > 0 || t('forms.required-repeat-new-password'),
                val => val && val === newPassword.newPassword1 || t('forms.passwords-are-not-equal')
            ]"
            filled
            lazy-rules
            type="password"
        />
        <QBtn
            :label="t('forms.send')"
            color="primary"
            type="submit"
        />
    </QForm>
</template>
