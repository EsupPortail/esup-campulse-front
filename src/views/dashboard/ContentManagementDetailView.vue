<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useQuasar} from 'quasar'
import {useContentStore} from '@/stores/useContentStore'
import {useRoute} from 'vue-router'
import FormChangeContents from '@/components/form/FormChangeContents.vue'
import useErrors from '@/composables/useErrors'
import axios from 'axios'
import useUtility from '@/composables/useUtility'

const {notify, loading} = useQuasar()

const route = useRoute()
const contentStore = useContentStore()
const {catchHTTPError} = useErrors()
const {dynamicTitle} = useUtility()

const isLoaded = ref(false)

async function onGetContent() {
    try {
        await contentStore.getContent(parseInt(route.params.id as string))
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
}

onMounted(async function () {
    loading.show()
    await onGetContent()
    dynamicTitle.value = contentStore.content?.label
    isLoaded.value = true
    loading.hide()
})
</script>

<template>
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-pencil-square"
            ></i>
            {{ dynamicTitle }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <FormChangeContents v-if="isLoaded"/>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
</style>
