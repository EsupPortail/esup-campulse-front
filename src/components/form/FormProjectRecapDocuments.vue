<script lang="ts" setup>
import useProjectDocuments from '@/composables/useProjectDocuments'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import {ProcessDocument} from '#/documents'

const {processDocuments, documentUploads, getFile} = useProjectDocuments()
const {t} = useI18n()
const {notify} = useQuasar()
const {catchHTTPError} = useErrors()

async function onGetFile(uploadedDocument: ProcessDocument) {
    try {
        const file = await getFile(uploadedDocument.pathFile as string)
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(file)
        link.download = uploadedDocument.name as string
        document.body.appendChild(link)
        link.click()
        link.remove()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}
</script>

<template>
    <section class="flex-section">
        <div
            class="display-row"
            v-for="(document, index) in processDocuments"
            :key="index"
        >
            <p class="row-title">{{ document.description }}</p>
            <p class="paragraph">
                <ul>
                    <li
                        v-for="uploadedDocument in documentUploads.filter(obj => obj.document === document.document)"
                        :key="uploadedDocument.id"
                        @click.prevent="onGetFile(uploadedDocument)"
                    >
                        {{ uploadedDocument.name }}
                    </li>
                </ul>
            </p>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';

li {
    cursor: pointer;
    text-decoration: underline;
}

</style>