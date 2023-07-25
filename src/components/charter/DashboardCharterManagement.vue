<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import useUserGroups from '@/composables/useUserGroups'
import TableManageCharters from '@/components/charter/TableManageCharters.vue'
import TableManageProcessingCharters from '@/components/charter/TableManageProcessingCharters.vue'
import axios from 'axios'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import useCharters from '@/composables/useCharters'
import useDocumentUploads from '@/composables/useDocumentUploads'
import {useQuasar} from 'quasar'
import {useAssociationStore} from '@/stores/useAssociationStore'


const {t} = useI18n()
const {catchHTTPError} = useErrors()
const {initAssociationCharters, getCharters, charterProcesses, initProcessingCharters} = useCharters()
const {loading, notify} = useQuasar()
const associationStore = useAssociationStore()
const {getDocuments} = useDocumentUploads()
const {isManagerMisc} = useUserGroups()


async function onGetCharters() {
    try {
        await associationStore.getAssociations(false)
        await getDocuments(charterProcesses)
        await getCharters()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

onMounted(async () => {
    loading.show()
    await onGetCharters()
    initTabs()
    loading.hide()
})

type TabOption = 'CHARTER_ASSOCIATION' | 'CHARTER_PROJECT_FUND'
type InnerTabOption = 'allCharters' | 'processingCharters'

const tab = ref<TabOption | ''>('')
const innerTab = ref<InnerTabOption>('allCharters')

watch(() => tab.value, () => {
    if (innerTab.value === 'allCharters') {
        initAssociationCharters(tab.value as TabOption)
    } else {
        initProcessingCharters(tab.value as TabOption)
    }
})

const splitterModel = ref<number>(20)

interface Tab {
    label: string,
    name: TabOption
}

interface InnerTab {
    label: string,
    name: InnerTabOption,
    icon: string
}

const innerTabs: InnerTab[] = [
    {
        name: 'allCharters',
        label: 'Toutes les chartes',
        icon: 'bi-book'
    },
    {
        name: 'processingCharters',
        label: 'Chartes à valider',
        icon: 'bi-bell'
    }
]

const tabs = ref<Tab[]>([])

const initTabs = () => {
    tabs.value = []
    if (!isManagerMisc()) {
        tabs.value.push({
            label: 'Charte des associations du site Alsace',
            name: 'CHARTER_ASSOCIATION'
        })
    }
    tabs.value.push({
        label: 'Chartes de subventionnement',
        name: 'CHARTER_PROJECT_FUND'
    })
    tab.value = tabs.value[0].name
}

</script>

<template>
    <section class="dashboard-section">
        <div class="dashboard-section-container">
            <div class="container-lg">
                <QCard>
                    <QTabs
                        v-model="tab"
                        active-color="text-charter"
                        align="justify"
                        class="text-charter"
                        dense
                        indicator-color="bg-charter"
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
                                    <QTabs
                                        v-model="innerTab"
                                        class="text-charter"
                                        vertical
                                    >
                                        <QTab
                                            v-for="(innerTab, index) in innerTabs"
                                            :key="index"
                                            :icon="innerTab.icon"
                                            :label="innerTab.label"
                                            :name="innerTab.name"
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
                                        <QTabPanel name="allCharters">
                                            <TableManageCharters/>
                                        </QTabPanel>
                                        <QTabPanel name="processingCharters">
                                            <TableManageProcessingCharters/>
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
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

</style>