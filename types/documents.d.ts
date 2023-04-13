export interface Document {
    id: number,
    name: string,
    acronym: string,
    description: string,
    contact: string,
    isMultiple: boolean,
    isRequiredInProcess: boolean,
    daysBeforeExpiration: string,
    pathTemplate: null, // ??
    mimeTypes: MimeType[],
    processType: DocumentProcessType,
    institution: number | null,
    commission: number | null,
}

type MimeType =
    'application/pdf'
    | 'image/jpeg'
    | 'image/png'
    | 'application/vnd.oasis.opendocument.spreadsheet'
    | 'application/vnd.ms-excel'
    | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

type DocumentProcessType =
    'CHARTER_ASSOCIATION'
    | 'CHARTER_ASSOCIATION_INSTITUTION'
    | 'CHARTER_PROJECT_COMMISSION'
    | 'DOCUMENT_ASSOCIATION'
    | 'DOCUMENT_USER'
    | 'DOCUMENT_PROJECT'
    | 'DOCUMENT_PROJECT_REVIEW'
    | 'DOCUMENT_PROCESSING'

export interface ProjectDocument {
    id?: number,
    uploadDate?: string,
    pathFile: string,
    documentUploadStatus?: DocumentUploadStatus,
    document: number,
    user?: number | null,
    association?: number | null,
    project?: number
}

export interface ProcessDocument {
    id?: number,
    uploadDate?: string,
    pathFile: Blob | Blob[] | undefined | [] | string,
    documentUploadStatus?: DocumentUploadStatus,
    document?: number,
    label: string,
    isMultiple?: boolean,
    isRequiredInProcess?: boolean,
    mimeTypes?: MimeType[],
}

type DocumentUploadStatus = 'DOCUMENT_REJECTED' | 'DOCUMENT_PROCESSING' | 'DOCUMENT_VALIDATED'