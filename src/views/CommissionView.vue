<script lang="ts" setup>
import useSecurity from '@/composables/useSecurity'
import {useI18n} from 'vue-i18n'
import {onMounted} from 'vue'
import useUserAssociations from '@/composables/useUserAssociations'
import {useQuasar} from 'quasar'
import {useProjectStore} from '@/stores/useProjectStore'
import {useUserStore} from '@/stores/useUserStore'
import TableUserProjects from '@/components/table/TableUserProjects.vue'
import axios from 'axios'
import useErrors from '@/composables/useErrors'

const {hasPerm} = useSecurity()
const {t} = useI18n()
const {initUserAssociations} = useUserAssociations()
const projectStore = useProjectStore()
const userStore = useUserStore()
const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()

onMounted(async () => {
    loading.show()
    initUserAssociations(false)
    await onGetProjects()
    loading.hide()
})

async function onGetProjects() {
    try {
        await projectStore.getAllProjects()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }

    }
}
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

<style lang="scss">
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
</style>

<style lang="sass" scoped>
p.paragraph
    text-align: center
</style>
