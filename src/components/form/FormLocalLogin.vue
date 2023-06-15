<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import useSecurity from '@/composables/useSecurity'
import {useRouter} from 'vue-router'
import {ref} from 'vue'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const router = useRouter()
const {user, logIn} = useSecurity()

const passwordVisibility = ref<boolean>(false)

async function onLogIn() {
    loading.show()
    try {
        await logIn()
        await router.push({name: 'Dashboard'})
        notify({
            type: 'positive',
            message: t('notifications.positive.login-success')
        })
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.unknown-credentials')
        })
    }
    loading.hide()
}

</script>

<template>
    <QForm
            class="q-gutter-md"
            @submit.prevent="onLogIn"
    >
        <QInput
                v-model="user.username"
                :label="t('forms.email')"
                :rules="[ (val, rules) => rules.email(val) || t('forms.required-email')]"
                autocomplete="email"
                filled
                lazy-rules
        />
        <QInput
                v-model="user.password"
                :label="t('forms.password')"
                :rules="[ val => val && val.length > 0 || t('forms.required-password')]"
                :type="passwordVisibility ? 'text' : 'password'"
                autocomplete="current-password"
                filled
                lazy-rules
        />
        <QCheckbox
                v-model="passwordVisibility"
                :label="t('forms.view-password')"
        />
        <div class="btn-group">
            <QBtn
                    :label="t('forms.login')"
                    type="submit"
            />
            <QBtn
                    :label="t('forms.create-account')"
                    :to="{name: 'Registration'}"
            />
        </div>
        <!-- <QBtn :label="t('forms.reset-password')" class="q-sm" color="primary" flat to="/password-reset"/>
        <QBtn :label="t('forms.resend-email')" class="q-sm" color="primary" flat to="/register-resend-email"/> -->

        <div class="login-links">
            <RouterLink class="login-link" to="/password-reset">
                <span class="icon icon-mentions"></span>{{ t('forms.reset-password') }}
            </RouterLink>
            <br/>
            <RouterLink class="login-link" to="/register-resend-email">
                <span class="icon icon-mentions"></span>{{ t('forms.resend-email') }}
            </RouterLink>
        </div>
    </QForm>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/login.scss";
</style>
