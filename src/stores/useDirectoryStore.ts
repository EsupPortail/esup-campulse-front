import {defineStore} from 'pinia'
import {ref, watch} from 'vue'
import type {Association} from '#/association'
import {useAxios} from '@/composables/useAxios'

export const useDirectoryStore = defineStore('directory', () => {

    const directoryAssociations = ref<Association[]>([])

    async function getDirectoryAssociations() {
        const {axiosPublic} = useAxios()
        const url = '/associations/?is_public=true'
        directoryAssociations.value = (await axiosPublic.get<Association[]>(url)).data
    }

    ////////////////
    // PAGINATION //
    ////////////////

    const associationsPerPage: number = 15
    const currentPage = ref<number>(1)
    const pages = ref(Math.ceil(directoryAssociations.value.length / associationsPerPage))
    const startIndex = ref<number>(0)
    const endIndex = ref(directoryAssociations.value.length % associationsPerPage != 0 && currentPage.value === pages.value ?
        directoryAssociations.value.length : currentPage.value * associationsPerPage)
    const associationsOnPage = ref<Association[]>([...directoryAssociations.value.slice(startIndex.value, endIndex.value)])

    watch(() => currentPage.value, () => {
        startIndex.value = associationsPerPage * (currentPage.value - 1)
    })

    watch(() => directoryAssociations.value.length, () => {
        pages.value = Math.ceil(directoryAssociations.value.length / associationsPerPage)
    })

    watch(() => currentPage.value, () => {
        endIndex.value = directoryAssociations.value.length % associationsPerPage != 0 && currentPage.value === pages.value ?
            directoryAssociations.value.length : currentPage.value * associationsPerPage
    })
    watch(() => directoryAssociations.value.length, () => {
        endIndex.value = directoryAssociations.value.length % associationsPerPage != 0 && currentPage.value === pages.value ?
            directoryAssociations.value.length : currentPage.value * associationsPerPage
    })
    watch(() => pages.value, () => {
        endIndex.value = directoryAssociations.value.length % associationsPerPage != 0 && currentPage.value === pages.value ?
            directoryAssociations.value.length : currentPage.value * associationsPerPage
    })

    watch(() => directoryAssociations.value.length, () => {
        associationsOnPage.value = directoryAssociations.value.slice(startIndex.value, endIndex.value)
    })
    watch(() => startIndex.value, () => {
        associationsOnPage.value = directoryAssociations.value.slice(startIndex.value, endIndex.value)
    })
    watch(() => endIndex.value, () => {
        associationsOnPage.value = directoryAssociations.value.slice(startIndex.value, endIndex.value)
    })

    return {
        directoryAssociations,
        associationsOnPage,
        getDirectoryAssociations,
        associationsPerPage,
        currentPage,
        startIndex,
        pages,
        endIndex
    }
})
