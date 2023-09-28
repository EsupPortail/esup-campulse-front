<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {ref, watch} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import useProjectComments from '@/composables/useProjectComments'
import {useProjectStore} from '@/stores/useProjectStore'
import useErrors from '@/composables/useErrors'
import type {ProjectStatus} from '#/project'
import useManageProjects from '@/composables/useManageProjects'
import useCommissions from '@/composables/useCommissions'
import {useUserStore} from '@/stores/useUserStore'

const {t} = useI18n()
const {loading, notify} = useQuasar()
const {postNewProjectComment, getProjectComments, newComment} = useProjectComments()
const {catchHTTPError} = useErrors()
const projectStore = useProjectStore()
const {
    initProjectCommissionFundLabels,
    projectCommissionFundLabels,
    validateProjectCommissionFund,
    rejectProjectCommissionFund
} = useManageProjects()
const {funds, commissionFunds} = useCommissions()
const userStore = useUserStore()

type Action = 'validate' | 'reject' | 'return' | 'new-comment' | ''
type Icon = 'bi-check-lg' | 'bi-x-octagon' | 'bi-exclamation-triangle' | 'bi-chat' | ''

const open = ref<boolean>(false)

const selectedAction = ref<Action>('')
const selectedIcon = ref<Icon>('')

const selectedProjectCommissionFunds = ref<number[]>([])

const onOpenDialog = async (action: Action, icon: Icon) => {
    loading.show()
    selectedAction.value = action
    selectedIcon.value = icon
    open.value = true
    selectedProjectCommissionFunds.value = []
    if (selectedAction.value === 'validate' || selectedAction.value === 'reject') {
        await initProjectCommissionFundLabels(projectStore.projectCommissionFunds, selectedAction.value)
    }
    loading.hide()
}

watch(() => open.value, () => {
    if (open.value === false) {
        newComment.value.text = ''
        newComment.value.isVisible = false
    }
})

const canChangeProject = () => {
    let perm = false
    const institutions: number[] = []
    projectStore.projectCommissionFunds.forEach(projectCommissionFund => {
        const commissionFund = commissionFunds.value.find(obj => obj.id === projectCommissionFund.commissionFund)
        const fund = funds.value.find(obj => obj.id === commissionFund?.fund)
        if (fund) institutions.push(fund.institution)
    })
    userStore.user?.groups.forEach(group => {
        if (group && group.institutionId && institutions.includes(group.institutionId)) perm = true
    })
    return perm
}

