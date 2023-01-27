<script lang="ts" setup>
import FormLocalLogin from '@/components/form/FormLocalLogin.vue'
import {useUserStore} from '@/stores/useUserStore'
import {useI18n} from "vue-i18n";

const userStore = useUserStore()
const newUser = userStore.newUser
const isCas = userStore.isCas
const {t} = useI18n()

const CASUrlLogin = `${import.meta.env.VITE_APP_CAS_URL}/cas/login?service=${encodeURIComponent(import.meta.env.VITE_APP_FRONT_URL)}/cas-login`
const CASUrlRegister = `${import.meta.env.VITE_APP_CAS_URL}/cas/login?service=${encodeURIComponent(import.meta.env.VITE_APP_FRONT_URL)}/cas-register`
</script>

<template>
    <h1>{{ t('login.login') }}</h1>
    <div v-if="!newUser && !isCas">
        <QCard id="cas-login" class="card">
            <QCardSection>
                <div class="card-content">
                    <span class="card-title">{{ t("login.im-cas-user") }}</span>
                    {{ t("login.login-with-cas") }}
                </div>
                <div class="btn-group">
                    <QBtn
                        :href="CASUrlLogin"
                        :label="t('login.login')"
                        color="primary"
                    />
                    <QBtn
                        :href="CASUrlRegister"
                        :label="t('login.create-account')"
                        color="secondary"
                    />
                </div>
            </QCardSection>
        </QCard>
        <QCard id="local-login" class="card">
            <QCardSection>
                <div class="card-content">
                    <span class="card-title">{{ t("login.im-not-cas-user") }}</span>
                    {{ t("login.login-without-cas") }}
                </div>
                <FormLocalLogin/>
            </QCardSection>
        </QCard>
    </div>
    <div v-else>
        <QCard id="aborted-cas-registration" class="card">
            <QCardSection>
                <div class="card-content">
          <span class="card-title">
            {{ t('alerts.aborted-cas-registration.title') }}
          </span>
                    {{ t('alerts.aborted-cas-registration.message') }}
                    <div>
                        <QBtn
                            :label="t('alerts.aborted-cas-registration.button')"
                            :to="{name: 'Registration'}"
                            color="warning"
                        />
                    </div>
                </div>
            </QCardSection>
        </QCard>
    </div>
</template>
