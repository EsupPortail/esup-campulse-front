import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import {
    _association,
    _associationSocialNetworks,
    _editedAssociation,
    _nonEditedAssociation
} from '~/fixtures/association.mock'
import useAssociation from '@/composables/useAssociation'
import {useAssociationStore} from '@/stores/useAssociationStore'
import type {Association} from '#/association'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {useAxios} from '@/composables/useAxios'


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
    describe('createAssociation', () => {
        it('should call API only once on /associations/ with name as payload', async () => {
            const {createAssociation} = useAssociation()
            await createAssociation('Association test')
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.post).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.post).toHaveBeenCalledWith('/associations/', {name: 'Association test'})
        })
    })
    describe('checkSocialNetworks', () => {
        beforeEach(() => {
            associationStore.association = _association
            associationStore.association.socialNetworks = JSON.parse(JSON.stringify(_associationSocialNetworks))
        })
        afterEach(() => {
            (associationStore.association as Association).socialNetworks = []
        })
        describe('If old and new arrays have the same length', () => {
            it('if both arrays are the same, it should not push anything to changedData', () => {
                const {associationSocialNetworks, checkSocialNetworks, changedData} = useAssociation()
                associationSocialNetworks.value = _associationSocialNetworks
                checkSocialNetworks()
                expect(changedData).toEqual({})
            })
            it('if arrays are not the same, f.e. type has changed', () => {
                const {associationSocialNetworks, checkSocialNetworks, changedData} = useAssociation()
                associationSocialNetworks.value = _associationSocialNetworks
                associationSocialNetworks.value[0].type = 'Instagram'
                associationSocialNetworks.value[0].location = 'https://instagram.com'
                checkSocialNetworks()
                expect(changedData).toEqual({socialNetworks: associationSocialNetworks.value})
            })
        })
        describe('If old and new arrays have not the same length', () => {
            it('it should push all new networks to changedData', () => {
                const {associationSocialNetworks, checkSocialNetworks, changedData} = useAssociation()
                associationSocialNetworks.value = _associationSocialNetworks.slice(1)
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
            const {associationSocialNetworks} = useAssociation()
            associationSocialNetworks.value = []
        })
        it('should return changed infos', () => {
            const {checkChanges, associationSocialNetworks} = useAssociation()
            associationSocialNetworks.value = [
                {
                    type: 'Mastodon',
                    location: 'https://mastodon.social'
                }
            ]
            expect(checkChanges(_editedAssociation)).toEqual({
                activityField: 2,
                name: 'Association des étudiants en médecine',
                acronym: 'Asso',
                socialObject: 'Association des étudiants en médecine',
                currentProject: 'Tutorat, sorties, randonnées et concerts',
                address: '1 rue de l\'hôpital',
                phone: '0102030405',
                email: 'asso-medecine@unistra.fr',
                siret: '0123456789',
                website: 'https://asso-medecine.fr',
                presidentNames: 'Jeanne Dupont',
                lastGoaDate: '2023-01-24T00:00:00.000Z',
                socialNetworks: [
                    {
                        type: 'Mastodon',
                        location: 'https://mastodon.social'
                    }
                ]
            })
        })
        it('should return an empty object if no changed infos', () => {
            const {checkChanges} = useAssociation()
            expect(checkChanges(_nonEditedAssociation)).toEqual({})
        })
    })
    describe('updateAssociation', () => {
        it('should call API once on /associations/id to patch changedData', () => {
            associationStore.association = _association
            const {updateAssociation} = useAssociation()
            const {axiosAuthenticated} = useAxios()
            updateAssociation()
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(`/associations/${associationStore.association.id}`, {})
        })
    })
})
