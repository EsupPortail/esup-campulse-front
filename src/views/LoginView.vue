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
    <section id="login-page">
        <div class="dashboard-section">
            <div class="login-intro-text flex-row-center">
                <div class="login-intro-text-icon">
                    <QIcon
                        color="association"
                        name="bi-person-circle"
                    />
                </div>
                <h1>
                    {{ t('login.introduction-login') }}
                </h1>
            </div>
            <div
                v-if="!newUser && !isCas"
                class="dashboard-section-container"
            >
                <QCard
                    id="cas-login"
                    class="card"
                >
                    <QCardSection>
                        <div class="card-content">
                            <p class="card-title">{{ t('login.im-cas-user') }}</p>
                            <h2>{{ t('login.login-with-cas') }}</h2>
                        </div>
                        <div class="flex-row-center">
                            <QBtn
                                :href="CASUrlLogin"
                                :label="t('login.login')"
                                class="btn-lg"
                                color="association"
                            />
                            <QBtn
                                :href="CASUrlRegister"
                                :label="t('login.create-account')"
                                class="btn-lg"
                                color="association"
                            />
                        </div>
                    </QCardSection>
                </QCard>

                <!-- class="card" -->
                <QCard
                    id="local-login"
                >
                    <QCardSection>
                        <div class="card-content">
                            <p class="card-title">{{ t('login.im-not-cas-user') }}</p>
                            <h2>{{ t('login.login-without-cas') }}</h2>
                        </div>
                        <FormLocalLogin/>
                    </QCardSection>
                </QCard>
            </div>
            <div
                v-else
                class="container"
            >
                <QCard
                    id="aborted-cas-registration"
                    class="card"
                >
                    <QCardSection>
                        <div class="card-content">
                            <p
                                class="card-title"
                                role="alert"
                            >
                                {{ t('alerts.aborted-cas-registration.title') }}
                            </p>

                            <p role="alert">
                                {{ t('alerts.aborted-cas-registration.message') }}
                            </p>
                            <div>
                                <QBtn
                                    :label="t('alerts.aborted-cas-registration.button')"
                                    :to="{name: 'Registration'}"
                                    class="btn-lg"
                                    color="custom-red"
                                />
                            </div>
                        </div>
                    </QCardSection>
                </QCard>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/login.scss';
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
</style>
