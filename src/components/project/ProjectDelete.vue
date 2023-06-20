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
        const index = projectStore.projects.findIndex(obj => obj.id === props.project)
        projectStore.projects.splice(index, 1)
        notify({
            type: 'positive',
            message: t('notifications.positive.project-deleted')
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
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
                <QForm
                    @submit="onDeleteProject"
                >
                    <p class="paragraph">{{ t('project.confirm-project-delete') }}</p>
                    <QCardActions align="right">
                        <QBtn
                            v-close-popup
                            :label="t('cancel')"
                            icon="bi-box-arrow-left"
                            @click="emit('closeDialog')"
                        />
                        <QBtn
                            v-close-popup
                            :label="t('delete')"
                            color="red"
                            icon="bi-trash"
                            type="submit"
                        />
                    </QCardActions>
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