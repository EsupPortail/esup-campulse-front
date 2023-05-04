<script lang="ts" setup>
import useSecurity from '@/composables/useSecurity'
import {useI18n} from 'vue-i18n'
import {onMounted} from 'vue'
import useUserAssociations from '@/composables/useUserAssociations'
import {QTableProps} from 'quasar'
import {useProjectStore} from '@/stores/useProjectStore'
import {useUserStore} from '@/stores/useUserStore'
import TableUserProjects from '@/components/table/TableUserProjects.vue'

const {hasPerm} = useSecurity()
const {t} = useI18n()
const {initUserAssociations} = useUserAssociations()
const projectStore = useProjectStore()
const userStore = useUserStore()

onMounted(async () => {
    initUserAssociations(false)
    await projectStore.getAllProjects()
})

const columns: QTableProps['columns'] = [
    {name: 'name', align: 'left', label: t('project.name'), field: 'name', sortable: true},
    {name: 'lastModifiedDate', align: 'left', label: t('project.last-modified-date'), field: 'email', sortable: true},
    {name: 'status', align: 'left', label: t('status'), field: 'status', sortable: true},
    {name: 'edition', align: 'center', label: t('manage'), field: 'edition', sortable: false},
]
</script>

<template>
    <!--    <section class="dashboard-section">
            <div class="form-container">
                <div class="form">
                    <QBtn
                        v-if="hasPerm('add_project_user')"
                        :label="t('project.submit-new-project')"
                        :to="{name: 'SubmitProjectIndividual'}"
                    />
                </div>
            </div>
        </section>-->
    <section v-if="hasPerm('add_project_association')">
        <section
            v-for="association in userStore.userAssociations"
            :key="association.id"
            class="dashboard-section"
        >
            <h2>
                <i
                    aria-hidden="true"
                    class="bi bi-people"
                ></i>
                {{ association.association.name }}
            </h2>
            <div

                class="form-container"
            >
                <div class="form">
                    <TableUserProjects
                        v-if="projectStore.projects.find(project => project.association === association.association.id)"
                        :columns="columns"
                        :projects="projectStore.projects.filter(project => project.association === association.association.id)"
                        :title="association.association.name"
                    />
                    <p
                        v-else
                        class="paragraph"
                    >
                        {{ t('project.no-project-to-show') }}
                    </p>
                </div>
            </div>
        </section>
    </section>
    <section v-if="hasPerm('add_project_user')">
    </section>
</template>

<style lang="scss">
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
</style>
