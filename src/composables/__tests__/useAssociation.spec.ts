import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import {
    _association,
    _associationNames,
    _associationSocialNetworks,
    _editedAssociation,
    _nonEditedAssociation
} from '~/fixtures/association.mock'
import useAssociation from '@/composables/useAssociation'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {useAxios} from '@/composables/useAxios'
import {_associationRole} from '~/fixtures/user.mock'
import type {Association} from "../../../types/association";
import useUserAssociations from "../useUserAssociations";


vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

config.global.plugins = [
    createTestingPinia({createSpy: vi.fn()}),
]

describe('useAssociation', () => {
    let associationStore = useAssociationStore()
    beforeEach(() => {
        associationStore = useAssociationStore()
    })

    describe('altLogoText', () => {
        afterEach(() => {
            _association.altLogo = ''
        })

        const {altLogoText} = useAssociation()

        it('should return the alt of the logo if any', () => {
            _association.altLogo = 'alt'
            expect(altLogoText(_association)).toEqual('alt')
        })

        it('should return the default alt of the logo if no alt is given', () => {
            expect(altLogoText(_association)).toEqual('Logo de l\'association : Association')
        })
    })

    describe('createAssociation', () => {
        it('should call API only once on /associations/ with name as payload', async () => {
            const {createAssociation} = useAssociation()
            const newAssociation = {
                name: 'Association test',
                isSite: true,
                institution: 1
            }
            await createAssociation(newAssociation)
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.post).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.post).toHaveBeenCalledWith('/associations/', newAssociation)
        })
    })

    describe('checkHasPresident', () => {
        const {checkHasPresident} = useAssociation()
        const {newAssociations} = useUserAssociations()
        associationStore.associationNames = _associationNames

        afterEach(() => {
            newAssociations.value = []
        })

        it('should disable the association object if hasPresident is true', () => {
            checkHasPresident(_associationRole)
            const a = associationStore.associationNames.find(obj => obj.id === _associationRole.id)
            expect(_associationRole.options?.[0].disable).toEqual(a?.hasPresident)
        })

        /*it('should clear the association role if it is president', () => {
            newAssociations.value = JSON.parse(JSON.stringify([_associationRole]))
            checkHasPresident(_associationRole)
            const m = newAssociations.value.find(obj => obj.id === _associationRole.id)
            expect(m?.role).toEqual('isMember')
        })*/
    })

    describe('addNetwork', () => {
        const {addNetwork, associationSocialNetworks} = useAssociation()

        afterEach(() => {
            associationSocialNetworks.value = []
        })

        it('should push a new network object to associationSocialNetworks', () => {
            addNetwork()
            expect(associationSocialNetworks.value).toEqual([{type: '', location: ''}])
        })
    })

    describe('removeNetwork', () => {
        const {addNetwork, removeNetwork, associationSocialNetworks} = useAssociation()

        it('should remove a network from associationSocialNetworks based on network index', () => {
            addNetwork()
            removeNetwork(0)
            expect(associationSocialNetworks.value).toEqual([])
        })
    })

    describe('checkSocialNetworks', () => {
        const {associationSocialNetworks, checkSocialNetworks, changedData} = useAssociation()

        beforeEach(() => {
            associationStore.association = _association
            associationStore.association.socialNetworks = JSON.parse(JSON.stringify(_associationSocialNetworks))
        })

        afterEach(() => {
            associationStore.association = undefined
            associationSocialNetworks.value = []
        })

        describe('If old and new arrays have the same length', () => {

            it('if both arrays are the same, it should not push anything to changedData', () => {
                associationSocialNetworks.value = _associationSocialNetworks
                checkSocialNetworks()
                expect(changedData).toEqual({})
            })

            it('if arrays are not the same, f.e. type has changed', () => {
                associationSocialNetworks.value = JSON.parse(JSON.stringify(_associationSocialNetworks))
                associationSocialNetworks.value[0].type = 'Instagram'
                checkSocialNetworks()
                expect(changedData).toEqual({socialNetworks: associationSocialNetworks.value})
            })

            it('if arrays are not the same, f.e. location has changed', () => {
                associationSocialNetworks.value = JSON.parse(JSON.stringify(_associationSocialNetworks))
                associationSocialNetworks.value[0].location = 'https://piaile.fr'
                checkSocialNetworks()
                expect(changedData).toEqual({socialNetworks: associationSocialNetworks.value})
            })
        })

        describe('If old and new arrays have not the same length', () => {
            it('it should push all new networks to changedData', () => {
                associationSocialNetworks.value = _associationSocialNetworks.slice(1)
                checkSocialNetworks()
                expect(changedData).toEqual({socialNetworks: associationSocialNetworks.value})
            })
        })

        describe('If there are not already social networks', () => {
            it('should simply patch all new associations', () => {
                (associationStore.association as Association).socialNetworks = []
                associationSocialNetworks.value = _associationSocialNetworks
                checkSocialNetworks()
                expect(changedData).toEqual({socialNetworks: associationSocialNetworks.value})
            })
        })
    })

    describe('checkChanges', () => {
        const {associationSocialNetworks, checkChanges} = useAssociation()

        beforeEach(() => {
            associationStore.association = JSON.parse(JSON.stringify(_association))
        })

        afterEach(() => {
            associationSocialNetworks.value = []
        })

        it('should return changed infos', () => {
            associationSocialNetworks.value = [
                {
                    type: 'PeerTube',
                    location: 'https://peertube.fr'
                }
            ]
            expect(checkChanges(_editedAssociation)).toEqual({
                name: 'Association des étudiants en médecine',
                acronym: 'Asso',
                socialObject: 'Association des étudiants en médecine',
                currentProjects: 'Tutorat, sorties, randonnées et concerts',
                address: '1 rue de l\'hôpital',
                phone: '0102030405',
                email: 'asso-medecine@unistra.fr',
                siret: '0123456789',
                website: 'https://asso-medecine.fr',
                presidentNames: 'Jeanne Dupont',
                lastGoaDate: '2023-01-24T00:00:00.000Z',
                institution: 2,
                institutionComponent: 2,
                activityField: 2,
                socialNetworks: [
                    {
                        type: 'PeerTube',
                        location: 'https://peertube.fr'
                    }
                ]
            })
        })

        it('should return an empty object if no changed infos', () => {
            (associationStore.association as Association).socialNetworks = JSON.parse(JSON.stringify(_associationSocialNetworks))
            associationSocialNetworks.value = _associationSocialNetworks
            expect(checkChanges(_nonEditedAssociation)).toEqual({})
        })
    })

    describe('updateAssociation', () => {
        const {updateAssociation} = useAssociation()
        const {axiosAuthenticated} = useAxios()

        it('should call API once on /associations/id to patch changedData', async () => {
            associationStore.association = _association
            await updateAssociation()
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(`/associations/${associationStore.association.id}`, {})
        })
    })
})
