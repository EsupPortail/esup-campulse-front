<script lang="ts" setup>
import {useUserStore} from '@/stores/useUserStore'
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import useSecurity from '@/composables/useSecurity'
import router from '@/router'

const userStore = useUserStore()
const newUser = userStore.newUser
const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {cancelAbortedCasRegistration} = useSecurity()


const isCas = ref<boolean | undefined>(newUser?.isCas)

async function onCancelAbortedCasRegistration() {
    loading.show()
    try {
        await cancelAbortedCasRegistration()
        await router.push({name: 'Login'})
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
    loading.hide()
}
</script>

<template>
    <QDialog
        v-model="isCas"
        persistent
    >
        <QCard>
            <QCardSection>
                <p class="q-ml-sm">{{ t('alerts.aborted-cas-registration.message') }}</p>

                <div class="flex-row-center padding-top">
                    <QBtn
                        v-close-popup
                        :label="t('alerts.aborted-cas-registration.cancel')"
                        class="btn-lg"
                        color="custom-red"
                        icon="bi-x-lg"
                        @click="onCancelAbortedCasRegistration"
                    />
                    <QBtn
                        v-close-popup
                        :label="t('alerts.aborted-cas-registration.finish')"
                        :to="{name: 'Registration'}"
                        class="btn-lg"
                        color="association"
                        icon="bi-check-lg"
                    />
                </div>
            </QCardSection>
        </QCard>
    </QDialog>
</template>
