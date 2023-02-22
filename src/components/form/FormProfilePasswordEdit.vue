<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import type { PasswordEdit } from '#/user'
import { useAxios } from '@/composables/useAxios'
import router from '@/router'

const { t } = useI18n()
const { notify } = useQuasar()

const editPassword = ref<PasswordEdit>({
    oldPassword: '',
    newPassword1: '',
    newPassword2: ''
})

const { axiosAuthenticated } = useAxios()

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
            await router.push({ name: 'Home' })
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
    <QForm class="q-gutter-md" @submit="passwordConfirm">
        <QInput v-model="editPassword.oldPassword" :label="$t('forms.old-password')"
            :rules="[val => val && val.length > 0 || $t('forms.required-old-password')]" filled lazy-rules
            type="password" />
        <QInput v-model="editPassword.newPassword1" :label="$t('forms.new-password')"
            :rules="[val => val && val.length > 0 || $t('forms.required-new-password')]" filled lazy-rules
            type="password" />
        <QInput v-model="editPassword.newPassword2" :label="$t('forms.repeat-new-password')"
            :rules="[val => val && val.length > 0 || $t('forms.required-repeat-new-password')]" filled lazy-rules
            type="password" />
        <QBtn :label="$t('forms.send')" color="primary" type="submit" />
    </QForm>
</template>

<style lang="sass" scoped>

</style>
