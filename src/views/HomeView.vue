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
import type {Content} from '#/index'
import useDocuments from '@/composables/useDocuments'
import useUtility from '@/composables/useUtility'

const contentStore = useContentStore()
const associationStore = useAssociationStore()
const {getNextCommission, commission} = useCommissions()
const {notify, loading} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()
const {documents, getDocumentByAcronym} = useDocuments()
const {formatDate} = useUtility()

onMounted(async () => {
    loading.show()
    await onGetContents()
    initContent()
    loading.hide()
})

const associationCount = ref<number>(associationStore.associationNames.length)
watch(() => associationStore.associationNames.length, () => {
    associationCount.value = associationStore.associationNames.length
})

const homeAssociation = ref<Content>()
const homeCharter = ref<Content>()
const homeProject = ref<Content>()
const homeInfo = ref<Content>()

function findContentObject(code: string) {
    return contentStore.contents.find(obj => obj.code === code)
}

const initContent = () => {
    homeAssociation.value = findContentObject('HOME_ASSOCIATION')
    homeProject.value = findContentObject('HOME_PROJECT')
    homeCharter.value = findContentObject('HOME_CHARTER')
    homeInfo.value = findContentObject('HOME_INFO')
}

const nextCommissionDate = ref('')
const lastCharterUpdate = ref('')

async function onGetContents() {
    try {
        await contentStore.getContentsByCode(['HOME_ASSOCIATION', 'HOME_CHARTER', 'HOME_PROJECT', 'HOME_INFO'])
        await associationStore.getAssociationNames(true, false)
        await getNextCommission()
        nextCommissionDate.value = commission.value?.commissionDate.split('-').reverse().join('/') ?? ''
        await getDocumentByAcronym('CHARTE_SITE_ALSACE')
        lastCharterUpdate.value = formatDate(documents.value[0]?.editionDate)?.split('-').reverse().join('/') ?? ''
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}

</script>

<template>
    <HomeBanner
        id="home-info-panel"
        :description="homeInfo?.body"
        :title="homeInfo?.header"
    />

    <div id="home-section">
        <HomeCard
            :buttonLabel="t('home.directory.button')"
            :cssClass="contentStore.CSSClasses[0]"
            :description="homeAssociation?.body"
            :infoContent="'<strong>' + associationCount + '</strong> ' + t('home.directory.registered-associations')"
            :titleLine1="t('home.directory.title-line-1')"
            :titleLine2="t('home.directory.title-line-2')"
            iconClass="bi-geo-alt"
            link="/associations"
        />
        <HomeCard
            :buttonLabel="t('home.charter.button')"
            :cssClass="contentStore.CSSClasses[1]"
            :description="homeCharter?.body"
            :infoContent="t('home.charter.charter-update') + ' <strong>' + lastCharterUpdate + '</strong>'"
            :titleLine1="t('home.charter.title-line-1')"
            :titleLine2="t('home.charter.title-line-2')"
            iconClass="bi-book"
            link="/charter"
        />
        <HomeCard
            :buttonLabel="t('home.commission.button')"
            :cssClass="contentStore.CSSClasses[2]"
            :description="homeProject?.body"
            :infoContent="t('home.commission.next-commission') + ' :<br>' + ' <strong>' + nextCommissionDate + '</strong>'"
            :titleLine1="t('home.commission.title-line-1')"
            :titleLine2="t('home.commission.title-line-2')"
            iconClass="bi-send"
            link="/commission"
        />
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/home.scss";
</style>
