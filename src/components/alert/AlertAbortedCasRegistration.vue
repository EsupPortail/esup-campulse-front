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
            <QCardSection class="row no-wrap">
                <QIcon
                    color="negative"
                    name="mdi-information-outline"
                    size="md"
                />
                <p class="q-ml-sm">{{ t('alerts.aborted-cas-registration.message') }}</p>
            </QCardSection>
            <QCardActions align="right">
                <div class="flex-row padding-top">
                    <QBtn
                        v-close-popup
                        :label="t('alerts.close')"
                        class="btn-lg"
                        color="dashboard"
                        flat
                    />
                    <QBtn
                        v-close-popup
                        :label="t('alerts.aborted-cas-registration.button')"
                        :to="{name: 'Registration'}"
                        class="btn-lg"
                        color="custom-red"
                    />
                </div>
            </QCardActions>
        </QCard>
    </QDialog>
</template>
