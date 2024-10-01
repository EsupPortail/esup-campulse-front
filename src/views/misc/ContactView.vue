<script lang="ts" setup>
import {useContentStore} from '@/stores/useContentStore'
import {onMounted, ref} from 'vue'
import type {Content} from '#/index'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import axios from 'axios'

const contentStore = useContentStore()
const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()

const contactInfo = ref<Content>()
const contactList = ref<Content>()

onMounted(async function () {
    loading.show()
    await onGetContent()
    initContent()
    loading.hide()
})

async function onGetContent() {
    try {
        await contentStore.getContentsByCode(['CONTACT_INFO', 'CONTACT_LIST'])
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
                <i
                    aria-hidden="true"
                    class="bi bi-envelope-paper"
                ></i>
                <h2 v-html="contactInfo?.header"></h2>
                <div class="info-panel">
                    <i
                        aria-hidden="true"
                        class="bi bi-info"
                    ></i>
                    <p v-html="contactInfo?.body"></p>
                </div>
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

i {
    font-size: 7rem;
    text-align: center;
    color: $associationColor;
}
</style>

