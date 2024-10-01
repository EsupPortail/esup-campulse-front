<script lang="ts" setup>
import {ref, toRefs, watch} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import useSubmitProject from '@/composables/useSubmitProject'
import {useProjectStore} from '@/stores/useProjectStore'

const {notify, loading} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()
const {deleteProject} = useSubmitProject()
const projectStore = useProjectStore()

const emit = defineEmits(['closeDialog'])

const props = defineProps<{
    openDialog: boolean,
    project: number
}>()

const openRef = toRefs(props).openDialog

const open = ref<boolean>(false)

watch(() => openRef.value, () => {
    open.value = openRef.value
})

watch(() => open.value, () => {
    if (!open.value) {
        emit('closeDialog')
    }
})

async function onDeleteProject() {
    loading.show()
    try {
        await deleteProject(props.project)
        const index = projectStore.selfProjects.findIndex(obj => obj.id === props.project)
        projectStore.selfProjects.splice(index, 1)
        notify({
            type: 'positive',
            message: t('notifications.positive.project-deleted')
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
    <QDialog v-model="open">
        <QCard class="variant-space-3">
            <QCardSection>
                <QForm @submit="onDeleteProject">
                    <p class="paragraph">{{ t('project.confirm-project-delete') }}</p>
                    <div class="flex-row-center">
                        <QBtn
                            v-close-popup
                            :label="t('cancel')"
                            class="btn-lg"
                            color="commission"
                            icon="bi-box-arrow-left"
                            @click="emit('closeDialog')"
                        />
                        <QBtn
                            v-close-popup
                            :label="t('delete')"
                            class="btn-lg"
                            color="custom-red"
                            icon="bi-trash"
                            type="submit"
                        />
                    </div>
                </QForm>
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';

.q-card {
    padding: 1rem
}
</style>
