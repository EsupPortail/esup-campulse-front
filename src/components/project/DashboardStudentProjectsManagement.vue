<script lang="ts" setup>
import useSecurity from '@/composables/useSecurity'
import {useProjectStore} from '@/stores/useProjectStore'
import {useUserStore} from '@/stores/useUserStore'
import {useI18n} from 'vue-i18n'
import TableUserProjects from '@/components/project/TableUserProjects.vue'
import {onMounted, ref, watch} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {useAssociationStore} from '@/stores/useAssociationStore'
import type {Association} from '#/association'
import useUserAssociations from '@/composables/useUserAssociations'

const {hasPerm} = useSecurity()
const {t} = useI18n()
const userStore = useUserStore()
const projectStore = useProjectStore()
const associationStore = useAssociationStore()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {initUserAssociations} = useUserAssociations()

interface Tabs {
    label: string,
    name: string,
    association: number | null
}

const tabs = ref<Tabs[]>([])

const initTabs = () => {
    tabs.value = []
    if (hasPerm('add_project_association')) {
        userStore.userAssociations.forEach(association => {
            tabs.value.push({
                label: t('project.projects-of') + ' ' + association.association.name,
                name: association.association.name,
                association: association.association.id
            })
        })
    }
    if (hasPerm('add_project_user')) {
        tabs.value.push({
            label: t('project.individual-projects'),
            name: t('project.individual-projects'),
            association: null
        })
    }
    if (tabs.value.length) tab.value = tabs.value[0].name
}
watch(() => userStore.userAssociations, initTabs)

const tab = ref('')
const innerTab = ref('allProjects')
const splitterModel = ref(20)

onMounted(async () => {
    loading.show()
    await onGetProjects()
    await onGetAssociations()
    initUserAssociations(false)
    initTabs()
    loading.hide()
})

watch(() => userStore.userAssociations, async () => {
    await onGetAssociations()
})

async function onGetAssociations() {
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
}


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
    <div class="container-lg padding-top padding-bottom">
        <QCard>
            <QTabs
                v-model="tab"
                active-color="commission"
                align="justify"
                class="text-grey"
                dense
                indicator-color="commission"
            >
                <QTab
                    v-for="(tab, index) in tabs"
                    :key="index"
                    :label="tab.label"
                    :name="tab.name"
                />
            </QTabs>

            <QSeparator
                aria-hidden="true"
                role="presentation"
            />

            <QTabPanels
                v-model="tab"
                animated
            >
                <QTabPanel
                    v-for="(tab, index) in tabs"
                    :key="index"
                    :name="tab.name"
                    class="q-pa-none"
                >
                    <QSplitter
                        v-model="splitterModel"
                    >
                        <template v-slot:before>
                            <div v-if="tab.association">
                                <div
                                    v-if="associationStore.associations.find(obj => obj.id === tab.association)?.canSubmitProjects"
                                >
                                    <div
                                        v-if="userStore.hasPresidentStatus(tab.association)"
                                        class="flex-row-center padding-top padding-bottom"
                                    >
                                        <QBtn
                                            :disable="!associationStore.associations.find(obj => obj.id === tab.association)?.canSubmitProjects"
                                            :label="t('project.submit-new-project')"
                                            :to="{name: 'SubmitProjectAssociation', params: {associationId: tab.association}}"
                                            class="btn-lg"
                                            color="commission"
                                            icon="bi-plus-circle"
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
                                        {{ t('project.cannot-submit-projects') }}
                                    </p>
                                </div>
                            </div>
                            <div v-else>
                                <div class="flex-row-center padding-top">
                                    <QBtn
                                        :label="t('project.submit-new-project')"
                                        :to="{name: 'SubmitProjectIndividual'}"
                                        class="btn-lg"
                                        color="commission"
                                        icon="bi-plus-circle"
                                    />
                                </div>
                            </div>

                            <QTabs
                                v-model="innerTab"
                                class="text-commission"
                                vertical
                            >
                                <QTab
                                    :label="t('project.all-projects')"
                                    icon="bi-folder"
                                    name="allProjects"
                                />
                                <QTab
                                    :label="t('project.validated-projects')"
                                    icon="bi-folder-check"
                                    name="validatedProjects"
                                />
                                <QTab
                                    :label="t('project.rejected-projects')"
                                    icon="bi-folder-x"
                                    name="rejectedProjects"
                                />
                            </QTabs>
                        </template>

                        <template v-slot:after>
                            <QTabPanels
                                v-model="innerTab"
                                animated
                                transition-next="slide-up"
                                transition-prev="slide-down"
                            >
                                <QTabPanel name="allProjects">
                                    <TableUserProjects
                                        :association-id="tab.association"
                                        :projects="tab.association ?
                                            projectStore.projects.filter(project => project.association === tab.association) :
                                            projectStore.projects.filter(project => project.user === userStore.user?.id)"
                                        :title="t('project.all-projects')"
                                    />
                                </QTabPanel>
                                <QTabPanel name="validatedProjects">
                                    <TableUserProjects
                                        :association-id="tab.association"
                                        :projects="tab.association ?
                                            projectStore.projects.filter(project => project.association === tab.association
                                                && project.projectStatus === 'PROJECT_REVIEW_VALIDATED') :
                                            projectStore.projects.filter(project => project.user === userStore.user?.id
                                                && project.projectStatus === 'PROJECT_REVIEW_VALIDATED')"
                                        :title="t('project.validated-projects')"
                                    />
                                </QTabPanel>
                                <QTabPanel name="rejectedProjects">
                                    <TableUserProjects
                                        :association-id="tab.association"
                                        :projects="tab.association ?
                                            projectStore.projects.filter(project => project.association === tab.association &&
                                                (project.projectStatus === 'PROJECT_REJECTED' || project.projectStatus === 'PROJECT_REVIEW_REJECTED')) :
                                            projectStore.projects.filter(project => project.user === userStore.user?.id &&
                                                (project.projectStatus === 'PROJECT_REJECTED' || project.projectStatus === 'PROJECT_REVIEW_REJECTED'))"
                                        :title="t('project.rejected-projects')"
                                    />
                                </QTabPanel>
                            </QTabPanels>
                        </template>
                    </QSplitter>
                </QTabPanel>
            </QTabPanels>
        </QCard>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

.info-panel {
    margin: 1rem;
}

.q-tab {
    font-size: inherit;
}
</style>
