export interface ManageCharter {
    associationId?: number | null,
    documentId: number,
    documentUploadId?: number | null,
    documentName: string,
    pathTemplate: string | null | undefined,
    pathFile?: string,
    validatedDate?: string,
    expirationDate?: string,
    charterStatus: CharterStatus
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

type CharterStatus = 'VALIDATED' | 'EXPIRED' | 'PROCESSING' | 'NO_CHARTER' | 'NOT_SITE'
