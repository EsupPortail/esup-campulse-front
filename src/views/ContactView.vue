<script lang="ts" setup>
import {useContentStore} from '@/stores/useContentStore'
import {onMounted, ref} from 'vue'
import type {ContactStore} from '#/index'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import axios from 'axios'

const contentStore = useContentStore()
const {loading, notify} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()

const contactInfo = ref<ContactStore>()
const contactList = ref<ContactStore>()

onMounted(async function () {
    loading.show()
    await onGetContent()
    initContent()
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

const initContent = () => {
    contactInfo.value = findContentObject('CONTACT_INFO')
    contactList.value = findContentObject('CONTACT_LIST')
}

</script>

<template>
    <section class="dashboard-section">
        <!--        <h2>
                    <i class="bi bi-envelope"></i>
                    {{ t('contact.contact') }}
                </h2>-->
        <div class="dashboard-section-container">
            <div class="container flex-column">
                <h2 v-html="contactInfo?.header"></h2>
                <div class="info-panel">
                    <i
                        aria-hidden="true"
                        class="bi bi-info"
                    ></i>
                    <p v-html="contactInfo?.body"></p>
                </div>

                <h3 v-html="contactList?.header"></h3>
                <div v-html="contactList?.body"></div>
            </div>
        </div>
    </section>
</template>


<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/contact.scss';
@import '@/assets/styles/dashboard.scss';
@import '@/assets/_variables.scss';

.dashboard-section h2 {
    padding: 1.5rem 0 1.5rem 0;
}

h2 > p {
    line-height: normal;
}
</style>