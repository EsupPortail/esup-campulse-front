<script lang="ts" setup>
import AboutCard from '@/components/layout/LayoutAboutCard.vue'
import ServiceCard from '@/components/layout/LayoutAboutServiceCard.vue'
import {useContentStore} from '@/stores/useContentStore'
import {onMounted, ref} from 'vue'
import type {Content} from '#/index'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import axios from 'axios'

const contentStore = useContentStore()
const {loading, notify} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()

const aboutApp = ref<Content>()
const aboutFunding = ref<Content>()
const aboutPartnership = ref<Content>()
const homeAssociation = ref<Content>()
const homeCharter = ref<Content>()
const homeProject = ref<Content>()

onMounted(async () => {
    loading.show()
    await onGetContent()
    initContent()
    loading.hide()
})

async function onGetContent() {
    try {
        await contentStore.getContentsByCode(['ABOUT_APP', 'ABOUT_FUNDING', 'ABOUT_PARTNERSHIP', 'ABOUT_ASSOCIATION', 'ABOUT_CHARTER', 'ABOUT_PROJECT'])
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
}

function findContentObject(code: string) {
    return contentStore.contents.find(obj => obj.code === code)
}

const initContent = () => {
    aboutApp.value = findContentObject('ABOUT_APP')
    aboutFunding.value = findContentObject('ABOUT_FUNDING')
    aboutPartnership.value = findContentObject('ABOUT_PARTNERSHIP')
    homeAssociation.value = findContentObject('ABOUT_ASSOCIATION')
    homeCharter.value = findContentObject('ABOUT_CHARTER')
    homeProject.value = findContentObject('ABOUT_PROJECT')
}

</script>

<template>
    <section class="dashboard-section">
        <h2>
            <QIcon name="bi-info-circle"/>
            {{ t('about.presentation') }}
        </h2>

        <div class="dashboard-section-container">
            <div class="container">
                <AboutCard
                    :body="aboutApp?.body"
                    :cssClass="contentStore.CSSClasses[0]"
                    :header="aboutApp?.header"
                />
                <AboutCard
                    :body="aboutPartnership?.body"
                    :cssClass="contentStore.CSSClasses[1]"
                    :header="aboutPartnership?.header"
                />
                <AboutCard
                    :body="aboutFunding?.body"
                    :cssClass="contentStore.CSSClasses[2]"
                    :header="aboutFunding?.header"
                />
            </div>
        </div>

        <div class="dashboard-section">
            <h2>
                <QIcon name="bi-shop-window"/>
                {{ t('about.services') }}
            </h2>

            <div class="dashboard-section-container">
                <div class="container flex-row-center align-items-stretch">
                    <ServiceCard
                        :body="homeAssociation?.body"
                        :cssClass="contentStore.CSSClasses[0]"
                        :header="homeAssociation?.header"
                    />
                    <ServiceCard
                        :body="homeCharter?.body"
                        :cssClass="contentStore.CSSClasses[1]"
                        :header="homeCharter?.header"
                    />
                    <ServiceCard
                        :body="homeProject?.body"
                        :cssClass="contentStore.CSSClasses[2]"
                        :header="homeProject?.header"
                    />
                </div>
            </div>
        </div>

        <div class="dashboard-section">
            <h2>
                <QIcon name="bi-envelope"/>
                {{ t('about.contact') }}
            </h2>

            <div class="dashboard-section-container">
                <div class="flex-column text-center">
                    <p>{{ t('about.intro-contact') }}</p>

                    <div>
                        <QBtn
                            :label="t('about.contact-us')"
                            :to="{ name: 'Contact' }"
                            class="btn-lg"
                            color="association"
                            icon="bi-envelope"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<style lang="scss" scoped>
@import '@/assets/styles/home.scss';
@import '@/assets/styles/contact.scss';
@import '@/assets/styles/dashboard.scss';

.home-section {

    &.home-section-cape,
    &.home-section-annuaire,
    &.home-section-charte {
        background-image: none;
    }
}

@media screen and (max-width: $breakpoint-lg) {
    .flex-row-center {
        flex-direction: column;
    }
}
</style>
