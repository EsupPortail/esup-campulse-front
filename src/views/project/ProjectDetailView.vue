<script lang="ts" setup>
import FormProjectRecap from '@/components/form/FormProjectRecap.vue'
import type {ProcessDocument} from '#/documents'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import useProjectDocuments from '@/composables/useProjectDocuments'
import router from '@/router'
import {onMounted} from 'vue'
import {useProjectStore} from '@/stores/useProjectStore'
import useSubmitProject from '@/composables/useSubmitProject'
import {useRoute} from 'vue-router'

const {notify, loading} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()
const {getFile} = useProjectDocuments()
const projectStore = useProjectStore()
const {initProjectBasicInfos, initProjectGoals, initProjectBudget} = useSubmitProject()
const route = useRoute()

async function onGetProjectDetail() {
    try {
        await projectStore.getProjectDetail(parseInt(route.params.projectId as string))
        initProjectBasicInfos()
        initProjectBudget()
        initProjectGoals()
    } catch (error) {
        await router.push({name: '404'})
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

onMounted(async () => {
    loading.show()
    await onGetProjectDetail()
    loading.hide()
})

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
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-pencil-square"
            ></i>
            {{ t('recap') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <FormProjectRecap
                    view="projectDetail"
                    @submit-project="0"
                    @change-step="0"
                    @get-file="uploadDocument => onGetFile(uploadDocument)"
                />
            </div>
        </div>
    </section>
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-pencil-square"
            ></i>
            Commentaires
        </h2>
    </section>
</template>

<style lang="scss">
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
</style>
