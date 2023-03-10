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
    <QDialog v-model="isCas" persistent>
        <QCard>
            <QCardSection class="row no-wrap">
                <QIcon color="negative" name="mdi-information-outline" size="md"/>
                <span class="q-ml-sm">{{ t('alerts.aborted-cas-registration.message') }}</span>
            </QCardSection>
            <QCardActions align="right">
                <QBtn
                    v-close-popup
                    :label="t('alerts.close')"
                    color="primary"
                    flat
                />
                <QBtn
                    v-close-popup
                    :label="t('alerts.aborted-cas-registration.button')"
                    :to="{name: 'Registration'}"
                    color="primary"
                />
            </QCardActions>
        </QCard>
    </QDialog>
</template>
