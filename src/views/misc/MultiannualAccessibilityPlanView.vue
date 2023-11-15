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

const multiannualAccessibilityPlan = ref<Content>()

onMounted(async function () {
    loading.show()
    await onGetContent()
    initContent()
    loading.hide()
})

async function onGetContent() {
    try {
        await contentStore.getContentsByCode(['MULTIANNUAL_ACCESSIBILITY_PLAN'])
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}

function findContentObject(code: string) {
    return contentStore.contents.find(obj => obj.code === code)
}

const initContent = () => {
    multiannualAccessibilityPlan.value = findContentObject('MULTIANNUAL_ACCESSIBILITY_PLAN')
}

</script>

<template>
    <section class="dashboard-section">
        <div class="dashboard-section-container">
            <div
                class="container flex-column"
                v-html="multiannualAccessibilityPlan?.body"
            >
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

h2>p {
    line-height: normal;
}
</style>
