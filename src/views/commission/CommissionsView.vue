<script lang="ts" setup>
import LayoutImageText from '@/components/layout/LayoutImageText.vue'
import LayoutTextImageColor from '@/components/layout/LayoutTextImageColor.vue'
import LayoutPageCards from '@/components/layout/LayoutPageCards.vue'
import type {Content, ContentCode, PageCard} from '#/index'
import useUserGroups from '@/composables/useUserGroups'
import {onMounted, ref} from 'vue'
import useSecurity from '@/composables/useSecurity'
import axios from 'axios'
import {useContentStore} from '@/stores/useContentStore'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import CommissionImage1 from '@/assets/img/commission-image-1.jpg'
import CommissionImage2 from '@/assets/img/commission-image-2.jpg'

const {isStaff, isMemberFund} = useUserGroups()
const {hasPerm} = useSecurity()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const contentStore = useContentStore()

const firstBlock = ref<Content>()
const secondBlock = ref<Content>()
const manageProjects = ref<Content>()
const manageArchive = ref<Content>()
const manageCommissions = ref<Content>()
const submitProject = ref<Content>()
const downloadDocuments = ref<Content>()

const pageCards = ref<PageCard[]>([])

function findContentObject(code: ContentCode) {
    return contentStore.contents.find(obj => obj.code === code)
}

const initContents = () => {
    firstBlock.value = findContentObject('COMMISSION_HOME_FIRST_BLOCK')
    secondBlock.value = findContentObject('COMMISSION_HOME_SECOND_BLOCK')
    manageProjects.value = findContentObject('COMMISSION_HOME_ACTION_MANAGE_PROJECTS')
    manageArchive.value = findContentObject('COMMISSION_HOME_ACTION_MANAGE_ARCHIVE')
    manageCommissions.value = findContentObject('COMMISSION_HOME_ACTION_MANAGE_COMMISSIONS')
    submitProject.value = findContentObject('COMMISSION_HOME_ACTION_SUBMIT_PROJECT')
    downloadDocuments.value = findContentObject('COMMISSION_HOME_ACTION_DOWNLOAD_DOCUMENTS')
}


const initPageCards = () => {
    pageCards.value = []
    if (isStaff.value || isMemberFund.value) {
        pageCards.value.push({
            to: {name: 'ManageProjects'},
            btnLabel: manageProjects.value?.header,
            icon: 'bi-piggy-bank',
            text: manageProjects.value?.body
        })
        pageCards.value.push({
            to: {name: 'ArchivedCommission'},
            btnLabel: manageArchive.value?.header,
            icon: 'bi-archive',
            text: manageArchive.value?.body
        })
    }
    if (hasPerm('add_commission') || hasPerm('change_commission')) {
        pageCards.value.push({
            to: {name: 'ManageCommissionDates'},
            btnLabel: manageCommissions.value?.header,
            icon: 'bi-calendar',
            text: manageCommissions.value?.body
        })
    }
    if (hasPerm('add_project_association') || hasPerm('add_project_user')) {
        pageCards.value.push({
            to: {name: 'ManageProjects'},
            btnLabel: submitProject.value?.header,
            icon: 'bi-send',
            text: submitProject.value?.body
        })
        pageCards.value.push({
            to: {name: 'DocumentsLibrary'},
            btnLabel: downloadDocuments.value?.header,
            icon: 'bi-download',
            text: downloadDocuments.value?.body
        })
    }
}

async function onGetContent() {
    try {
        await contentStore.getContentsByCode([
            'COMMISSION_HOME_FIRST_BLOCK',
            'COMMISSION_HOME_SECOND_BLOCK',
            'COMMISSION_HOME_ACTION_MANAGE_PROJECTS',
            'COMMISSION_HOME_ACTION_MANAGE_ARCHIVE',
            'COMMISSION_HOME_ACTION_MANAGE_COMMISSIONS',
            'COMMISSION_HOME_ACTION_SUBMIT_PROJECT',
            'COMMISSION_HOME_ACTION_DOWNLOAD_DOCUMENTS'
        ])
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}

onMounted(async () => {
    loading.show()
    await onGetContent()
    initContents()
    initPageCards()
    loading.hide()
})

</script>

<template>
    <section>
        <LayoutImageText
            :img="CommissionImage1"
            :text="firstBlock?.body"
            :title="firstBlock?.header"
        />
        <LayoutTextImageColor
            :img="CommissionImage2"
            :text="secondBlock?.body"
            :title="secondBlock?.header"
            color="commission"
        />
        <LayoutPageCards
            v-if="pageCards.length"
            :page-cards="pageCards"
            color="commission"
        />
    </section>
</template>
