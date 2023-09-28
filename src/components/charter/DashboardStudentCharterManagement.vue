<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {useUserStore} from '@/stores/useUserStore'
import TableAssociationUserCharters from '@/components/charter/TableAssociationUserCharters.vue'
import {useQuasar} from 'quasar'
import InfoDocumentLibrary from '@/components/infoPanel/InfoDocumentLibrary.vue'

const {loading} = useQuasar()
const userStore = useUserStore()

const tab = ref('')

const initTab = () => {
    loading.show()
    if (userStore.userAssociations.length) {
        tab.value = userStore.userAssociations[0].association.id.toString()
    }
    loading.hide()
}

watch(() => userStore.userAssociations, initTab)

onMounted(initTab)

</script>

<template>
    <section class="dashboard-section">
        <div class="dashboard-section-container">
            <div class="container">
                <InfoDocumentLibrary/>
                <QCard>
                    <QTabs
                        v-model="tab"
                        active-color="charter"
                        align="justify"
                        indicator-color="charter"
                        narrow-indicator
                    >
                        <QTab
                            v-for="association in userStore.userAssociations"
                            :key="association.association.id"
                            :label="association.association.name"
                            :name="association.association.id.toString()"
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
                            :name="tab"
                        >
                            <TableAssociationUserCharters
                                :association-id="parseInt(tab)"
                            />
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

.q-card {
    margin-top: 2rem;
}

.dashboard-section .dashboard-section-container {
    padding: 0 0 3rem 0;
}

</style>