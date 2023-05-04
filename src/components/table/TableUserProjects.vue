<script lang="ts" setup>
import {QTableProps} from 'quasar'
import {useProjectStore} from '@/stores/useProjectStore'
import type {ProjectList} from '#/project'
import useUtility from '@/composables/useUtility'
import {useI18n} from 'vue-i18n'

const props = defineProps<{
    columns: QTableProps['columns'],
    projects: ProjectList[],
    title: string
}>()

const projectStore = useProjectStore()
const {formatDate} = useUtility()
const {t} = useI18n()
</script>

<template>
    <QTable
        :columns="columns"
        :loading="!projectStore.projects"
        :rows="props.projects"
        :rows-per-page-options="[10, 20, 50, 0]"
        :title="props.title"
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
                            :label="t('project.project')"
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