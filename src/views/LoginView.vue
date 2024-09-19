<script lang="ts" setup>
import FormLocalLogin from '@/components/form/FormLocalLogin.vue'
import {useI18n} from 'vue-i18n'
import useUtility from '@/composables/useUtility'
import {onMounted} from 'vue'

const {t} = useI18n()
const {dynamicTitle} = useUtility()

const CASUrlLogin = `${import.meta.env.VITE_APP_CAS_URL}/login?service=${encodeURIComponent(import.meta.env.VITE_APP_FRONT_URL)}/cas-login`
const CASUrlRegister = `${import.meta.env.VITE_APP_CAS_URL}/login?service=${encodeURIComponent(import.meta.env.VITE_APP_FRONT_URL)}/cas-register`

onMounted(() => {
    dynamicTitle.value = t('forms.login')
})
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
            <div class="dashboard-section-container">
                <QCard
                    id="cas-login"
                    class="card"
                >
                    <QCardSection>
                        <div class="card-content">
                            <p class="card-title">{{ t('login.im-cas-user') }}</p>
                            <h2>{{ t('login.login-with-cas') }}</h2>
                        </div>
                        <div class="flex-row-center align-items-stretch">
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
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/login.scss';
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
</style>
