<script lang="ts" setup>
import {useContentStore} from '@/stores/useContentStore'
import {onMounted, ref, watch} from 'vue'
import type {ContactStore} from '#/index'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import axios from 'axios'

const contentStore = useContentStore()
const contactInfo = ref<ContactStore>()
const contactList = ref<ContactStore>()
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
    contactInfo.value = findContentObject('CONTACT_INFO')
    contactList.value = findContentObject('CONTACT_LIST')
})

</script>

<template>
    <p>{{ contactInfo?.body }}</p>
    <p>{{ contactList?.body }}</p>
</template>


<style lang="scss">
</style>