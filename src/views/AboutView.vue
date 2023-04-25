<script lang="ts" setup>
import {useContentStore} from '@/stores/useContentStore'
import useErrors from '@/composables/useErrors'
import {onMounted, ref, watch} from 'vue'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import type {AboutStore} from '#/index'

const contentStore = useContentStore()
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
        await contentStore.getContent()
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
    return contentStore.about.find(obj => obj.code === code)
}

watch(() => contentStore.about.length, () => {
    aboutInfo.value = findContentObject('ABOUT_INFO')
    aboutContact.value = findContentObject('ABOUT_CONTACT')
    aboutServices.value = findContentObject('ABOUT_SERVICES')
})

</script>

<template>
    <p>{{ aboutInfo?.body }}</p>
    <p>{{ aboutContact?.body }}</p>
    <p>{{ aboutServices?.body }}</p>
</template>


<style lang="scss">
</style>