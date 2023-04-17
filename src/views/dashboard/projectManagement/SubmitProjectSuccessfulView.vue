<script lang="ts" setup>
import {onMounted} from 'vue'
import {useProjectStore} from '@/stores/useProjectStore'
import {useRoute} from 'vue-router'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import router from '@/router'

const projectStore = useProjectStore()
const route = useRoute()
const {loading} = useQuasar()
const {t} = useI18n()

onMounted(async () => {
    loading.show()
    await onGetProjectDetail()
    loading.hide()
})

async function onGetProjectDetail() {
    try {
        await projectStore.getProjectDetail(parseInt(route.params.projectId as string))
        if (projectStore.project?.projectStatus !== 'PROJECT_PROCESSING') {
            await router.push({name: '404'})
        }
    } catch {
        await router.push({name: '404'})
    }
}
</script>

<template>
    <section class="dashboard-section">
        <div class="form-container">
            <div class="form">
                <section class="project-recap">
                    <i class="bi bi-check-circle"></i>
                    <h2 class="title-3">{{ t('project.has-been-submitted') }}</h2>
                    <p>{{ t('project.consult-on-dashboard') }}</p>
                    <div class="flex-btn-group">
                        <QBtn
                            :label="t('project.download-recap')"
                            disable
                            icon="mdi-tray-arrow-down"
                        />
                        <QBtn
                            :label="t('dashboard.cape-dashboard')"
                            disable
                            icon="mdi-chevron-left"
                        />
                    </div>
                </section>
            </div>
        </div>
    </section>
</template>

<style lang="scss">
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';
</style>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

i {
    color: $capeColor;
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
