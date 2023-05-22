<script lang="ts" setup>
import useSecurity from '@/composables/useSecurity'
import {useProjectStore} from '@/stores/useProjectStore'
import {useUserStore} from '@/stores/useUserStore'
import {useI18n} from 'vue-i18n'
import TableUserProjects from '@/components/table/TableUserProjects.vue'
import {onMounted, watch} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {useAssociationStore} from '@/stores/useAssociationStore'
import type {Association} from '#/association'

const {hasPerm} = useSecurity()
const {t} = useI18n()
const userStore = useUserStore()
const projectStore = useProjectStore()
const associationStore = useAssociationStore()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()


onMounted(async () => {
    await onGetAssociations()
})

watch(() => userStore.userAssociations, async () => {
    await onGetAssociations()
})

async function onGetAssociations() {
    loading.show()
    try {
        const associationIds = userStore.userAssociations.map(association => association.association.id)
        associationStore.associations = []
        for (const associationId of associationIds) {
            await associationStore.getAssociationDetail(associationId, false)
            associationStore.associations.push(associationStore.association as Association)
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
                        v-if="!associationStore.associations.find(obj => obj.id === association.association.id)?.canSubmitProjects"
                        class="info-panel info-panel-warning"
                    >
                        <i
                            aria-hidden="true"
                            class="bi bi-exclamation-lg"
                        ></i>
                        <p>
                            {{ t('project.cannot-submit-projects') }}
                        </p>
                    </div>
                    <div
                        v-if="userStore.hasPresidentStatus(association.association.id)"
                        class="btn-group"
                    >
                        <QBtn
                            :disable="!associationStore.associations.find(obj => obj.id === association.association.id)?.canSubmitProjects"
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