<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import type {PasswordEdit} from '#/user'
import {useAxios} from '@/composables/useAxios'
import router from '@/router'

const {t} = useI18n()
const {notify} = useQuasar()

const editPassword = ref<PasswordEdit>({
    oldPassword: '',
    newPassword1: '',
    newPassword2: ''
})

const {axiosAuthenticated} = useAxios()

async function passwordConfirm() {
    if (editPassword.value.newPassword1 === editPassword.value.newPassword2) {
        try {
            await axiosAuthenticated.post(
                '/users/auth/password/change/',
                {
                    oldPassword: editPassword.value.oldPassword,
                    newPassword1: editPassword.value.newPassword1,
                    newPassword2: editPassword.value.newPassword2
                }
            )
            await router.push({name: 'Home'})
            notify({
                type: 'positive',
                message: t('notifications.positive.password-changed')
            })
        } catch (e) {
            // TODO
            notify({
                type: 'negative',
                message: t('notifications.negative.invalid-request')
            })
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
    <fieldset>
        <div class="form-title">
            <h2>
                <i class="bi bi-key"></i>
                {{ t('dashboard.my-password') }}
            </h2>
        </div>

        <div class="form-container">
            <div class="form">
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
                    :rules="[val => val && val.length > 0 || t('forms.required-new-password')]"
                    filled
                    lazy-rules
                    type="password"
                />
                <QInput
                    v-model="editPassword.newPassword2"
                    :label="t('forms.repeat-new-password')"
                    :rules="[val => val && val.length > 0 || t('forms.required-repeat-new-password')]"
                    filled
                    lazy-rules
                    type="password"
                />
                <QBtn
                    color="primary"
                    label="Modifier le mot de passe"
                    @click="passwordConfirm"
                />
            </div>
        </div>

    </fieldset>
</template>

<style lang="scss">
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';

fieldset {
    h2 {
        font-size: 2rem;
        text-transform: uppercase;
        color: $annuaireColorText;

        i {
            color: $annuaireColorText;
            font-size: 1.5rem;
            margin: auto 0.875rem;
            position: relative;
        }
    }
}
</style>
