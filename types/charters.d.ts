export interface ManageCharter {
    associationId?: number | null,
    documentId: number,
    documentUploadId?: number | null,
    documentName: string,
    pathTemplate: string | null,
    pathFile?: string,
    validatedDate?: string,
    expirationDate?: string,
    charterStatus: CharterStatus
}

export interface AssociationCharter {
    associationId: number,
    associationName: string,
    associationInstitution: string,
    isSite: boolean,
    charterStatus: CharterStatus
}

export interface ChartersToManage {
    associationId: number,
    associationName: string,
    associationInstitution: string,
    charterId: number,
    charterName: string,
    uploadedDate: string,
    charterStatus: CharterStatus
}

type CharterStatus = 'VALIDATED' | 'EXPIRED' | 'PROCESSING' | 'NO_CHARTER' | 'NOT_SITE'