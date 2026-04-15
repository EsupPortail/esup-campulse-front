<script lang="ts" setup>
import HomeCard from '@/components/layout/LayoutHomeCard.vue'
import HomeBanner from '@/components/layout/LayoutHomeBanner.vue'
import {useContentStore} from '@/stores/useContentStore'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {computed, onMounted} from 'vue'
import axios from 'axios'
import useErrors from '@/composables/useErrors'

const contentStore = useContentStore()
const {notify, loading} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()

async function onGetContents() {
    try {
        await contentStore.getContentsByCode(['HOME_ASSOCIATION', 'HOME_CHARTER', 'HOME_PROJECT', 'HOME_INFO'])
        await contentStore.getStats()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
}

const homeAssociation = computed(() =>
    contentStore.contents.find(obj => obj.code === 'HOME_ASSOCIATION')
)
const homeProject = computed(() =>
    contentStore.contents.find(obj => obj.code === 'HOME_PROJECT')
)
const homeCharter = computed(() =>
    contentStore.contents.find(obj => obj.code === 'HOME_CHARTER')
)
const homeInfo = computed(() =>
    contentStore.contents.find(obj => obj.code === 'HOME_INFO')
)

onMounted(async () => {
    loading.show()
    await onGetContents()
    loading.hide()
})

function reverseDate(date: string) {
    if (!date) return ''
    return date.split('-').reverse().join('/')
}

</script>

<template>
    <div>
        {{ homeInfo ?? 'undefined' }}
        <HomeBanner
            id="home-info-panel"
            :description="homeInfo?.body ?? ''"
            :title="homeInfo?.header ?? ''"
        />

        <div id="home-section">
            <HomeCard
                :buttonLabel="t('home.directory.button')"
                :cssClass="contentStore.CSSClasses[0]"
                :description="homeAssociation?.body ?? ''"
                :infoContent="'<strong>' + contentStore.stats?.associationCount + '</strong> ' + t('home.directory.registered-associations')"
                :titleLine1="t('home.directory.title-line-1')"
                :titleLine2="t('home.directory.title-line-2')"
                iconClass="bi-geo-alt"
                link="/associations"
            />
            <HomeCard
                :buttonLabel="t('home.charter.button')"
                :cssClass="contentStore.CSSClasses[1]"
                :description="homeCharter?.body ?? ''"
                :infoContent="t('home.charter.charter-update') + ' <strong>' + reverseDate(contentStore.stats?.lastCharterUpdate) + '</strong>'"
                :titleLine1="t('home.charter.title-line-1')"
                :titleLine2="t('home.charter.title-line-2')"
                iconClass="bi-book"
                link="/charter"
            />
            <HomeCard
                :buttonLabel="t('home.commission.button')"
                :cssClass="contentStore.CSSClasses[2]"
                :description="homeProject?.body ?? ''"
                :infoContent="t('home.commission.next-commission') + ' :<br>' + ' <strong>' + reverseDate(contentStore.stats?.nextCommissionDate) + '</strong>'"
                :titleLine1="t('home.commission.title-line-1')"
                :titleLine2="t('home.commission.title-line-2')"
                iconClass="bi-send"
                link="/commission"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/home.scss";
</style>
