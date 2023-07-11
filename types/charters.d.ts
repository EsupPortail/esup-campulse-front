export interface ManageCharter {
    documentId: number,
    documentAcronym: string,
    documentUploadId?: number | null,
    documentName: string,
    pathTemplate: string | null,
    pathFile?: string,
    validatedDate?: string,
    expirationDate?: string,
    charterStatus: CharterStatus
}

type CharterStatus = 'VALIDATED' | 'EXPIRED' | 'PROCESSING' | 'NO_CHARTER'