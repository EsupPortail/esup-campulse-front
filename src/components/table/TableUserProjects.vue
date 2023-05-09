<script lang="ts" setup>
import type {QTableProps} from 'quasar'
import {useProjectStore} from '@/stores/useProjectStore'
import type {ProjectList} from '#/project'
import useUtility from '@/composables/useUtility'
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/stores/useUserStore'

const importedProps = defineProps<{
    projects: ProjectList[],
    title: string,
    associationId: number | null
}>()

const projectStore = useProjectStore()
const userStore = useUserStore()
const {formatDate} = useUtility()
const {t} = useI18n()

const columns: QTableProps['columns'] = [
    {name: 'name', align: 'left', label: t('project.name'), field: 'name', sortable: true},
    {name: 'lastModifiedDate', align: 'left', label: t('project.last-modified-date'), field: 'email', sortable: true},
    {name: 'status', align: 'left', label: t('status'), field: 'status', sortable: true},
    {name: 'edition', align: 'center', label: t('manage'), field: 'edition', sortable: false},
]
</script>

<template>
    <QTable
        :columns="columns"
        :loading="!projectStore.projects"
        :rows="importedProps.projects"
        :rows-per-page-options="[10, 20, 50, 0]"
        :title="importedProps.title"
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
                    key="lastModifiedDate"
                    :props="props"
                >
                    {{ formatDate(props.row.editionDate)?.split('-').reverse().join('/') }}
                </QTd>
                <QTd
                    key="status"
                    :props="props"
                    class="state-cell"
                >
                    <span
                        v-if="props.row.projectStatus === 'PROJECT_DRAFT'"
                        class="form-state"
                    >
                        {{ t('project.status.draft') }}
                        <span
                            aria-hidden="true"
                            class="form-state-icon form-state-grey"
                        ><i class="bi bi-dash"></i></span>
                    </span>
                    <span
                        v-if="props.row.projectStatus === 'PROJECT_REJECTED'"
                        class="form-state"
                    >
                        {{ t('project.status.rejected') }}
                        <span
                            aria-hidden="true"
                            class="form-state-icon form-state-red"
                        ><i class="bi bi-x"></i></span>
                    </span>
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
                        v-if="props.row.projectStatus === 'PROJECT_REVIEW_DRAFT' ||
                            props.row.projectStatus === 'PROJECT_REVIEW_PROCESSING'"
                        class="form-state"
                    >
                        {{ t('project.status.review-processing') }}
                        <span
                            aria-hidden="true"
                            class="form-state-icon form-state-orange"
                        ><i class="bi bi-dash"></i></span>
                    </span>
                    <span
                        v-if="props.row.projectStatus === 'PROJECT_REVIEW_REJECTED'"
                        class="form-state"
                    >
                        {{ t('project.status.review-rejected') }}
                        <span
                            aria-hidden="true"
                            class="form-state-icon form-state-red"
                        ><i class="bi bi-x"></i></span>
                    </span>
                    <span
                        v-if="props.row.projectStatus === 'PROJECT_REVIEW_VALIDATED'"
                        class="form-state"
                    >
                        {{ t('project.status.archived') }}
                        <span
                            aria-hidden="true"
                            class="form-state-icon form-state-grey"
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
                            :disable="props.row.projectStatus !== 'PROJECT_DRAFT' || !userStore.hasPresidentStatus(importedProps.associationId)"
                            :label="t('project.project')"
                            :to="importedProps.associationId ? {name: 'SubmitProjectAssociation', params: {associationId: importedProps.associationId, projectId: props.row.id}} :
                                {name: 'SubmitProjectAssociation', params: {projectId: props.row.id}}"
                            icon="bi-pencil"
                        />
                        <QBtn
                            :disable="props.row.projectStatus !== 'PROJECT_VALIDATED' ||
                                props.row.projectStatus !== 'PROJECT_REVIEW_DRAFT' ||
                                props.row.projectStatus !== 'PROJECT_REVIEW_REJECTED' ||
                                props.row.projectStatus !== 'PROJECT_REVIEW_PROCESSING' ||
                                props.row.projectStatus !== 'PROJECT_REVIEW_VALIDATED'"
                            :label="t('project.review')"
                            icon="bi-pencil"
                        />
                    </div>
                </QTd>
            </QTr>
        </template>
    </QTable>
</template>