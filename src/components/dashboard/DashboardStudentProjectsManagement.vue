<script lang="ts" setup>
import useSecurity from '@/composables/useSecurity'
import {useProjectStore} from '@/stores/useProjectStore'
import {useUserStore} from '@/stores/useUserStore'
import {useI18n} from 'vue-i18n'
import TableUserProjects from '@/components/table/TableUserProjects.vue'
import {onMounted, ref, watch} from 'vue'
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
    await onGetAssociations()
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

</script>

<template>
    <section class="dashboard-section">
        <div class="form-container">
            <div class="form">
                <QCard>
                    <QTabs
                        v-model="tab"
                        active-color="cape-color"
                        align="justify"
                        class="text-grey"
                        dense
                        indicator-color="cape-color"
                    >
                        <QTab
                            v-for="(tab, index) in tabs"
                            :key="index"
                            :label="tab.label"
                            :name="tab.name"
                        />
                    </QTabs>

                    <QSeparator/>

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
                                    <div
                                        v-if="tab.association"
                                    >
                                        <div
                                            v-if="associationStore.associations.find(obj => obj.id === tab.association)?.canSubmitProjects"
                                        >
                                            <div
                                                v-if="userStore.hasPresidentStatus(tab.association)"
                                                class="btn-group"
                                            >
                                                <QBtn
                                                    :disable="!associationStore.associations.find(obj => obj.id === tab.association)?.canSubmitProjects"
                                                    :label="t('project.submit-new-project')"
                                                    :to="{name: 'SubmitProjectAssociation', params: {associationId: tab.association}}"
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
                                        <div class="btn-group">
                                            <QBtn
                                                :label="t('project.submit-new-project')"
                                                :to="{name: 'SubmitProjectIndividual'}"
                                                icon="bi-plus-circle"
                                            />
                                        </div>
                                    </div>

                                    <QTabs
                                        v-model="innerTab"
                                        class="cape-color"
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
                                            <h2 class="title-3">{{ t('project.all-projects') }}</h2>
                                            <TableUserProjects
                                                :association-id="tab.association"
                                                :projects="tab.association ?
                                                    projectStore.projects.filter(project => project.association === tab.association) :
                                                    projectStore.projects.filter(project => project.user === userStore.user?.id)"
                                                :title="tab.label"
                                            />
                                        </QTabPanel>
                                        <QTabPanel name="validatedProjects">
                                            <h2 class="title-3">{{ t('project.validated-projects') }}</h2>
                                            <TableUserProjects
                                                :association-id="tab.association"
                                                :projects="tab.association ?
                                                    projectStore.projects.filter(project => project.association === tab.association
                                                        && project.projectStatus === 'PROJECT_REVIEW_VALIDATED') :
                                                    projectStore.projects.filter(project => project.user === userStore.user?.id
                                                        && project.projectStatus === 'PROJECT_REVIEW_VALIDATED')"
                                                :title="tab.label"
                                            />
                                        </QTabPanel>
                                        <QTabPanel name="rejectedProjects">
                                            <h2 class="title-3">{{ t('project.rejected-projects') }}</h2>
                                            <TableUserProjects
                                                :association-id="tab.association"
                                                :projects="tab.association ?
                                                    projectStore.projects.filter(project => project.association === tab.association &&
                                                        (project.projectStatus === 'PROJECT_REJECTED' || project.projectStatus === 'PROJECT_REVIEW_REJECTED')) :
                                                    projectStore.projects.filter(project => project.user === userStore.user?.id &&
                                                        (project.projectStatus === 'PROJECT_REJECTED' || project.projectStatus === 'PROJECT_REVIEW_REJECTED'))"
                                                :title="tab.label"
                                            />
                                        </QTabPanel>
                                    </QTabPanels>
                                </template>
                            </QSplitter>
                        </QTabPanel>
                    </QTabPanels>
                </QCard>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.text-cape-color {
    color: $capeColor !important;
}

.bg-cape-color {
    background: $capeColorBackground !important;
}

.cape-color {
    color: $capeColor;
}

.form {
    width: 75% !important;
}

.q-tab-panel {
    padding: 0 1rem;
}

.info-panel {
    margin: 0.5rem;
}
</style>