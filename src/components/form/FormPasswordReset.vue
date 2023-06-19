<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import axios from 'axios'
import useSecurity from '@/composables/useSecurity'

const {t} = useI18n()
const {notify} = useQuasar()
const {passwordReset} = useSecurity()

const email = ref<string>()
const isReset = ref<boolean>(false)

async function reset() {
    try {
        await passwordReset(email.value as string)
        isReset.value = true
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
                errorMessage = t('notifications.negative.error')
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
    <div class="form-container">
        <div class="form">
            <div class="instructions">
                <QBanner
                    v-if="!isReset"
                    class="bg-grey-3"
                >
                    <template v-slot:avatar>
                        <QIcon
                            color="secondary"
                            name="mdi-information-outline"
                            size="md"
                        />
                    </template>
                    <strong>{{ t('forms.password-reset-cas') }}</strong>
                    <template v-slot:action>
                    </template>
                </QBanner>
                <p v-if="isReset">{{ t('forms.password-reset-ok') }}</p>
            </div>
            <QForm
                v-if="!isReset"
                class="q-gutter-md"
                @submit="reset"
            >
                <fieldset>
                    <legend class="instructions">{{ t('forms.password-reset-instructions') }}</legend>
                    <QInput
                        v-model="email"
                        :label="t('forms.email')"
                        :rules="[(val, rules) => rules.email(val) || t('forms.required-email')]"
                        autocomplete="email"
                        filled
                        lazy-rules
                        type="email"
                    />
                    <QBtn
                        :label="t('forms.send')"
                        type="submit"
                    />
                </fieldset>
            </QForm>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";

.q-form, .instructions {
  margin: auto;
}
</style>
