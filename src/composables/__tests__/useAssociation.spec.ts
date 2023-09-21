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
import useUserAssociations from '@/composables/useUserAssociations'
import type {Association} from '#/association'


vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

config.global.plugins = [
    createTestingPinia({createSpy: vi.fn()}),
]
let associationStore = useAssociationStore()

describe('useAssociation', () => {
    beforeEach(() => {
        associationStore = useAssociationStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    const {axiosAuthenticated} = useAxios()
    const {newAssociations} = useUserAssociations()
    const {
        createAssociation,
        checkHasPresident,
        addNetwork,
        associationSocialNetworks,
        removeNetwork,
        checkSocialNetworks,
        changedData,
        checkChanges,
        updateAssociation,
        changeAssociationLogo
    } = useAssociation()


    describe('createAssociation', () => {
        it('should call API only once on /associations/ with name as payload', async () => {
            const newAssociation = {
                name: 'Association test',
                email: 'asso-test@test.tld',
                isSite: true,
                institution: 1
            }
            await createAssociation(newAssociation)
            expect(axiosAuthenticated.post).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.post).toHaveBeenCalledWith('/associations/', newAssociation)
        })
    })

    describe('checkHasPresident', () => {
        beforeEach(() => {
            associationStore.associationNames = _associationNames
            newAssociations.value = [_associationRole]
        })

        afterEach(() => {
            newAssociations.value = []
        })

        it('should disable the association object if hasPresident is true', () => {
            checkHasPresident(newAssociations.value[0])
            expect(newAssociations.value[0].role).toEqual('isMember')
        })

        it('should not disable the association object if hasPresident is false', () => {
            newAssociations.value[0].role = 'isSecretary'
            checkHasPresident(newAssociations.value[0])
            expect(newAssociations.value[0].role).toEqual('isSecretary')
        })
    })

    describe('addNetwork', () => {
        afterEach(() => {
            associationSocialNetworks.value = []
        })

        it('should push a new network object to associationSocialNetworks', () => {
            addNetwork()
            expect(associationSocialNetworks.value).toEqual([{type: '', location: ''}])
        })
    })

    describe('removeNetwork', () => {
        it('should remove a network from associationSocialNetworks based on network index', () => {
            addNetwork()
            removeNetwork(0)
            expect(associationSocialNetworks.value).toEqual([])
        })
    })

    describe('checkSocialNetworks', () => {
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
                lastGoaDate: '2023-01-24',
                institution: 2,
                institutionComponent: 2,
                activityField: 2,
                amountMembersAllowed: 5,
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
        it('should call API once on /associations/id to patch changedData', async () => {
            associationStore.association = _association
            await updateAssociation()
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(`/associations/${associationStore.association.id}`, {})
        })
    })

    describe('changeAssociationLogo', () => {
        associationStore.association = _association

        describe('if deleteLogoData is null', () => {
            it('should upload a new logo', async () => {
                const spy = vi.spyOn(associationStore, 'updateAssociationLogo')
                const newLogo = new Blob
                const deleteLogoData = null
                const patchLogoData = new FormData()
                patchLogoData.append('pathLogo', newLogo)
                await changeAssociationLogo(newLogo, deleteLogoData)
                expect(spy).toHaveBeenCalledOnce()
                expect(spy).toHaveBeenCalledWith(patchLogoData, _association.id)
            })
        })

        describe('if deleteLogoData is not null', () => {
            it('should upload a blank logo', async () => {
                const spy = vi.spyOn(associationStore, 'updateAssociationLogo')
                const newLogo = undefined
                const deleteLogoData = {}
                await changeAssociationLogo(newLogo, deleteLogoData)
                expect(spy).toHaveBeenCalledOnce()
                expect(spy).toHaveBeenCalledWith(deleteLogoData, _association.id)
            })
        })
    })
})
