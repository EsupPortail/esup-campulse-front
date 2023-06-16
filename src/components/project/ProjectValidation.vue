<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {ref, watch} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import useProjectComments from '@/composables/useProjectComments'
import {useProjectStore} from '@/stores/useProjectStore'
import useErrors from '@/composables/useErrors'
import type {ProjectStatus} from '#/project'
import useSecurity from '@/composables/useSecurity'

const {t} = useI18n()
const {loading, notify} = useQuasar()
const {postNewProjectComment, getProjectComments} = useProjectComments()
const {catchHTTPError} = useErrors()
const projectStore = useProjectStore()
const {hasPerm} = useSecurity()

type Action = 'validate' | 'reject' | 'return' | ''
type Icon = 'bi-check-lg' | 'bi-x-octagon' | 'bi-exclamation-triangle' | ''

const open = ref<boolean>(false)

const selectedAction = ref<Action>('')
const selectedIcon = ref<Icon>('')

const newComment = ref<string>('')

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
            let projectStatus: ProjectStatus | '' = 'PROJECT_VALIDATED'
            if (selectedAction.value === 'validate') projectStatus = 'PROJECT_VALIDATED'
            else if (selectedAction.value === 'return') projectStatus = 'PROJECT_DRAFT'
            else if (selectedAction.value === 'reject') projectStatus = 'PROJECT_REJECTED'
            if (newComment.value) {
                await postNewProjectComment(projectStore.project.id, newComment.value)
            }
            await projectStore.patchProjectStatus(projectStatus)
            await getProjectComments(projectStore.project.id)
            open.value = false
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
    <section
        v-if="projectStore.project?.projectStatus === 'PROJECT_PROCESSING'
            && hasPerm('change_project_as_validator')"
        class="btn-group"
    >
        <QBtn
            :label="t('project.validate')"
            icon="bi-check-lg"
            @click="onOpenDialog('validate', 'bi-check-lg')"
        />
        <QBtn
            :label="t('project.return')"
            icon="bi-exclamation-triangle"
            @click="onOpenDialog('return', 'bi-exclamation-triangle')"
        />
        <QBtn
            :label="t('project.reject')"
            icon="bi-x-octagon"
            @click="onOpenDialog('reject', 'bi-x-octagon')"
        />
    </section>
    <QDialog v-model="open">
        <QCard class="variant-space-3">
            <QCardSection class="q-pt-none">
                <QForm
                    @submit.prevent="onUpdateProjectStatus"
                >
                    <h3 class="title-3">{{ t('forms.add-new-comment') }}</h3>
                    <QInput
                        v-model="newComment"
                        :aria-required="selectedAction !== 'validate'"
                        :hint="t('forms.comment-hint')"
                        :label="t('forms.comment') + (selectedAction !== 'validate' ? ` (${t('required')})` : ` (${t('optional')})`)"
                        :rules="selectedAction !== 'validate' ? [ val => val && val.length > 0 || t('forms.fill-field')] : []"
                        filled
                        lazy-rules
                        type="textarea"
                    />
                    <QCardActions align="right">
                        <div class="btn-group">
                            <QBtn
                                :label="t('back')"
                                icon="bi-box-arrow-left"
                                @click="open = false"
                            />
                            <QBtn
                                :icon="selectedIcon"
                                :label="t(`project.${selectedAction}`)"
                                type="submit"
                            />
                        </div>
                    </QCardActions>
                </QForm>
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