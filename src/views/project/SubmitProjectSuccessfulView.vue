<script lang="ts" setup>
import {onMounted} from 'vue'
import {useProjectStore} from '@/stores/useProjectStore'
import {useRoute} from 'vue-router'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import router from '@/router'
import axios from 'axios'
import useErrors from '@/composables/useErrors'

const projectStore = useProjectStore()
const route = useRoute()
const {loading, notify} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()

onMounted(async () => {
    loading.show()
    await onGetProjectDetail()
    loading.hide()
})

async function onGetProjectDetail() {
    try {
        await projectStore.getProjectDetail(parseInt(route.params.projectId as string))
    } catch (error) {
        await router.push({name: '404'})
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}

async function onGetProjectPdf() {
    loading.show()
    try {
        const file = await projectStore.getProjectPdf(parseInt(route.params.projectId as string))
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(new Blob([file]))
        link.download = `${t('project.pdf-name')}${encodeURI(projectStore.project?.name as string)}.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
    loading.hide()
}
</script>

<template>
    <section class="dashboard-section">
        <div class="form-container">
            <div class="form">
                <section class="project-recap">
                    <i
                        aria-hidden="true"
                        class="bi bi-check-circle"
                    ></i>
                    <h2>{{ t('project.has-been-submitted') }}</h2>
                    <p>{{ t('project.consult-on-dashboard') }}</p>
                    <div class="flex-btn-group">
                        <QBtn
                            :label="t('project.download-recap')"
                            class="btn-lg"
                            color="commission"
                            data-test="download-recap-button"
                            icon="bi-filetype-pdf"
                            @click="onGetProjectPdf"
                        />
                        <QBtn
                            :label="t('dashboard.cape-dashboard')"
                            :to="{ name: 'ManageProjects' }"
                            class="btn-lg"
                            color="commission"
                            icon="bi-chevron-compact-right"
                        />
                    </div>
                </section>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';
@import '@/assets/_variables.scss';

i {
    color: $commissionColor;
    font-size: 5rem;
}

.project-recap {
    text-align: center;
    padding: 3rem 0 3rem 0;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;

    .flex-btn-group {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
}
</style>
