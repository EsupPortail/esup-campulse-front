<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import axios from 'axios'
import useSecurity from '@/composables/useSecurity'
import useErrors from '@/composables/useErrors'

const {t} = useI18n()
const {notify} = useQuasar()
const {passwordReset} = useSecurity()
const {catchHTTPError} = useErrors()

const email = ref<string>()
const isReset = ref<boolean>(false)

async function reset() {
    try {
        await passwordReset(email.value as string)
        isReset.value = true
    } catch (error) {
        if (axios.isAxiosError(error)) {
            let errorMessage = null
            const errorObject = {'status': 500, 'data': {'error': error.response?.data}}
            switch (error.response?.status) {
            case 404:
                errorMessage = t('notifications.negative.unknown-email')
                break
            case 403:
                errorMessage = t('notifications.negative.restricted-email')
                break
            default:
                if (error.response?.status) {
                    errorObject.status = error.response?.status
                }
                errorMessage = catchHTTPError(errorObject)
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
    <div class="flex-column">
        <div
            v-if="!isReset"
            class="info-panel info-panel-dashboard"
        >
            <i
                aria-hidden="true"
                class="bi bi-info"
            ></i>
            <p>
                {{ t('forms.password-reset-cas') }}
            </p>
        </div>
        <p
            v-if="isReset"
            class="padding-top"
        >
            {{ t('forms.password-reset-ok') }}
        </p>
        <QForm
            v-if="!isReset"
            class="q-gutter-md"
            @submit="reset"
        >
            <QInput
                v-model="email"
                :label="t('forms.email')"
                :rules="[(val, rules) => rules.email(val) || t('forms.required-email')]"
                autocomplete="email"
                bottom-slots
                color="dashboard"
                filled
                for="email"
                lazy-rules
                type="email"
            >
                <template v-slot:hint>
                    <p aria-describedby="email">{{ t('forms.password-reset-instructions') }}</p>
                </template>
            </QInput>
            <div class="padding-bottom">
                <QBtn
                    :label="t('forms.send')"
                    class="btn-lg"
                    color="dashboard"
                    icon="bi-check-lg"
                    type="submit"
                />
            </div>
        </QForm>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
</style>
