<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import useSecurity from '@/composables/useSecurity'
import axios from 'axios'

const {t} = useI18n()
const {notify} = useQuasar()
const {resendEmail} = useSecurity()
const email = ref<string>()
const isResend = ref<boolean>(false)

async function resend() {
    try {
        await resendEmail(email.value as string)
        isResend.value = true
    } catch (error) {
        if (axios.isAxiosError(error)) {
            let errorMessage = null
            switch (error.response?.status) {
            case 404:
                errorMessage = t('notifications.negative.unknown-email')
                break
            case 403:
                errorMessage = t('notifications.negative.restricted-email')
                break
            default:
                errorMessage = t('notifications.negative.invalid-request')
                break
            }
            notify({
                type: 'negative',
                message: errorMessage
            })
        }
    }
}
</script>

<template>
    <div class="instructions">
        <QBanner
            v-if="!isResend"
            class="bg-grey-3"
        >
            <template v-slot:avatar>
                <QIcon
                    color="primary"
                    name="mdi-information-outline"
                    size="md"
                />
            </template>
            <strong>{{ t("forms.resend-email-cas") }}</strong>
            <template v-slot:action>
            </template>
        </QBanner>
        <p v-if="isResend">{{ t("forms.resend-email-ok") }}</p>
    </div>
    <QForm
        v-if="!isResend"
        class="q-gutter-md"
        @submit="resend"
    >
        <fieldset>
            <legend class="instructions">{{ t("forms.resend-email-confirmation") }}</legend>
            <QInput
                v-model="email"
                :label="t('forms.email')"
                :rules="[(val, rules) => rules.email(val) || t('forms.required-email')]"
                filled
                lazy-rules
            />
            <QBtn
                :label="t('forms.send')"
                color="primary"
                type="submit"
            />
        </fieldset>
    </QForm>
</template>

<style lang="scss" scoped>
.instructions {
    font-size: 1.2em;

    p {
        text-align: center;
    }
}

.q-form, .instructions {
    max-width: 720px;
    width: 100%;
    margin: auto;
}

fieldset {
    padding-top: 30px;
    border: none;
}

.q-btn {
    margin-top: 10px;
}
</style>
