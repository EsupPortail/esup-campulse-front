<script lang="ts" setup>
import TableManagedProjects from '@/components/table/TableManagedProjects.vue'
import useCommissions from '@/composables/useCommissions'
import {useI18n} from 'vue-i18n'
import {onMounted, ref, watch} from 'vue'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import axios from 'axios'

const {catchHTTPError} = useErrors()
const {
    getFunds,
    getCommissionFunds,
    getCommissionsForManagers,
    commissions
} = useCommissions()
const {t} = useI18n()
const {loading, notify} = useQuasar()


const tab = ref('')
watch(() => tab.value, () => {
    innerTab.value = 'allProjects'
})

const innerTab = ref('allProjects')
const splitterModel = ref(20)

interface Tabs {
    name: string,
    commission: number
}

const tabs = ref<Tabs[]>([])

const initTabs = () => {
    tabs.value = []
    tabs.value = commissions.value.map(obj => ({
        name: obj.name,
        commission: obj.id
    }))
    if (tabs.value.length) tab.value = tabs.value[0].name
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
            true)
        await getFunds()
        await getCommissionFunds()
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
                                <h3 class="title-3">{{ t('project.all-projects') }}</h3>
                                <TableManagedProjects
                                    :commission="tab.commission"
                                    project-status="all"
                                />
                            </QTabPanel>
                            <QTabPanel name="validatedProjects">
                                <h3 class="title-3">{{ t('project.validated-projects') }}</h3>
                                <TableManagedProjects
                                    :commission="tab.commission"
                                    project-status="validated"
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

.q-tab-panel {
    padding: 0 1rem;
}

.info-panel {
    margin: 0.5rem;
}

h3 {
    padding: 1rem
}
</style>