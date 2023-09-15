import {ref} from 'vue'
import type {Document, MimeType} from '#/documents'
import {useAxios} from '@/composables/useAxios'


const documents = ref<Document[]>([])

export default function () {

    const {axiosPublic, axiosAuthenticated} = useAxios()

    const libraryProcesses = ['CHARTER_ASSOCIATION', 'CHARTER_ASSOCIATION_INSTITUTION', 'CHARTER_PROJECT_FUND', 'DOCUMENT_PROJECT', 'NO_PROCESS']

    const mimeTypesLabels = [
        {
            value: 'application/pdf',
            label: '.pdf'
        },
        {
            value: 'image/jpeg',
            label: '.jpg/.jpeg'
        },
        {
            value: 'image/png',
            label: '.png'
        },
        {
            value: 'application/msword',
            label: '.doc'
        },
        {
            value: 'application/vnd.oasis.opendocument.text',
            label: '.odt'
        },
        {
            value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            label: '.docx'
        },
        {
            value: 'application/vnd.ms-excel',
            label: '.xls'
        },
        {
            value: 'application/vnd.oasis.opendocument.spreadsheet',
            label: '.ods'
        },
        {
            value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            label: '.xlsx'
        },
        {
            value: 'application/x-7z-compressed',
            label: '.7z'
        },
        {
            value: 'application/x-bzip2',
            label: '.bz2'
        },
        {
            value: 'application/x-rar-compressed',
            label: '.rar'
        },
        {
            value: 'application/x-tar',
            label: '.tar'
        },
        {
            value: 'application/zip',
            label: '.zip'
        }
    ]

    const acceptedFormats = (mimeTypes: MimeType[]) => {
        return mimeTypes.map(mimeType => mimeTypesLabels.find(obj => obj.value === mimeType)?.label ?? '').join(', ')
    }

    async function getLibraryDocuments() {
        documents.value = (await axiosPublic.get<Document[]>(`/documents/?process_types=${libraryProcesses.join(',')}`)).data
    }

    async function getDocumentByAcronym(acronym: string) {
        documents.value = (await axiosPublic.get<Document[]>(`/documents/?acronym=${acronym}`)).data
    }

    async function postNewDocument(name: string, file: Blob) {
        const newDocument = new FormData()
        newDocument.append('name', name)
        newDocument.append('pathTemplate', file)
        await axiosAuthenticated.post('/documents/', newDocument)
    }

    async function patchDocument(id: number, name: string, file: Blob) {
        const newDocument = new FormData()
        newDocument.append('name', name)
        newDocument.append('pathTemplate', file)
        await axiosAuthenticated.patch(`/documents/${id}`, newDocument)
    }

    async function deleteDocument(id: number) {
        await axiosAuthenticated.delete(`/documents/${id}`)
    }

    function createFileLink(pathFile: string, name: string) {
        const anchor = document.createElement('a')
        anchor.href = pathFile
        anchor.download = name
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)
    }

    return {
        getLibraryDocuments,
        documents,
        postNewDocument,
        patchDocument,
        deleteDocument,
        libraryProcesses,
        getDocumentByAcronym,
        createFileLink,
        mimeTypesLabels,
        acceptedFormats
    }
}
