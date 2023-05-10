<script lang="ts" setup>
import useSecurity from '@/composables/useSecurity'
import {useProjectStore} from '@/stores/useProjectStore'
import {useUserStore} from '@/stores/useUserStore'
import {useI18n} from 'vue-i18n'
import TableUserProjects from '@/components/table/TableUserProjects.vue'

const {hasPerm} = useSecurity()
const {t} = useI18n()
const userStore = useUserStore()
const projectStore = useProjectStore()
</script>

<template>
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
            <div class="form-container">
                <div class="form">
                    <div
                        v-if="userStore.hasPresidentStatus(association.association.id)"
                        class="btn-group"
                    >
                        <QBtn
                            :label="t('project.submit-new-project')"
                            :to="{name: 'SubmitProjectAssociation', params: {associationId: association.association.id}}"
                            icon="mdi-plus-circle-outline"
                        />
                    </div>
                    <div
                        v-else
                        class="info-panel info-panel-warning"
                    >
                        <i
                            aria-hidden="true"
                            class="bi bi-exclamation-lg"
                        ></i>
                        <p>
                            {{ t('project.must-have-president-status') }}
                        </p>
                    </div>
                    <TableUserProjects
                        v-if="projectStore.projects.find(project => project.association === association.association.id)"
                        :association-id="association.association.id"
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
        <section class="dashboard-section">
            <h2>
                <i
                    aria-hidden="true"
                    class="bi bi-person"
                ></i>
                {{ t('project.individual-projects') }}
            </h2>
            <div

                class="form-container"
            >
                <div class="form">
                    <div class="btn-group">
                        <QBtn
                            :label="t('project.submit-new-project')"
                            :to="{name: 'SubmitProjectIndividual'}"
                            icon="mdi-plus-circle-outline"
                        />
                    </div>
                    <TableUserProjects
                        v-if="projectStore.projects.find(project => project.user === userStore.user?.id)"
                        :association-id="null"
                        :projects="projectStore.projects.filter(project => project.user === userStore.user?.id)"
                        :title="t('project.individual-projects')"
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
</template>