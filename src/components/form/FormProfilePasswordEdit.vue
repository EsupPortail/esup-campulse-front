<script lang="ts" setup>
import {ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {QForm, useQuasar} from 'quasar'
import type {PasswordEdit} from '#/user'
import {useAxios} from '@/composables/useAxios'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import FormPasswordChecker from '@/components/form/FormPasswordChecker.vue'
import type {PasswordChecker} from '#/index'
import useSecurity from '@/composables/useSecurity'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {axiosAuthenticated} = useAxios()
const {checkPasswordStrength} = useSecurity()

const editPassword = ref<PasswordEdit>({
    oldPassword: '',
    newPassword1: '',
    newPassword2: ''
})

const form = ref(QForm)

const passwordChecker = ref<PasswordChecker>(checkPasswordStrength(''))
watch(() => editPassword.value.newPassword1, () => {
    let password = ''
    if (editPassword.value.newPassword1) password = editPassword.value.newPassword1
    passwordChecker.value = checkPasswordStrength(password)
})

async function passwordConfirm() {
    loading.show()
    if (editPassword.value.newPassword1 === editPassword.value.newPassword2) {
        try {
            await axiosAuthenticated.post('/users/auth/password/change/', editPassword.value)
            form.value.reset()
            notify({
                type: 'positive',
                message: t('notifications.positive.password-changed')
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
    loading.hide()
}

const clearValues = () => {
    editPassword.value.oldPassword = ''
    editPassword.value.newPassword1 = ''
    editPassword.value.newPassword2 = ''
}
</script>

<template>
    <fieldset>
        <div class="form-title">
            <h2>
                <i class="bi bi-key"></i>
                {{ t('dashboard.my-password') }}
            </h2>
        </div>

        <div class="form-container">
            <div class="form">
                <QForm
                    ref="form"
                    @reset="clearValues"
                    @submit.prevent="passwordConfirm"
                >
                    <QInput
                        v-model="editPassword.oldPassword"
                        :label="t('forms.old-password')"
                        :rules="[val => val && val.length > 0 || t('forms.required-old-password')]"
                        filled
                        lazy-rules
                        type="password"
                    />
                    <QInput
                        v-model="editPassword.newPassword1"
                        :label="t('forms.new-password')"
                        :rules="[
                            val => val && val.length > 0 || t('forms.required-new-password'),
                            val => val && passwordChecker.valid || t('forms.required-strong-password')
                        ]"
                        filled
                        lazy-rules
                        type="password"
                    />
                    <QInput
                        v-model="editPassword.newPassword2"
                        :label="t('forms.repeat-new-password')"
                        :rules="[
                            val => val && val.length > 0 || t('forms.required-repeat-new-password'),
                            val => val === editPassword.newPassword1 || t('forms.passwords-are-not-equal')
                        ]"
                        filled
                        lazy-rules
                        type="password"
                    />
                    <FormPasswordChecker
                        :password="editPassword.newPassword1"
                        :password-checker="passwordChecker"
                    />
                    <QBtn
                        :disable="!passwordChecker.valid || editPassword.newPassword1 !== editPassword.newPassword2"
                        :label="t('password.edit-password')"
                        class="edit-passwd"
                        type="submit"
                    />
                </QForm>
            </div>
        </div>
    </fieldset>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

@media screen and (min-width: $responsiveWidth) {
    .form {
        margin: auto;
        width: 50%;
    }
}
</style>
