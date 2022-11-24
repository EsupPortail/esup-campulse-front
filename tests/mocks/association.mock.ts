import type {Association} from '#/association'
import {groups} from "./user.mock";

export const association: Association = {
    id: 1,
    name: 'Association',
    username: 'association',
    acronym: null,
    pathLogo: null,
    description: null,
    activities: null,
    address: null,
    phone: null,
    email: null,
    siret: null,
    website: null,
    studentAmount: null,
    isEnabled: true,
    createdDate: null,
    approvalDate: null,
    lastGoaDate: null,
    cgaDate: null,
    idStatus: 2,
    idInstitution: 1,
    idComponent: 3,
    idField: 1
}

export const associations: Association[] = [association, association, association]

export const associationList = associations.map(
    association => ({
        value: association.id,
        label: association.name
    })
)