async function onUpdateProjectStatus() {
    loading.show()
    try {
        if (projectStore.project) {
            let projectStatus: ProjectStatus | '' = ''
            if (selectedAction.value === 'validate') projectStatus = 'PROJECT_VALIDATED'
            else if (selectedAction.value === 'return') projectStatus = 'PROJECT_DRAFT_PROCESSED'
            else projectStatus = 'PROJECT_REJECTED'

            await postNewProjectComment(projectStore.project.id, newComment.value)

            // VALIDATED
            if (projectStatus === 'PROJECT_VALIDATED') {
                for (const projectCommissionFund of selectedProjectCommissionFunds.value) {
                    await validateProjectCommissionFund(projectStore.project.id, projectCommissionFund)
                }
            }
            // DRAFT
            else if (projectStatus === 'PROJECT_DRAFT_PROCESSED') {
                await projectStore.patchProjectStatus(projectStatus)
            }
            // REJECTED
            else {
                for (const projectCommissionFund of selectedProjectCommissionFunds.value) {
                    await rejectProjectCommissionFund(projectStore.project.id, projectCommissionFund)
                }
            }

            await getProjectComments(projectStore.project.id)
            await projectStore.getProjectDetail(projectStore.project.id)
            await projectStore.getProjectCommissionFunds(false, undefined)
            open.value = false
            newComment.value.text = ''
            newComment.value.isVisible = false
            let message = ''
            switch (selectedAction.value) {
            case 'validate':
                message = t('notifications.positive.validate-project')
                break
            case 'return':
                message = t('notifications.positive.return-project')
                break
            case 'reject':
                message = t('notifications.positive.reject-project')
                break
            default:
                break
            }
            notify({
                type: 'positive',
                message: message
            })
        }
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
    <section class="flex-row-center padding-top padding-bottom">
        <QBtn
            :disable="!canChangeProject"
            :label="t('project.validate')"
            class="btn-lg"
            color="commission"
            icon="bi-check-lg"
            @click="onOpenDialog('validate', 'bi-check-lg')"
        />
        <QBtn
            :disable="!canChangeProject"
            :label="t('project.return')"
            class="btn-lg"
            color="custom-red"
            icon="bi-exclamation-triangle"
            @click="onOpenDialog('return', 'bi-exclamation-triangle')"
        />
        <QBtn
            :disable="!canChangeProject"
            :label="t('project.reject')"
            class="btn-lg"
            color="custom-red"
            icon="bi-x-octagon"
            @click="onOpenDialog('reject', 'bi-x-octagon')"
        />
    </section>
    <QDialog v-model="open">
        <QCard class="variant-space-3">
            <QCardSection class="q-pt-none flex-column">
                <QForm
                    class="flex-column"
                    @submit="onUpdateProjectStatus"
                >
                    <QSelect
                        v-if="selectedAction !== 'return'"
                        v-model="selectedProjectCommissionFunds"
                        :label="t('project.commission-funds-validation',
                                  { action: `${selectedAction === 'validate' ? 'valider' : 'refuser'}` }) + ' (' + t('required') + ')'"
                        :options="projectCommissionFundLabels"
                        :rules="[val => val && val.length || t('forms.required-fund')]"
                        aria-required="true"
                        clearable
                        color="commission"
                        emit-value
                        filled
                        map-options
                        multiple
                        reactive-rules
                        use-chips
                    />
                    <QInput
                        v-model="newComment.text"
                        :aria-required="selectedAction !== 'validate'"
                        :hint="selectedAction !== 'validate' ? t('forms.project-comment-hint') : ''"
                        :label="t('forms.comment') + (selectedAction !== 'validate' ? ` (${t('required')})` : ` (${t('optional')})`)"
                        :rules="selectedAction !== 'validate' ? [val => val && val.length > 0 || t('forms.required-comment')] : []"
                        color="commission"
                        filled
                        lazy-rules
                        type="textarea"
                    />
                    <QToggle
                        v-model="newComment.isVisible"
                        :disable="!newComment.text"
                        :label="t('forms.comment-visibility')"
                        color="commission"
                    />
                    <div class="flex-row-center padding-top">
                        <QBtn
                            :label="t('back')"
                            class="btn-lg"
                            color="commission"
                            icon="bi-box-arrow-left"
                            @click="open = false"
                        />
                        <QBtn
                            v-if="selectedAction === 'validate'"
                            :icon="selectedIcon"
                            :label="t('project.validate')"
                            class="btn-lg"
                            color="commission"
                            type="submit"
                        />
                        <QBtn
                            v-if="selectedAction === 'reject'"
                            :icon="selectedIcon"
                            :label="t('project.reject')"
                            class="btn-lg"
                            color="custom-red"
                            type="submit"
                        />
                        <QBtn
                            v-if="selectedAction === 'return'"
                            :icon="selectedIcon"
                            :label="t('project.return')"
                            class="btn-lg"
                            color="custom-red"
                            type="submit"
                        />
                    </div>
                </QForm>
            </QCardSection>
        </QCard>
    </QDialog>
</template>


<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
@import "@/assets/_variables.scss";

.q-card {
    padding: 1rem;
    max-width: 60rem;
    width: $fullSize;
}

.q-form.flex-column {
    gap: 2rem;
}
</style>
