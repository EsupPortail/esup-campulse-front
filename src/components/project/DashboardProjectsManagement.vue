<script lang="ts" setup>
import TableManagedProjects from '@/components/project/TableManagedProjects.vue'
import useCommissions from '@/composables/useCommissions'
import {useI18n} from 'vue-i18n'
import {onMounted, ref, watch} from 'vue'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import axios from 'axios'
import FormProjectSearch from '@/components/form/FormProjectSearch.vue'
import {useProjectStore} from '@/stores/useProjectStore'

const {catchHTTPError} = useErrors()
const {
    getFunds,
    getCommissionFunds,
    getCommissionsForManagers,
    commissions,
} = useCommissions()
const {t} = useI18n()
const {loading, notify} = useQuasar()
const projectStore = useProjectStore()


const tab = ref('')
watch(() => tab.value, () => {
    innerTab.value = 'allProjects'
})

const innerTab = ref('allProjects')
const splitterModel = ref(10)

interface Tab {
    name: string,
    commission: number
}

const tabs = ref<Tab[]>([])

const initTabs = () => {
    tabs.value = []
    tabs.value = commissions.value.map(obj => ({
        name: obj.name,
        commission: obj.id
    }))
    if (tabs.value.length) tab.value = tabs.value.at(-1).name
}

onMounted(async () => {
    loading.show()
    await onGetCommissions()
    initTabs()
    loading.hide()
})

async function onGetCommissions() {
    try {
        await getCommissionsForManagers(
            true,
            undefined,
            undefined,
            undefined,
            true)
        await getFunds()
        await getCommissionFunds()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
}

async function onClearSearch() {
    loading.show()
    try {
        // Reset projects
        const commissionId = tabs.value.find(obj => obj.name === tab.value)?.commission
        await projectStore.getManagedProjects(commissionId)
        await projectStore.getProjectCommissionFunds(true, commissionId)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
    loading.hide()
}

</script>

<template>
    <div class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-folder"
            ></i>
            {{ t('commission.on-going') }}
        </h2>
        <div class="dashboard-section-container flex-column">
            <div class="container margin-bottom">
                <h3>{{ t('commission.search-project') }}</h3>
                <FormProjectSearch @on-clear-search="onClearSearch"/>
            </div>
            <QCard v-if="tabs.length">
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
                        :label="tab.name"
                        :name="tab.name"
                    />
                </QTabs>

                <QSeparator aria-hidden="true"/>

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
                            :limits="[10, 100]"
                            unit="%"
                        >
                            <template v-slot:before>
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
                                        :label="t('project.archived-projects')"
                                        icon="bi-archive"
                                        name="archivedProjects"
                                    />
                                </QTabs>
                            </template>

                            <template v-slot:separator>
                                <QAvatar
                                    color="commission"
                                    icon="bi-arrows"
                                    size="40px"
                                    text-color="white"
                                />
                            </template>

                            <template v-slot:after>
                                <QTabPanels
                                    v-model="innerTab"
                                    animated
                                    transition-next="slide-up"
                                    transition-prev="slide-down"
                                >
                                    <QTabPanel name="allProjects">
                                        <TableManagedProjects
                                            :commission-id="tab.commission"
                                            :commission-name="tab.name"
                                            :flat="true"
                                            :title="t('project.all-projects')"
                                            project-status="all"
                                        />
                                    </QTabPanel>
                                    <QTabPanel name="validatedProjects">
                                        <TableManagedProjects
                                            :commission-id="tab.commission"
                                            :commission-name="tab.name"
                                            :flat="true"
                                            :title="t('project.validated-projects')"
                                            project-status="validated"
                                        />
                                    </QTabPanel>
                                    <QTabPanel name="archivedProjects">
                                        <TableManagedProjects
                                            :commission-id="tab.commission"
                                            :commission-name="tab.name"
                                            :flat="true"
                                            :title="t('project.archived-projects')"
                                            project-status="archived"
                                        />
                                    </QTabPanel>
                                </QTabPanels>
                            </template>
                        </QSplitter>
                    </QTabPanel>
                </QTabPanels>
            </QCard>
            <p
                v-else
                class="paragraph"
            >
                {{ t('project.no-project-to-show') }}
            </p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';

.text-cape-color {
    color: $commissionColor;
}

.bg-cape-color {
    background: $commissionColorBackground;
}

.cape-color {
    color: $commissionColor;
}

.q-tab-panel {
    padding: 0 1rem;
}

.info-panel {
    margin: 0.5rem;
}

h3 {
    padding: 1rem
}

.q-card {
    width: 100%;
}
</style>
