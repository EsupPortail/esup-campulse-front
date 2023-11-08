import type {DocumentProcessType, MimeType} from '#/documents'

export interface ManageCharter {
    associationId?: number | null,
    documentId: number,
    documentAcronym: string,
    documentProcessType: DocumentProcessType,
    documentUploadId?: number | null,
    documentName: string,
    pathTemplate: {
        name: string,
        path: string,
        documentId: number
    }[],
    pathFile?: string,
    validatedDate?: string,
    expirationDate?: string,
    charterStatus: CharterStatus,
    mimeTypes?: MimeType[]
}

export interface AssociationCharter {
    associationId: number,
    associationName: string,
    institution: string,
    isSite: boolean,
    charters: {
        charterId: number,
        charterName: string,
        charterStatus: CharterStatus
    }[]
}

export interface ProcessingCharter {
    associationId: number,
    associationName: string,
    institution: string,
    charterId: number,
    charterName: string,
    uploadedDate: string,
    charterStatus: CharterStatus
}

type CharterStatus = 'VALIDATED' | 'EXPIRED' | 'PROCESSING' | 'REJECTED' | 'RETURNED' | 'NO_CHARTER' | 'NOT_SITE'

type AssociationCharterStatus =
    'CHARTER_DRAFT'
    | 'CHARTER_REJECTED'
    | 'CHARTER_PROCESSING'
    | 'CHARTER_VALIDATED'
    | 'CHARTER_EXPIRED'
