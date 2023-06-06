<script lang="ts" setup>
import AboutCard from '@/components/layout/LayoutAboutCard.vue'
import ServiceCard from '@/components/layout/LayoutAboutServiceCard.vue'
import {useContentStore} from '@/stores/useContentStore'
import {onMounted, ref, watch} from 'vue'
import type {AboutStore} from '#/index'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import axios from 'axios'

const content = useContentStore()
const aboutApp = ref<AboutStore>()
const aboutFunding = ref<AboutStore>()
const aboutPartnership = ref<AboutStore>()
const homeAssociation = ref<AboutStore>()
const homeCharter = ref<AboutStore>()
const homeProject = ref<AboutStore>()
const {loading, notify} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()

onMounted(async function () {
    loading.show()
    await onGetContent()
    loading.hide()
})

async function onGetContent() {
    try {
        await content.getContent()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

function findContentObject(code: string) {
    return content.about.find(obj => obj.code === code)
}

watch(() => content.about, () => {
    aboutApp.value = findContentObject('ABOUT_APP')
    aboutFunding.value = findContentObject('ABOUT_FUNDING')
    aboutPartnership.value = findContentObject('ABOUT_PARTNERSHIP')
    homeAssociation.value = findContentObject('HOME_ASSOCIATION')
    homeProject.value = findContentObject('HOME_PROJECT')
    homeCharter.value = findContentObject('HOME_CHARTER')
})
</script>

<template>
    <section id="home-section">
        <div class="presentation-project">
            <div :class="['section-headtitle', 'form-container']">
                <h3>{{ t('about.presentation') }}</h3>
            </div>

            <AboutCard
                :body="aboutApp?.body"
                :cssClass="content.cards[0].cssClass"
                :header="aboutApp?.header"
            />
            <AboutCard
                :body="aboutPartnership?.body"
                :cssClass="content.cards[1].cssClass"
                :header="aboutPartnership?.header"
                :label="aboutPartnership?.label"
            />
            <AboutCard
                :body="aboutFunding?.body"
                :cssClass="content.cards[2].cssClass"
                :header="aboutFunding?.header"
                :label="aboutFunding?.label"
            />
        </div>

        <div class="services-project">
            <div class="section-headtitle">
                <h3>{{ t('about.services') }}</h3>
            </div>

            <div class="services-section">
                <ServiceCard
                    :body="homeAssociation?.body"
                    :cssClass="content.cards[0].cssClass"
                    :footer="homeAssociation?.header"
                    :header="homeAssociation?.header"
                />

                <ServiceCard
                    :body="homeCharter?.body"
                    :cssClass="content.cards[1].cssClass"
                    :footer="homeCharter?.header"
                    :header="homeCharter?.header"
                />

                <ServiceCard
                    :body="homeProject?.body"
                    :cssClass="content.cards[2].cssClass"
                    :footer="homeProject?.footer"
                    :header="homeProject?.header"
                />
            </div>
        </div>

        <div class="contact-project">
            <div class="form-container">
                <div class="section-headtitle">
                    <h3>{{ t('about.contact') }}</h3>
                </div>

                <div class="contact-content">
                    <h4>{{ t('about.intro-contact') }}</h4>

                    <RouterLink
                        :to="{name: 'Contact'}"
                        class="contact-link"
                    >
                        {{ t('about.contact-us') }}
                    </RouterLink>
                </div>
            </div>
        </div>
    </section>
</template>
<style lang="scss" scoped>
@import '@/assets/styles/home.scss';
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/contact.scss';

.home-section {
  padding: 2rem 0;

  &.home-section-cape, &.home-section-annuaire, &.home-section-charte {
    background-image: none;
  }

}

.form-container {
  padding: 2rem 0;

  &:nth-child(1), &:nth-child(2), &:nth-child(3) {
    &::before, &::after {
      background: none;
    }
  }

  &:nth-child(4) {
    &::before {
      background: none;
    }
  }
}
</style>
