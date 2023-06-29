<script lang="ts" setup>
import HomeCard from '@/components/layout/LayoutHomeCard.vue'
import HomeBanner from '@/components/layout/LayoutHomeBanner.vue'
import useCommissions from '@/composables/useCommissions'
import {useContentStore} from '@/stores/useContentStore'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {onMounted, ref, watch} from 'vue'
import axios from 'axios'
import useErrors from '@/composables/useErrors'

const home = useContentStore()
const associationStore = useAssociationStore()
const {getNextCommission, commission} = useCommissions()
const {notify, loading} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()

onMounted(async () => {
    loading.show()
    await onGetContents()
    loading.hide()
})

const associationCount = ref<number>(associationStore.associationNames.length)
watch(() => associationStore.associationNames.length, () => {
    associationCount.value = associationStore.associationNames.length
})

const nextCommissionDate = ref<string>()

async function onGetContents() {
    try {
        await associationStore.getAssociationNames(true, false)
        await getNextCommission()
        nextCommissionDate.value = commission.value?.commissionDate.split('-').reverse().join('/')
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
            :titleLine1="home.cards[2].titleLine1"
            :titleLine2="home.cards[2].titleLine2"
        />
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/home.scss";
</style>