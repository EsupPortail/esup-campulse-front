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
const {
    initAssociationCharters,
    getCharters,
    charterProcesses,
    initProcessingCharters,
    processingCharters
} = useCharters()
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

const initCharters = () => {
    initAssociationCharters(tab.value as TabOption)
    initProcessingCharters(tab.value as TabOption)
}

watch(() => tab.value, initCharters)
watch(() => innerTab.value, initCharters)

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
        label: t('charter.all-charters'),
        icon: 'bi-book'
    },
    {
        name: 'processingCharters',
        label: t('charter.processing-charters'),
        icon: 'bi-bell'
    }
]

const tabs = ref<Tab[]>([])

const initTabs = () => {
    tabs.value = []
    if (!isManagerMisc()) {
        tabs.value.push({
            label: t('charter.site.title'),
            name: 'CHARTER_ASSOCIATION'
        })
    }
    tabs.value.push({
        label: t('charter.project-fund.title'),
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
                                        >
                                            <QBadge
                                                v-if="innerTab.name === 'processingCharters' && processingCharters.length"
                                                :aria-label="`${processingCharters.length} ${t('charter.processing-charters').toLowerCase()}`"
                                                color="custom-red"
                                                floating
                                            >
                                                {{ processingCharters.length }}
                                            </QBadge>
                                        </QTab>
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
                                            <TableManageProcessingCharters :process-type="tab.name"/>
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