<script lang="ts" setup>
import {useUserStore} from '@/stores/useUserStore'
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'

const userStore = useUserStore()
const newUser = userStore.newUser
const {t} = useI18n()


const isCas = ref<boolean | undefined>(newUser?.isCas)
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
                        :label="t('alerts.close')"
                        class="btn-lg"
                        color="dashboard"
                        icon="bi-box-arrow-left"
                    />
                    <QBtn
                        v-close-popup
                        :label="t('alerts.aborted-cas-registration.button')"
                        :to="{name: 'Registration'}"
                        class="btn-lg"
                        color="custom-red"
                        icon="bi-check-lg"
                    />
                </div>
            </QCardSection>
        </QCard>
    </QDialog>
</template>
