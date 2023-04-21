<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useUsers from '@/composables/useUsers'
import {useRoute} from 'vue-router'
import useErrors from '@/composables/useErrors'
import axios from 'axios'
import {useProjectStore} from '@/stores/useProjectStore'
import type {ProjectList} from '#/project'
import useUtility from '@/composables/useUtility'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {canEditUser} = useUsers()
const route = useRoute()
const {catchHTTPError} = useErrors()
const projectStore = useProjectStore()
const {formatDate} = useUtility()


onMounted(async () => {
    loading.show()
    await onGetProjects()
    loading.hide()
})

const projects = ref<ProjectList[]>([])
watch(() => projectStore.projects, () => {
    projects.value = projectStore.projects
})

async function onGetProjects() {
    try {
        await projectStore.getProjects()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

const columns: QTableProps['columns'] = [
    {name: 'name', align: 'left', label: t('project.name'), field: 'name', sortable: true},
    {name: 'applicant', align: 'left', label: t('project.applicant'), field: 'applicant', sortable: true},
    {name: 'lastModifiedDate', align: 'left', label: t('project.last-modified-date'), field: 'email', sortable: true},
    {name: 'status', align: 'left', label: t('status'), field: 'status', sortable: true},
    {name: 'edition', align: 'left', label: t('manage'), field: 'edition', sortable: false},
]

</script>

<template>
    <section class="dashboard-section">
        <div class="form-container">
            <div class="form">
                <QTable
                    :columns="columns"
                    :loading="!projects"
                    :rows="projects"
                    :rows-per-page-options="[10, 20, 50, 0]"
                    :title="t('project.list')"
                    row-key="name"
                >
                    <template v-slot:body="props">
                        <QTr :props="props">
                            <QTd
                                key="name"
                                :props="props"
                            >
                                {{ props.row.name }}
                            </QTd>
                            <QTd
                                key="applicant"
                                :props="props"
                            >
                                {{ props.row.association ?? props.row.user }}
                            </QTd>
                            <QTd
                                key="lastModifiedDate"
                                :props="props"
                            >
                                {{ formatDate(props.row.editionDate).split('-').reverse().join('/') }}
                            </QTd>
                            <QTd
                                key="status"
                                :props="props"
                                class="state-cell"
                            >
                                <span
                                    v-if="props.row.projectStatus === 'PROJECT_PROCESSING'"
                                    class="form-state"
                                >
                                    {{ t('project.status.processing') }}
                                    <span
                                        aria-hidden="true"
                                        class="form-state-icon form-state-orange"
                                    ><i class="bi bi-dash"></i></span>
                                </span>
                                <span
                                    v-if="props.row.projectStatus === 'PROJECT_VALIDATED'"
                                    class="form-state"
                                >
                                    {{ t('project.status.validated') }}
                                    <span
                                        aria-hidden="true"
                                        class="form-state-icon form-state-green"
                                    ><i class="bi bi-check"></i></span>
                                </span>
                                <span
                                    v-if="props.row.projectStatus === 'PROJECT_REVIEW_PROCESSING'"
                                    class="form-state"
                                >
                                    {{ t('project.status.validated') }}
                                    <span
                                        aria-hidden="true"
                                        class="form-state-icon form-state-green"
                                    ><i class="bi bi-check"></i></span>
                                </span>
                            </QTd>
                            <QTd
                                key="edition"
                                :props="props"
                                class="actions-cell-compact"
                            >
                                <div class="button-container">
                                    <QBtn
                                        :to="{name: 'UserManagementDetail', params: {id: props.row.id}}"
                                        icon="bi-pencil"
                                    />
                                    <QBtn
                                        :label="t('consult')"
                                        :to="{name: 'UserValidationDetail', params: {id: props.row.id}}"
                                        color="secondary"
                                        icon="mdi-check-circle"
                                    />
                                </div>
                            </QTd>
                        </QTr>
                    </template>
                </QTable>
            </div>
        </div>
    </section>
</template>

<style lang="scss">
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';
</style>
