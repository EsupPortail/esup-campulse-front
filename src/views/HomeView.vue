<script lang="ts" setup>
import HomeCard from '@/components/layout/LayoutHomeCard.vue'
import HomeBanner from '@/components/layout/LayoutHomeBanner.vue'
import useCommissions from '@/composables/useCommissions'
import {useHomeContent} from '@/stores/useContentStore'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {onMounted, ref, watch} from 'vue'

const home = useHomeContent()
const associationStore = useAssociationStore()
const {getCommissionDates, commissionDates} = useCommissions()
const {notify, loading} = useQuasar()
const {t} = useI18n()

onMounted(async () => {
    loading.show
    await onGetContents()
    loading.hide
})

const associationCount = ref<number>(associationStore.associationNames.length)
watch(() => associationStore.associationNames.length, () => {
    associationCount.value = associationStore.associationNames.length
})

const nextCommissionDate = ref<string>()

async function onGetContents() {
    try {
        await associationStore.getAssociationNames(true, false)
        await getCommissionDates()
        nextCommissionDate.value = (new Date(commissionDates.value[0].commissionDate)).toLocaleDateString('fr-FR')
    } catch (error) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

</script>

<template>
    <HomeBanner
        id="home-info-panel"
        :description="home.banner.description"
        :is-displayed="home.banner.isDisplayed"
        :title="home.banner.title"
    />

    <div id="home-section">
        <HomeCard
            :buttonLabel="home.cards[0].buttonLabel"
            :cssClass="home.cards[0].cssClass"
            :description="home.cards[0].description"
            :iconClass="home.cards[0].iconClass"
            :infoContent="'<strong>' + associationCount + '</strong> ' + home.cards[0].infoContent"
            :link="home.cards[0].link"
            :title="home.cards[0].title"
            :titleLine1="home.cards[0].titleLine1"
            :titleLine2="home.cards[0].titleLine2"
        />
        <HomeCard
            :buttonLabel="home.cards[1].buttonLabel"
            :cssClass="home.cards[1].cssClass"
            :description="home.cards[1].description"
            :iconClass="home.cards[1].iconClass"
            :infoContent="home.cards[1].infoContent"
            :link="home.cards[1].link"
            :title="home.cards[1].title"
            :titleLine1="home.cards[1].titleLine1"
            :titleLine2="home.cards[1].titleLine2"
        />
        <HomeCard
            :buttonLabel="home.cards[2].buttonLabel"
            :cssClass="home.cards[2].cssClass"
            :description="home.cards[2].description"
            :iconClass="home.cards[2].iconClass"
            :infoContent="home.cards[2].infoContent + ' <strong>' + nextCommissionDate + '</strong>'"
            :link="home.cards[2].link"
            :title="home.cards[2].title"
            :titleLine1="home.cards[2].titleLine1"
            :titleLine2="home.cards[2].titleLine2"
        />
    </div>
</template>

<style lang="scss">
@import '@/assets/styles/home.scss';
</style>
