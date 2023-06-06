<script lang="ts" setup>
import type {QTableProps} from 'quasar'
import {useI18n} from 'vue-i18n'
import useUtility from '@/composables/useUtility'
import ProjectStatusIndicator from '@/components/table/ProjectStatusIndicator.vue'
import type {ProjectList} from '#/project'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useUserManagerStore} from '@/stores/useUserManagerStore'

const {t} = useI18n()
const {formatDate} = useUtility()
const associationStore = useAssociationStore()
const userManagerStore = useUserManagerStore()

const props = defineProps<{
    projects: ProjectList[]
}>()

const applicant = (association: number | null, user: number | null) => {
    if (association) {
        return associationStore.associationNames.find(obj => obj.id === association)?.name
    } else {
        const userObj = userManagerStore.users.find(obj => obj.id === user)
        return `${userObj?.firstName} ${userObj?.lastName}`
    }
}

const columns: QTableProps['columns'] = [
    {name: 'name', align: 'left', label: t('project.name'), field: 'name', sortable: true},
    {name: 'applicant', align: 'left', label: t('project.applicant'), field: 'applicant', sortable: true},
    {name: 'lastModifiedDate', align: 'left', label: t('project.last-modified-date'), field: 'email', sortable: true},
    {name: 'status', align: 'left', label: t('status'), field: 'status', sortable: true},
    {name: 'edition', align: 'center', label: t('manage'), field: 'edition', sortable: false},
]

</script>

<template>
    <QTable
            :columns="columns"
            :loading="!props.projects"
            :rows="props.projects"
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
                    {{ applicant(props.row.association, props.row.user) }}
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
                    <ProjectStatusIndicator
                            :project-status="props.row.projectStatus"
                            :show-draft="false"
                    />
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

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';
</style>
