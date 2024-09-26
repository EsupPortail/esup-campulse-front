<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useContentStore} from '@/stores/useContentStore'
import {useQuasar} from 'quasar'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import type {EditableContent} from '#/index'

const {t} = useI18n()
const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()

const contentStore = useContentStore()
const {patchContent} = useContentStore()

const content = ref<EditableContent>({
    label: '',
    header: '',
    body: '',
    footer: '',
    aside: '',
})

const initValues = () => {
    content.value.label = contentStore.content?.label as string
    content.value.header = contentStore.content?.header as string
    content.value.body = contentStore.content?.body as string
    content.value.footer = contentStore.content?.footer as string
    content.value.aside = contentStore.content?.aside as string
}
watch(() => contentStore.content, initValues)

onMounted(async () => {
    loading.show()
    initValues()
    loading.hide()
})

async function onUpdate() {
    loading.show()
    try {
        await patchContent(content.value)
        notify({
            type: 'positive',
            message: t('notifications.positive.validate-content')
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
    loading.hide()
}
</script>

<template>
    <QForm
        ref="contentForm"
        class="q-gutter-md"
        @submit.prevent="onUpdate"
    >
        <QInput
            v-model="content.header"
            :label="t('content.header')"
            clearable
            color="dashboard"
            filled
            lazy-rules
            type="textarea"
        />
        <QInput
            v-model="content.body"
            :label="t('content.body')"
            clearable
            color="dashboard"
            filled
            lazy-rules
            type="textarea"
        />
        <QInput
            v-model="content.footer"
            :label="t('content.footer')"
            clearable
            color="dashboard"
            filled
            lazy-rules
            type="textarea"
        />
        <QInput
            v-model="content.aside"
            :label="t('content.aside')"
            clearable
            color="dashboard"
            filled
            lazy-rules
            type="textarea"
        />
        <div class="flex-row-center">
            <QBtn
                :label="t('back')"
                :to="{ name: 'Dashboard' }"
                class="btn-lg"
                color="dashboard"
                icon="bi-chevron-left"
            />
            <QBtn
                :label="t('forms.change-content')"
                class="btn-lg"
                color="dashboard"
                icon="bi-check-lg"
                type="submit"
            />
        </div>
    </QForm>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
</style>
