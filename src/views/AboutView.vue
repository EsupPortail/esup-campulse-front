<script lang="ts" setup>
import AboutCard from '@/components/layout/LayoutAboutCard.vue'
import {useContentStore} from '@/stores/useContentStore'
import {onMounted, ref, watch} from 'vue'
import {AboutStore} from '#/index'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import axios from 'axios'

const content = useContentStore()
const aboutInfo = ref<AboutStore>()
const aboutContact = ref<AboutStore>()
const aboutServices = ref<AboutStore>()
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
    aboutInfo.value = findContentObject('ABOUT_INFO')
    aboutContact.value = findContentObject('ABOUT_CONTACT')
    aboutServices.value = findContentObject('ABOUT_SERVICES')
})
</script>

<template>
    <div id="home-section">
        <AboutCard
            :body="aboutInfo?.body"
            :label="aboutInfo?.label"
        />
        <AboutCard
            :body="aboutServices?.body"
            :label="aboutServices?.label"
            :title="test"
        />
        <AboutCard
            :body="aboutContact?.body"
            :label="aboutContact?.label"
        />
    </div>
</template>
