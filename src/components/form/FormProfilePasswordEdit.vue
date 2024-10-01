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
                    message: await catchHTTPError(error.response)
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
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-key"
            ></i>
            {{ t('dashboard.my-password') }}
        </h2>

        <div class="dashboard-section-container">
            <div class="container">
                <QForm
                    ref="form"
                    class="flex-column"
                    @reset="clearValues"
                    @submit.prevent="passwordConfirm"
                >
                    <QInput
                        v-model="editPassword.oldPassword"
                        :label="t('forms.old-password')"
                        :rules="[val => val && val.length > 0 || t('forms.required-old-password')]"
                        autocomplete="current-password"
                        clearable
                        color="dashboard"
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
                        autocomplete="new-password"
                        bottom-slots
                        clearable
                        color="dashboard"
                        filled
                        for="new-password-to-check"
                        lazy-rules
                        type="password"
                    >
                        <template v-slot:hint>
                            <p aria-describedby="new-password-to-check">
                                {{
                                    t('forms.strong-password-hint')
                                }}
                            </p>
                        </template>
                    </QInput>
                    <QInput
                        v-model="editPassword.newPassword2"
                        :label="t('forms.repeat-new-password')"
                        :rules="[
                            val => val && val.length > 0 || t('forms.required-repeat-new-password'),
                            val => val === editPassword.newPassword1 || t('forms.passwords-are-not-equal')
                        ]"
                        autocomplete="new-password"
                        clearable
                        color="dashboard"
                        filled
                        lazy-rules
                        type="password"
                    />
                    <FormPasswordChecker
                        :password="editPassword.newPassword1"
                        :password-checker="passwordChecker"
                    />
                    <div class="flex-row-center">
                        <QBtn
                            :disable="!passwordChecker.valid || editPassword.newPassword1 !== editPassword.newPassword2"
                            :label="t('password.edit-password')"
                            class="btn-lg"
                            color="dashboard"
                            icon="bi-check-lg"
                            type="submit"
                        />
                    </div>
                </QForm>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
</style>
