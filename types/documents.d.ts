export interface Document {
    id: number,
    name: string,
    acronym: string,
    description: string,
    contact: string,
    isMultiple: boolean,
    isRequiredInProcess: boolean,
    daysBeforeExpiration: string,
    expirationDay: string,
    pathTemplate: string | undefined,
    size: number,
    mimeTypes: MimeType[],
    processType: DocumentProcessType,
    institution: number | null,
    fund: number | null,
    editionDate: string
}

type MimeType =
    'application/pdf'
    | 'image/jpeg'
    | 'image/png'
    | 'application/vnd.oasis.opendocument.spreadsheet'
    | 'application/vnd.ms-excel'
    | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    | 'application/msword'
    | 'application/vnd.oasis.opendocument.text'
    | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    | 'application/x-7z-compressed'
    | 'application/x-bzip2'
    | 'application/x-rar-compressed'
    | 'application/x-tar'
    | 'application/zip'

type DocumentProcessType =
    'CHARTER_ASSOCIATION'
    | 'CHARTER_PROJECT_FUND'
    | 'DOCUMENT_ASSOCIATION'
    | 'DOCUMENT_USER'
    | 'DOCUMENT_PROJECT'
    | 'DOCUMENT_PROJECT_REVIEW'
    | 'NO_PROCESS'

export interface DocumentUpload {
    id?: number,
    uploadDate?: string,
    pathFile: string,
    size?: number,
    validatedDate: string,
    comment: string,
    document: number,
    user?: number | null,
    association?: number | null,
    project?: number | null,
    name?: string,
    calculatedExpirationDate?: string | null
}

export interface ProcessDocument {
    id?: number,
    acronym?: string,
    uploadDate?: string,
    pathFile: File | File[] | undefined | [],
    document?: number,
    description?: string,
    isMultiple?: boolean,
    isRequiredInProcess?: boolean,
    mimeTypes?: MimeType[],
    name?: string,
    pathTemplate?: string | undefined
}

export interface UploadedProcessDocument {
    id: number,
    document: number,
    pathFile: string | string[],
    name: string
}

export interface LibraryDocument {
    id: number,
    name: string,
    path: string | undefined,
    size: number,
    newName: string,
    file: undefined | File,
    processType: DocumentProcessType,
    mimeTypes: MimeType[],
    open: boolean,
    canUpdateDocument: boolean
}
