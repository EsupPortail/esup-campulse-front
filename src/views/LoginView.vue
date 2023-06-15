<script lang="ts" setup>
import FormLocalLogin from '@/components/form/FormLocalLogin.vue'
import {useUserStore} from '@/stores/useUserStore'
import {useI18n} from 'vue-i18n'

const userStore = useUserStore()
const newUser = userStore.newUser
const isCas = userStore.isCas
const {t} = useI18n()

const CASUrlLogin = `${import.meta.env.VITE_APP_CAS_URL}/cas/login?service=${encodeURIComponent(import.meta.env.VITE_APP_FRONT_URL)}/cas-login`
const CASUrlRegister = `${import.meta.env.VITE_APP_CAS_URL}/cas/login?service=${encodeURIComponent(import.meta.env.VITE_APP_FRONT_URL)}/cas-register`
</script>

<template>
    <div id="login-page">
        <p class="login-intro-text">
            <span
                    aria-hidden="true"
                    class="icon"
            >
                <i class="bi bi-person-circle"></i>
            </span>
            <h1>{{ t('login.introduction-login') }}</h1>
        </p>
        <div
                v-if="!newUser && !isCas"
                class="form-container"
        >
            <QCard
                    id="cas-login"
                    class="card"
            >
                <QCardSection>
                    <div class="card-content">
                        <span class="card-title">{{ t('login.im-cas-user') }}</span>
                        <h2>{{ t('login.login-with-cas') }}</h2>
                    </div>
                    <div class="btn-group">
                        <QBtn
                                :href="CASUrlLogin"
                                :label="t('login.login')"
                        />
                        <QBtn
                                :href="CASUrlRegister"
                                :label="t('login.create-account')"
                        />
                    </div>
                </QCardSection>
            </QCard>
            <QCard
                    id="local-login"
                    class="card"
            >
                <QCardSection>
                    <div class="card-content">
                        <span class="card-title">{{ t('login.im-not-cas-user') }}</span>
                        <h2>{{ t('login.login-without-cas') }}</h2>
                    </div>
                    <FormLocalLogin/>
                </QCardSection>
            </QCard>
        </div>
        <div
                v-else
                class="form-container"
        >
            <QCard
                    id="aborted-cas-registration"
                    class="card"
            >
                <QCardSection>
                    <div class="card-content">
                        <p class="card-title" role="alert">
                            {{ t('alerts.aborted-cas-registration.title') }}
                        </p>

                        <p role="alert">
                            {{ t('alerts.aborted-cas-registration.message') }}
                        </p>
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
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/login.scss';
@import '@/assets/styles/forms.scss';
</style>
