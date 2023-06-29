<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import useSecurity from '@/composables/useSecurity'
import axios from 'axios'
import useErrors from '@/composables/useErrors'

const {t} = useI18n()
const {notify} = useQuasar()
const {resendEmail} = useSecurity()
const email = ref<string>()
const isResend = ref<boolean>(false)
const {catchHTTPError} = useErrors()

async function resend() {
    try {
        await resendEmail(email.value as string)
        isResend.value = true
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}
</script>

<template>
    <!--<div class="instructions">
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
    </div>-->
    <QForm
        v-if="!isResend"
        class="q-gutter-md"
        @submit="resend"
    >
        <div class="dashboard-section">
            <h2>{{ t("forms.resend-email-confirmation") }}</h2>

            <div class="flex-column">
                <div>
                    <QBanner
                        v-if="!isResend"
                        class="bg-grey-3"
                    >
                        <template v-slot:avatar>
                            <QIcon
                                color="dashboard"
                                name="mdi-information-outline"
                                size="md"
                            />
                        </template>
                        <strong>{{ t("forms.resend-email-cas") }}</strong>
                    </QBanner>
                    <p v-if="isResend">{{ t("forms.resend-email-ok") }}</p>
                </div>
                <QInput
                    v-model="email"
                    :label="t('forms.email')"
                    :rules="[(val, rules) => rules.email(val) || t('forms.required-email')]"
                    autocomplete="email"
                    filled
                    lazy-rules
                />
            </div>

            <div class="flex-row-center padding-bottom">
                <QBtn
                    :label="t('forms.send')"
                    class="btn-lg"
                    color="dashboard"
                    type="submit"
                />
            </div>
        </div>
    </QForm>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';

strong {
  font-size: 1.2rem;
}

/*
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
}*/
</style>
