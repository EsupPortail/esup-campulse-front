<script lang="ts" setup>
import LayoutImageText from '@/components/layout/LayoutImageText.vue'
import LayoutTextImageColor from '@/components/layout/LayoutTextImageColor.vue'
import LayoutPageCards from '@/components/layout/LayoutPageCards.vue'
import type {Content, ContentCode, PageCard} from '#/index'
import useUserGroups from '@/composables/useUserGroups'
import {onMounted, ref} from 'vue'
import useSecurity from '@/composables/useSecurity'
import {useContentStore} from '@/stores/useContentStore'
import axios from 'axios'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'


const {isStaff} = useUserGroups()
const {hasPerm} = useSecurity()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const contentStore = useContentStore()

const firstBlock = ref<Content>()
const secondBlock = ref<Content>()
const validateCharters = ref<Content>()
const manageDocuments = ref<Content>()
const signCharters = ref<Content>()
const downloadDocuments = ref<Content>()


const pageCards = ref<PageCard[]>([])

function findContentObject(code: ContentCode) {
    return contentStore.contents.find(obj => obj.code === code)
}

const initContents = () => {
    firstBlock.value = findContentObject('CHARTER_HOME_FIRST_BLOCK')
    secondBlock.value = findContentObject('CHARTER_HOME_SECOND_BLOCK')
    validateCharters.value = findContentObject('CHARTER_HOME_ACTION_VALIDATE_CHARTERS')
    manageDocuments.value = findContentObject('CHARTER_HOME_ACTION_MANAGE_DOCUMENTS')
    signCharters.value = findContentObject('CHARTER_HOME_ACTION_SIGN_CHARTERS')
    downloadDocuments.value = findContentObject('CHARTER_HOME_ACTION_DOWNLOAD_DOCUMENTS')
}

const initPageCards = () => {
    if (isStaff.value) { // todo : ajouter bonne permission
        pageCards.value.push({
            to: {name: 'ManageCharters'},
            btnLabel: validateCharters.value?.header,
            icon: 'bi-pen',
            text: validateCharters.value?.body
        })
    }
    if (isStaff.value && (hasPerm('add_document'))) {
        pageCards.value.push({
            to: {name: 'ManageDocumentsLibrary'},
            btnLabel: manageDocuments.value?.header,
            icon: 'bi-file-earmark',
            text: manageDocuments.value?.body
        })
    }
    if (hasPerm('add_project_association')) {
        pageCards.value.push({
            to: {name: 'ManageCharters'},
            btnLabel: signCharters.value?.header,
            icon: 'bi-pen',
            text: signCharters.value?.body
        })
    }
    if (hasPerm('add_project_association') || hasPerm('add_project_user')) {
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
            'CHARTER_HOME_FIRST_BLOCK',
            'CHARTER_HOME_SECOND_BLOCK',
            'CHARTER_HOME_ACTION_VALIDATE_CHARTERS',
            'CHARTER_HOME_ACTION_MANAGE_DOCUMENTS',
            'CHARTER_HOME_ACTION_SIGN_CHARTERS',
            'CHARTER_HOME_ACTION_DOWNLOAD_DOCUMENTS'
        ])
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response.status)
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
            :text="firstBlock?.body"
            :title="firstBlock?.header"
            img="src/assets/img/charter-image-1.jpg"
        />
        <LayoutTextImageColor
            :text="secondBlock?.body"
            :title="secondBlock?.header"
            color="charter"
            img="src/assets/img/charter-image-2.jpg"
        />
        <LayoutPageCards
            v-if="pageCards.length"
            :page-cards="pageCards"
            color="charter"
        />
    </section>
</template>
