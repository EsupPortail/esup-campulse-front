<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {ref, watch} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import useProjectComments from '@/composables/useProjectComments'
import {useProjectStore} from '@/stores/useProjectStore'
import useErrors from '@/composables/useErrors'
import type {ProjectStatus} from '#/project'
import FormAddComment from '@/components/form/FormAddComment.vue'

const {t} = useI18n()
const {loading, notify} = useQuasar()
const {postNewProjectComment, getProjectComments, newComment} = useProjectComments()
const {catchHTTPError} = useErrors()
const projectStore = useProjectStore()

type Action = 'validate' | 'return' | 'new-comment' | ''
type Icon = 'bi-check-lg' | 'bi-exclamation-triangle' | 'bi-chat' | ''

const open = ref<boolean>(false)

const selectedAction = ref<Action>('')
const selectedIcon = ref<Icon>('')

const onOpenDialog = (action: Action, icon: Icon) => {
    selectedAction.value = action
    selectedIcon.value = icon
    open.value = true
}

watch(() => open.value, () => {
    if (open.value === false) newComment.value = ''
})

async function onUpdateProjectStatus() {
    loading.show()
    try {
        if (projectStore.project) {
            let projectStatus: ProjectStatus | '' = ''
            if (selectedAction.value === 'validate') projectStatus = 'PROJECT_REVIEW_VALIDATED'
            else if (selectedAction.value === 'return') projectStatus = 'PROJECT_REVIEW_DRAFT'
            await postNewProjectComment(projectStore.project.id, newComment.value)
            if (projectStatus) await projectStore.patchProjectStatus(projectStatus)
            await getProjectComments(projectStore.project.id)
            open.value = false
            newComment.value = ''
            notify({
                type: 'positive',
                message: t(`notifications.positive.${selectedAction.value}-project`)
            })
        }
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
    <section class="flex-row-center padding-top padding-bottom">
        <QBtn
            :label="t('project.review-validate')"
            class="btn-lg"
            color="commission"
            icon="bi-check-lg"
            @click="onOpenDialog('validate', 'bi-check-lg')"
        />
        <QBtn
            :label="t('project.review-return')"
            class="btn-lg"
            color="custom-red"
            icon="bi-exclamation-triangle"
            @click="onOpenDialog('return', 'bi-exclamation-triangle')"
        />
    </section>
    <QDialog v-model="open">
        <QCard class="variant-space-3">
            <QCardSection class="q-pt-none">
                <FormAddComment
                    :selected-action="selectedAction"
                    :selected-icon="selectedIcon"
                    @submit="onUpdateProjectStatus"
                    @close-dialog="open = false"
                />
            </QCardSection>
        </QCard>
    </QDialog>
</template>


<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

.q-card {
    padding: 1rem;
}
</style>