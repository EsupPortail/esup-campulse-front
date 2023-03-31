import {createPinia, setActivePinia} from 'pinia'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useUserStore} from '@/stores/useUserStore'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {
    _activityFieldLabels,
    _activityFields,
    _association,
    _associationLabels,
    _associationNames,
    _associations,
    _institutionComponentLabels,
    _institutionComponents,
    _institutionLabels,
    _institutions
} from '~/fixtures/association.mock'
import {useAxios} from '@/composables/useAxios'
import type {AxiosResponse} from 'axios'
import {_generalManager, _institutionManager, _institutionStudent} from '~/fixtures/user.mock'
import useUserGroups from '../../composables/useUserGroups'
import {_groups} from '../../../tests/fixtures/group.mock'


vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

setActivePinia(createPinia())
let associationStore = useAssociationStore()
const userStore = useUserStore()

describe('Association store', () => {
    const {groups, isStaff} = useUserGroups()

    beforeEach(() => {
        associationStore = useAssociationStore()
        groups.value = _groups
    })
    afterEach(() => {
        associationStore.associations = []
        associationStore.association = undefined
        associationStore.institutions = []
        associationStore.institutionComponents = []
        associationStore.activityFields = []
        associationStore.associationNames = []
        userStore.user = undefined
        vi.restoreAllMocks()
    })

    describe('associationLabels', () => {
        it('should return an array of objects based on associationNames', () => {
            associationStore.associationNames = _associationNames
            expect(associationStore.associationLabels).toEqual(_associationLabels)
        })
    })

    describe('institutionLabels', () => {
        it('should return an array of value and labels based on institutions', () => {
            associationStore.institutions = _institutions
            expect(associationStore.institutionLabels).toEqual(_institutionLabels)
        })
    })

    describe('institutionComponentLabels', () => {
        it('should return an array of value and labels based on components', () => {
            associationStore.institutionComponents = _institutionComponents
            expect(associationStore.institutionComponentLabels).toEqual(_institutionComponentLabels)
        })
    })

    describe('activityFieldLabels', () => {
        it('should return an array of value and labels based on activity fields', () => {
            associationStore.activityFields = _activityFields
            expect(associationStore.activityFieldLabels).toEqual(_activityFieldLabels)
        })
    })

    describe('getAssociations', () => {
        afterEach(() => {
            associationStore.associations = []
        })

        const {axiosPublic, axiosAuthenticated} = useAxios()
        const mockedPublicAxios = vi.mocked(axiosPublic, true)
        const mockedAuthAxios = vi.mocked(axiosAuthenticated, true)

        it('should get only public associations if isPublic is true', async () => {
            mockedPublicAxios.get.mockResolvedValueOnce({data: _associations} as AxiosResponse)
            await associationStore.getAssociations(true)
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith('/associations/?is_public=true')
            expect(associationStore.associations).toEqual(_associations)
        })

        it('should get all associations with auth instance if isPublic is false', async () => {
            mockedAuthAxios.get.mockResolvedValueOnce({data: _associations} as AxiosResponse)
            await associationStore.getAssociations(false)
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/associations/')
            expect(associationStore.associations).toEqual(_associations)
        })

    })

    describe('getInstitutionAssociations', () => {
        it('should get associations linked to a list of institution IDs', async () => {
            const {axiosAuthenticated} = useAxios()
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.get.mockResolvedValueOnce({data: _associations} as AxiosResponse)
            userStore.user = _institutionManager
            const institutions = userStore.userInstitutions?.join(',')
            await associationStore.getInstitutionAssociations()
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith(`/associations/?institutions=${institutions}`)
            expect(associationStore.associations).toEqual(_associations)
        })
    })

    describe('getAssociationNames', () => {
        const {axiosPublic} = useAxios()
        const mockedAxios = vi.mocked(axiosPublic, true)

        afterEach(() => {
            associationStore.associationNames = []
            userStore.user = undefined
        })

        it('should get all association names if isPublic is false and the user is not managing associations', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: _associationNames} as AxiosResponse)
            isStaff.value = false
            await associationStore.getAssociationNames(false)
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith('/associations/names')
            expect(associationStore.associationNames).toEqual(_associationNames)
        })

        it('should get only public association names if isPublic is true', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: _associationNames} as AxiosResponse)
            await associationStore.getAssociationNames(true)
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith('/associations/names?is_public=true')
            expect(associationStore.associationNames).toEqual(_associationNames)
        })

        it('should only get association names linked to the institutions of a staff member', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: _associationNames} as AxiosResponse)
            userStore.user = _institutionManager
            isStaff.value = true
            const institutions = userStore.userInstitutions?.join(',')
            await associationStore.getAssociationNames(false)
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith(`/associations/names?institutions=${institutions}`)
            expect(associationStore.associationNames).toEqual(_associationNames)
        })
    })

    describe('getManagedAssociations', () => {
        const {axiosAuthenticated} = useAxios()
        const mockedAxios = vi.mocked(axiosAuthenticated, true)

        const spies = {
            getAssociations: vi.spyOn(associationStore, 'getAssociations'),
            getInstitutionAssociations: vi.spyOn(associationStore, 'getInstitutionAssociations')
        }

        afterEach(() => {
            userStore.user = undefined
        })

        describe('if student member of associations', () => {
            it('should get all associations the user is a member of', async () => {
                userStore.user = _institutionStudent
                mockedAxios.get.mockResolvedValueOnce({data: _association} as AxiosResponse)
                await associationStore.getManagedAssociations()
                expect(axiosAuthenticated.get).toHaveBeenCalledTimes(userStore.user?.associations.length as number)
                expect(axiosAuthenticated.get).toHaveBeenLastCalledWith(
                    `/associations/${userStore.user?.associations[userStore.user?.associations.length - 1].id}`
                )
            })
        })

        describe('if general manager', () => {
            it('should get all associations', async () => {
                userStore.user = _generalManager
                isStaff.value = true
                mockedAxios.get.mockResolvedValueOnce({data: _associations} as AxiosResponse)
                await associationStore.getManagedAssociations()
                expect(spies.getAssociations).toHaveBeenCalledOnce()
            })
        })

        describe('if institution manager', () => {
            it('should get all associations linked to the associations of a manager', async () => {
                userStore.user = _institutionManager
                isStaff.value = true
                mockedAxios.get.mockResolvedValueOnce({data: _associations} as AxiosResponse)
                await associationStore.getManagedAssociations()
                expect(spies.getInstitutionAssociations).toHaveBeenCalledOnce()
            })
        })
    })

    describe('getAssociationDetail', () => {
        afterEach(() => {
            associationStore.association = undefined
        })

        const {axiosPublic, axiosAuthenticated} = useAxios()
        const mockedPublicAxios = vi.mocked(axiosPublic, true)
        const mockedAuthAxios = vi.mocked(axiosAuthenticated, true)

        it('should get a public association if isPublic is true', async () => {
            mockedPublicAxios.get.mockResolvedValueOnce({data: _association} as AxiosResponse)
            await associationStore.getAssociationDetail(_association.id, true)
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith(`/associations/${_association.id}`)
            expect(associationStore.association).toEqual(_association)
        })
        it('should get a private association if isPublic is false', async () => {
            mockedAuthAxios.get.mockResolvedValueOnce({data: _association} as AxiosResponse)
            await associationStore.getAssociationDetail(_association.id, false)
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith(`/associations/${_association.id}`)
            expect(associationStore.association).toEqual(_association)
        })
    })

    describe('getInstitutions', () => {
        afterEach(() => {
            associationStore.institutions = []
        })

        const {axiosPublic} = useAxios()
        const mockedAxios = vi.mocked(axiosPublic, true)

        it('should get institutions if there are no institutions in store', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: _institutions} as AxiosResponse)
            await associationStore.getInstitutions()
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenLastCalledWith('/institutions/')
            expect(associationStore.institutions).toEqual(_institutions)
        })

        it('should do nothing if there already are institutions in store', async () => {
            associationStore.institutions = _institutions
            await associationStore.getInstitutions()
            expect(axiosPublic.get).toHaveBeenCalledTimes(0)
            expect(associationStore.institutions).toEqual(_institutions)
        })
    })

    describe('getInstitutionComponents', () => {
        afterEach(() => {
            associationStore.institutionComponents = []
        })

        const {axiosPublic} = useAxios()
        const mockedAxios = vi.mocked(axiosPublic, true)

        it('should get institution components if there are no components in store', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: _institutionComponents} as AxiosResponse)
            await associationStore.getInstitutionComponents()
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenLastCalledWith('/institutions/institution_components')
            expect(associationStore.institutionComponents).toEqual(_institutionComponents)
        })

        it('should do nothing if there already are components in store', async () => {
            associationStore.institutionComponents = _institutionComponents
            await associationStore.getInstitutionComponents()
            expect(axiosPublic.get).toHaveBeenCalledTimes(0)
            expect(associationStore.institutionComponents).toEqual(_institutionComponents)
        })
    })

    describe('getActivityFields', () => {
        afterEach(() => {
            associationStore.activityFields = []
        })

        const {axiosPublic} = useAxios()
        const mockedAxios = vi.mocked(axiosPublic, true)

        it('should get activity fields if there are no fields in store', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: _activityFields} as AxiosResponse)
            await associationStore.getActivityFields()
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenLastCalledWith('/associations/activity_fields')
            expect(associationStore.activityFields).toEqual(_activityFields)
        })

        it('should do nothing if there already are fields in store', async () => {
            associationStore.activityFields = _activityFields
            await associationStore.getActivityFields()
            expect(axiosPublic.get).toHaveBeenCalledTimes(0)
            expect(associationStore.activityFields).toEqual(_activityFields)
        })
    })

    describe('deleteAssociation', () => {
        it('should delete association by calling API once on /associations/id', async () => {
            const {axiosAuthenticated} = useAxios()
            await associationStore.deleteAssociation(1)
            expect(axiosAuthenticated.delete).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.delete).toHaveBeenCalledWith('/associations/1')
        })
    })

    describe('patchEnabledAssociation', () => {
        it('should patch on /associations/id with isEnabled boolean value and update association data in store', async () => {
            const {axiosAuthenticated} = useAxios()
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.patch.mockResolvedValueOnce({data: _association} as AxiosResponse)
            await associationStore.patchEnabledAssociation(true, 1)
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith('/associations/1', {isEnabled: true})
            expect(associationStore.association).toEqual(_association)
        })
    })

    describe('patchPublicAssociation', () => {
        it('should on /association/id with isPublic boolean value and update association data in store', async () => {
            const {axiosAuthenticated} = useAxios()
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.patch.mockResolvedValueOnce({data: _association} as AxiosResponse)
            await associationStore.patchPublicAssociation(true, 1)
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith('/associations/1', {isPublic: true})
            expect(associationStore.association).toEqual(_association)
        })
    })
})
