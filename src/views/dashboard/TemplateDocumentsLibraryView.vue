<script lang="ts" setup>
import useDocuments from '@/composables/useDocuments'
import {onMounted, ref} from 'vue'
import {useQuasar} from 'quasar'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import {useI18n} from 'vue-i18n'

const {getDocuments, documents} = useDocuments()
const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()
const {t} = useI18n()

onMounted(async () => {
    loading.show()
    await initTemplateDocuments()
    loading.hide()
})

const templateDocuments = ref<Document[]>([])

async function initTemplateDocuments() {
    try {
        await getDocuments()
        //templateDocuments.value = documents.value.filter(obj => obj.processType === '')
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
    <section class="dashboard-section">
        <div class="form-container">
            <div class="form">
                <QForm
                    v-for="document in documents"
                    :key="document.id"
                >
                    <QInput
                        :label="document.description"
                        filled
                    />
                </QForm>
            </div>
        </div>
    </section>
</template>

<!--
<style lang="scss">
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
</style>-->
