<script lang="ts" setup>
import HomeCard from '@/components/layout/LayoutHomeCard.vue'
import HomeBanner from '@/components/layout/LayoutHomeBanner.vue'
import {useHomeContent} from '@/stores/useContentStore'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {onMounted, ref, watch} from 'vue'

const home = useHomeContent()
const associationStore = useAssociationStore()
const {notify, loading} = useQuasar()
const {t} = useI18n()

onMounted(async () => {
  loading.show
  await onGetAssociationNames()
  loading.hide
})

const associationCount = ref<number>(associationStore.associationNames.length)
watch(() => associationStore.associationNames.length, () => {
  associationCount.value = associationStore.associationNames.length
})

async function onGetAssociationNames() {
  try {
    await associationStore.getAssociationNames(true, false)
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

  <section id="home-sections">
    <HomeCard
        :buttonLabel="home.cards[0].buttonLabel"
        :cssClass="home.cards[0].cssClass"
        :description="home.cards[0].description"
        :iconClass="home.cards[0].iconClass"
        :imageAlt="home.cards[0].imageAlt"
        :imagePath="home.cards[0].imagePath"
        :infoContent="associationCount + ' ' + home.cards[0].infoContent"
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
        :imageAlt="home.cards[1].imageAlt"
        :imagePath="home.cards[1].imagePath"
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
        :imageAlt="home.cards[2].imageAlt"
        :imagePath="home.cards[2].imagePath"
        :infoContent="home.cards[2].infoContent"
        :link="home.cards[2].link"
        :title="home.cards[2].title"
        :titleLine1="home.cards[2].titleLine1"
        :titleLine2="home.cards[2].titleLine2"
    />
  </section>
</template>

<style lang="scss">
@import '@/assets/styles/home.scss';
</style>