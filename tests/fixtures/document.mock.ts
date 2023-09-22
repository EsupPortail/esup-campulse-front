import type {Document, DocumentUpload, ProcessDocument} from '#/documents'
import {_chartersExpirationDay} from '~/fixtures/dates.mock'

export const _document: Document = {
    id: 1,
    name: 'Charte Site Alsace',
    acronym: 'CHARTE_SITE_ALSACE',
    description: 'Charte signée par le président d\'une association Site Alsace',
    contact: 'https://svu.unistra.fr/vie-des-campus/vie-universitaire/soutien-aux-associations-etudiantes/agrement-association-etudiante-du-site-alsace',
    isMultiple: false,
    isRequiredInProcess: false,
    daysBeforeExpiration: '365 00:00:00',
    expirationDay: '',
    editionDate: '',
    pathTemplate: undefined,
    size: 0,
    mimeTypes: [
        'application/pdf'
    ],
    processType: 'CHARTER_ASSOCIATION',
    institution: null,
    fund: null
}

export const _documents: Document[] = [
    {
        id: 1,
        name: 'Charte Site Alsace',
        acronym: 'CHARTE_SITE_ALSACE',
        description: 'Charte signée par le président d\'une association Site Alsace',
        contact: 'https://svu.unistra.fr/vie-des-campus/vie-universitaire/soutien-aux-associations-etudiantes/agrement-association-etudiante-du-site-alsace',
        isMultiple: false,
        isRequiredInProcess: false,
        daysBeforeExpiration: '365',
        expirationDay: '',
        editionDate: '2023-06-02',
        pathTemplate: undefined,
        size: 0,
        mimeTypes: [
            'application/pdf'
        ],
        processType: 'CHARTER_ASSOCIATION',
        institution: null,
        fund: null
    },
    {
        id: 2,
        name: 'RGPD Site Alsace',
        acronym: 'RGPD_SITE_ALSACE',
        description: 'Charte RGPD signée par le président d\'une association Site Alsace',
        contact: 'https://svu.unistra.fr/vie-des-campus/vie-universitaire/soutien-aux-associations-etudiantes/agrement-association-etudiante-du-site-alsace',
        isMultiple: false,
        isRequiredInProcess: false,
        daysBeforeExpiration: '365',
        expirationDay: '',
        editionDate: '2023-06-02',
        pathTemplate: undefined,
        size: 0,
        mimeTypes: [
            'application/pdf'
        ],
        processType: 'CHARTER_ASSOCIATION',
        institution: null,
        fund: null
    },
    {
        id: 3,
        name: 'Charte FSDIE',
        acronym: 'CHARTE_FSDIE',
        description: 'Charte Fonds de Solidarité et de Développement des Initiatives Étudiantes',
        contact: 'https://svu.unistra.fr/vie-des-campus/vie-universitaire/soutien-aux-associations-etudiantes/agrement-association-etudiante-du-site-alsace',
        isMultiple: false,
        isRequiredInProcess: false,
        daysBeforeExpiration: '',
        expirationDay: _chartersExpirationDay,
        editionDate: '2023-06-02',
        pathTemplate: undefined,
        size: 0,
        mimeTypes: [
            'application/pdf'
        ],
        processType: 'CHARTER_PROJECT_FUND',
        institution: null,
        fund: 1
    }
]

export const _processDocuments: ProcessDocument[] = [
    {
        id: 1,
        document: 1,
        isMultiple: true,
        description: 'Document 1',
        pathFile: [new File([], 'file1'), new File([], 'file2')],
        isRequiredInProcess: false,
        mimeTypes: [
            'application/pdf'
        ]
    },
    {
        id: 2,
        document: 2,
        isMultiple: false,
        description: 'Document 2',
        pathFile: new File([], 'file'),
        isRequiredInProcess: true,
        mimeTypes: [
            'application/pdf'
        ]
    }
]

export const _uploadedProcessDocuments = [
    {
        id: 1,
        document: 1,
        pathFile: 'File 1',
        name: 'File 1'
    },
    {
        id: 2,
        document: 2,
        pathFile: 'File 2',
        name: 'File 2'
    }
]

export const _projectDocuments: DocumentUpload[] = [
    {
        id: 1,
        uploadDate: '2023-06-19',
        validatedDate: '',
        comment: '',
        pathFile: 'pathFile',
        size: 1000,
        document: 1,
        user: null,
        association: 1,
        project: 1,
        name: 'documentName'
    },
    {
        id: 2,
        uploadDate: '2023-06-21',
        pathFile: 'pathFile',
        size: 1000,
        validatedDate: '',
        comment: '',
        document: 2,
        user: 1,
        association: null,
        project: 2,
        name: 'documentName'
    }
]
