import {createTestingPinia} from '@pinia/testing'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import {mockedAxios} from '~/mocks/axios.mock'
import {association, editedAssociation, mockedAssociationSocialNetworks} from '~/mocks/association.mock'
import useAssociation from '@/composables/useAssociation'
import {useAssociationStore} from '@/stores/useAssociationStore'

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
            expect(mockedAxios.post).toHaveBeenCalledOnce()
            expect(mockedAxios.post).toHaveBeenCalledWith('/associations/', {name: 'Association test'})
        })
    })

    describe('checkSocialNetworks', () => {
        beforeEach(() => {
            associationStore.association = association
            associationStore.association.socialNetworks = JSON.parse(JSON.stringify(mockedAssociationSocialNetworks))
        })
        describe('If old and new arrays have the same length', () => {
            it('if both arrays are the same, it should not push anything to changedData', () => {
                const {associationSocialNetworks, checkSocialNetworks, changedData} = useAssociation()
                associationSocialNetworks.value = mockedAssociationSocialNetworks
                checkSocialNetworks()
                expect(changedData).toEqual({})
            })
            it('if arrays are not the same, f.e. type has changed', () => {
                const {associationSocialNetworks, checkSocialNetworks, changedData} = useAssociation()
                associationSocialNetworks.value = mockedAssociationSocialNetworks
                associationSocialNetworks.value[0].type = 'Instagram'
                associationSocialNetworks.value[0].location = 'https://instagram.com'
                checkSocialNetworks()
                console.log(associationStore.association?.socialNetworks)
                expect(changedData).toEqual({socialNetworks: associationSocialNetworks.value})
            })
        })
        describe('If old and new arrays have not the same length', () => {
            it('it should push all new networks to changedData', () => {
                const {associationSocialNetworks, checkSocialNetworks, changedData} = useAssociation()
                associationSocialNetworks.value = mockedAssociationSocialNetworks.slice(1)
                checkSocialNetworks()
                expect(changedData).toEqual({socialNetworks: associationSocialNetworks.value})
            })
        })
    })

    describe('checkChanges', () => {
        beforeEach(() => {
            const {associationSocialNetworks} = useAssociation()
            associationStore.association = JSON.parse(JSON.stringify(association))
            associationSocialNetworks.value = [
                {
                    type: 'Mastodon',
                    location: 'https://mastodon.social'
                }
            ]
        })
        it('should return changed infos', () => {
            const {checkChanges} = useAssociation()
            expect(checkChanges(editedAssociation)).toEqual({
                activityField: 2,
                name: 'Association des étudiants en médecine',
                acronym: 'Asso',
                description: 'Association des étudiants en médecine',
                activities: 'Tutorat, sorties, randonnées et concerts',
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
            //
        })
    })
})
