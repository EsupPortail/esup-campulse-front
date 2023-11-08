<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useProjectStore} from '@/stores/useProjectStore'
import axios from 'axios'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {onMounted, watch} from 'vue'
import useSubmitProject from '@/composables/useSubmitProject'

const {t} = useI18n()
const {loading, notify} = useQuasar()
const projectStore = useProjectStore()
const {initProjectCategories, projectCategories} = useSubmitProject()
const {catchHTTPError} = useErrors()

async function onGetProjectCategories() {
    if (projectStore.project) {
        loading.show()
        try {
            await projectStore.getProjectCategoryNames()
            await projectStore.getProjectCategories()
            initProjectCategories()
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
}

onMounted(async () => {
    await onGetProjectCategories()
})

watch(() => projectStore.project, async () => {
    await onGetProjectCategories()
})
</script>

<template>
    <div class="display-row">
        <p class="row-title">{{ t('project.categories') }}</p>
        <p>
            <QChip
                v-for="category in projectCategories"
                :key="category"
                color="commission"
                outline
            >
                {{
                    projectStore.projectCategoriesLabels.find(obj => obj.value === category)?.label
                }}
            </QChip>
        </p>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
</style>
