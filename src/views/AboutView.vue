<script lang="ts" setup>
import AboutCard from '@/components/layout/LayoutAboutCard.vue'
import ServiceCard from '@/components/layout/LayoutAboutServiceCard.vue'
import {useContentStore} from '@/stores/useContentStore'
import {onMounted, ref, watch} from 'vue'
import {AboutStore} from '#/index'
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

watch(() => content.about.length, () => {
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
            <AboutCard
                :body="aboutApp?.body"
                :header="aboutApp?.header"
            />
            <AboutCard
                :body="aboutFunding?.body"
                :header="aboutFunding?.header"
                :label="aboutFunding?.label"
            />
            <AboutCard
                :body="aboutPartnership?.body"
                :header="aboutPartnership?.header"
                :label="aboutPartnership?.label"
            />
        </div>

        <div class="section-headtitle">
            <h3>{{ t('about.services') }}</h3>
        </div>

        <div class="services-section">
            <ServiceCard
                :body="homeAssociation?.body"
                :footer="homeAssociation?.header"
                :header="homeAssociation?.header"
            />

            <ServiceCard
                :body="homeCharter?.body"
                :footer="homeCharter?.header"
                :header="homeCharter?.header"
            />

            <ServiceCard
                :body="homeProject?.body"
                :footer="homeProject?.footer"
                :header="homeProject?.header"
            />
        </div>

        <div class="contact">
        </div>
    </section>
</template>
