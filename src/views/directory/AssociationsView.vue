<script lang="ts" setup>
import {onMounted} from 'vue'
import {useQuasar} from 'quasar'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import FormAssociationSearch from '@/components/form/FormAssociationSearch.vue'
import {useRoute} from 'vue-router'
import {useContentStore} from '@/stores/useContentStore'
import LayoutImageText from '@/components/layout/LayoutImageText.vue'
import DirectoryImage from '@/assets/img/directory-image.jpg'
import AssociationListCard from '@/components/association/AssociationListCard.vue'
import AssociationListResults from '@/components/association/AssociationListResults.vue'
import AssociationListPagination from '@/components/association/AssociationListPagination.vue'
import {useDirectoryStore} from '@/stores/useDirectoryStore'

const directoryStore = useDirectoryStore()
const contentStore = useContentStore()
const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()
const route = useRoute()

onMounted(async function () {
    loading.show()
    await directoryStore.getDirectoryAssociations()
    await getContents()
    loading.hide()
})

// Scroll back to search fields on top of associations
function scrollToTop() {
    const searchFields = document.querySelector('#search-form') as HTMLElement
    searchFields.scrollIntoView()
    const element = document.querySelector('.directory-sorting + div a:first-child')
    if (element) (element as HTMLAnchorElement).focus()
}

async function getContents() {
    try {
        await contentStore.getContentsByCode(['ASSOCIATION_HOME_FIRST_BLOCK'])
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
}

</script>

<template>
    <section class="dashboard-section">
        <LayoutImageText
            :img="DirectoryImage"
            :text="contentStore.contents[0]?.body"
            :title="contentStore.contents[0]?.header"
        />
        <FormAssociationSearch
            v-if="route.name"
            :route="route.name"
        />
        <div class="dashboard-section-container">
            <div class="container">
                <AssociationListResults
                    :associations="directoryStore.directoryAssociations.length"
                    :associations-on-page="directoryStore.associationsOnPage.length"
                />
                <AssociationListCard
                    v-for="association in directoryStore.associationsOnPage"
                    :key="association.id"
                    :association
                />
                <div class="flex-row-center">
                    <AssociationListPagination @scroll-to-top="scrollToTop()"/>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
</style>
