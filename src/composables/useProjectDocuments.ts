import {ref} from 'vue'
import type {Document, ProjectDocument} from '#/documents'
import {useAxios} from '@/composables/useAxios'
import {useProjectStore} from '@/stores/useProjectStore'

const documentTypes = ref<Document[]>([])

const projectDocuments = ref<ProjectDocument[]>([])

export default function () {

    const {axiosPublic} = useAxios()
    const projectStore = useProjectStore()

    // REQUIRED DOCUMENTS PER PROCESS
    const initProjectDocuments = (process: 'DOCUMENT_PROJECT') => {
        projectDocuments.value = []
        const documents = documentTypes.value.filter(obj => obj.processType === process)
        documents.forEach((doc) => {
            projectDocuments.value.push({
                document: doc.id,
                isMultiple: doc.isMultiple,
                label: doc.description,
                pathFile: '',
                required: false
            })
        })
    }


    // GETS
    async function getDocumentTypes() {
        if (!documentTypes.value?.length) {
            documentTypes.value = (await axiosPublic.get<Document[]>('/documents/')).data
        }
    }


    return {
        getDocumentTypes,
        documentTypes,
        projectDocuments,
        newAssociationProjectDocuments
    }
}
