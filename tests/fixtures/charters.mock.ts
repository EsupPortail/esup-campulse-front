import type {AssociationCharter, ManageCharter} from '#/charters'
import {_chartersExpirationDate, _currentYear, _todayDate} from './dates.mock'


export const _associationCharter: ManageCharter = {
    associationId: 1,
    documentId: 1,
    documentAcronym: 'CHARTE_SITE_ALSACE',
    documentProcessType: 'CHARTER_ASSOCIATION',
    documentUploadId: 1,
    documentName: 'Charte Site Alsace + RGPD Site Alsace',
    pathTemplate: [
        {
            name: 'Charte Site Alsace',
            path: '',
            documentId: 1
        },
        {
            name: 'RGPD Site Alsace',
            path: '',
            documentId: 2
        }
    ],
    pathFile: 'https://campulse.unistra.fr',
    validatedDate: '01/01/2023',
    expirationDate: '01/01/2024',
    charterStatus: 'VALIDATED'
}

const _validatedCharter: ManageCharter = {
    associationId: 1,
    documentId: 3,
    documentAcronym: 'CHARTE_FSDIE',
    documentProcessType: 'CHARTER_PROJECT_FUND',
    documentUploadId: 3,
    documentName: 'Charte FSDIE',
    pathTemplate: [{
        name: 'Charte FSDIE',
        path: '',
        documentId: 3
    }],
    pathFile: 'https://campulse.unistra.fr',
    validatedDate: ['01', '01', _currentYear].join('/'),
    expirationDate: ['31', '08', _currentYear].join('/'),
    charterStatus: 'VALIDATED',
    mimeTypes: [
        'application/pdf'
    ],
}

const _expiredCharter: ManageCharter = {
    associationId: 1,
    documentId: 3,
    documentAcronym: 'CHARTE_FSDIE',
    documentProcessType: 'CHARTER_PROJECT_FUND',
    documentUploadId: 3,
    documentName: 'Charte FSDIE',
    pathTemplate: [{
        name: 'Charte FSDIE',
        path: '',
        documentId: 3
    }],
    pathFile: 'https://campulse.unistra.fr',
    validatedDate: ['01', '01', _currentYear].join('/'),
    expirationDate: ['31', '08', _currentYear].join('/'),
    charterStatus: 'EXPIRED',
    mimeTypes: [
        'application/pdf'
    ],
}

const _projectFundCharter: ManageCharter = _chartersExpirationDate >= _todayDate ? _validatedCharter : _expiredCharter

export const _manageCharters: ManageCharter[] = [
    _projectFundCharter,
    _associationCharter
]

export const _associationCharters: AssociationCharter[] = [
    {
        associationId: 2,
        associationName: 'Amicale des étudiants en Chimie',
        institution: 'UHA',
        isSite: true,
        charters: [
            {
                charterId: 1,
                charterName: 'Charte Site Alsace + RGPD Site Alsace',
                charterStatus: 'NO_CHARTER'
            }
        ]
    }
]

export const _projectFundCharters: AssociationCharter[] = [
    {
        associationId: 1,
        associationName: 'Association',
        institution: 'Unistra',
        isSite: false,
        charters: [
            {
                charterId: 3,
                charterName: 'Charte FSDIE',
                charterStatus: 'EXPIRED'
            }
        ]
    },
    {
        associationId: 2,
        associationName: 'Amicale des étudiants en Chimie',
        institution: 'UHA',
        isSite: true,
        charters: [
            {
                charterId: 3,
                charterName: 'Charte FSDIE',
                charterStatus: 'NO_CHARTER'
            }
        ]
    }
]




