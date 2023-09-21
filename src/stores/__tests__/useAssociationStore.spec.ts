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
import useUserGroups from '@/composables/useUserGroups'
import {_groups} from '~/fixtures/group.mock'
import {useAxios} from '@/composables/useAxios'
import {_generalManager, _institutionManager, _institutionStudent, _userAssociations} from '~/fixtures/user.mock'


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
        const {axiosPublic, axiosAuthenticated} = useAxios()
        const mockedPublicAxios = vi.mocked(axiosPublic, true)
        const mockedAuthAxios = vi.mocked(axiosAuthenticated, true)

        afterEach(() => {
            associationStore.associations = []
            vi.restoreAllMocks()
        })

        it('should get only public associations if isPublic is true', async () => {
            mockedPublicAxios.get.mockImplementation((url) => {
                switch (url) {
                case '/associations/?is_public=true':
                    return Promise.resolve({data: _associations})
                case '/institutions/':
                    return Promise.resolve({data: _institutions})
                case '/institutions/institution_components':
                    return Promise.resolve({data: _institutionComponents})
                case '/associations/activity_fields':
                    return Promise.resolve({data: _activityFields})
                default:
                    return Promise.reject(new Error('not found'))
                }
            })

            await associationStore.getAssociations(true)
            expect(axiosPublic.get).toHaveBeenCalledTimes(4)
            expect(axiosPublic.get).toHaveBeenCalledWith('/associations/?is_public=true')
            expect(axiosPublic.get).toHaveBeenCalledWith('/institutions/')
            expect(axiosPublic.get).toHaveBeenCalledWith('/institutions/institution_components')
            expect(axiosPublic.get).toHaveBeenCalledWith('/associations/activity_fields')
            expect(associationStore.associations).toEqual(_associations)
        })

        it('should get all associations with auth instance if isPublic is false', async () => {
            mockedAuthAxios.get.mockImplementation((url) => {
                switch (url) {
                case '/associations/':
                    return Promise.resolve({data: _associations})
                case '/institutions/':
                    return Promise.resolve({data: _institutions})
                case '/institutions/institution_components':
                    return Promise.resolve({data: _institutionComponents})
                case '/associations/activity_fields':
                    return Promise.resolve({data: _activityFields})
                default:
                    return Promise.reject(new Error('not found'))
                }
            })

            await associationStore.getAssociations(false)

            expect(axiosAuthenticated.get).toHaveBeenCalledTimes(4)
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/associations/')
            expect(axiosPublic.get).toHaveBeenCalledWith('/institutions/')
            expect(axiosPublic.get).toHaveBeenCalledWith('/institutions/institution_components')
            expect(axiosPublic.get).toHaveBeenCalledWith('/associations/activity_fields')
            expect(associationStore.associations).toEqual(_associations)
        })

    })

    describe('getInstitutionAssociations', () => {
        it('should get associations linked to a list of institution IDs', async () => {
            userStore.user = _institutionManager
            const institutions = userStore.userInstitutions?.join(',')

            const {axiosAuthenticated} = useAxios()
            const mockedAuthAxios = vi.mocked(axiosAuthenticated, true)
            mockedAuthAxios.get.mockImplementation((url) => {
                switch (url) {
                case `/associations/?institutions=${institutions}`:
                    return Promise.resolve({data: _associations})
                case '/institutions/':
                    return Promise.resolve({data: _institutions})
                case '/institutions/institution_components':
                    return Promise.resolve({data: _institutionComponents})
                case '/associations/activity_fields':
                    return Promise.resolve({data: _activityFields})
                default:
                    return Promise.reject(new Error('not found'))
                }
            })

            await associationStore.getInstitutionAssociations()

            expect(axiosAuthenticated.get).toHaveBeenCalledTimes(4)
            expect(axiosAuthenticated.get).toHaveBeenCalledWith(`/associations/?institutions=${institutions}`)
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/institutions/')
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/institutions/institution_components')
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/associations/activity_fields')
            expect(associationStore.associations).toEqual(_associations)
        })
    })

    describe('getAssociationNames', () => {
        const {axiosPublic} = useAxios()
        const mockedAxios = vi.mocked(axiosPublic, true)

        afterEach(() => {
            associationStore.associationNames = []
            userStore.user = undefined
            isStaff.value = false
        })

        it('should get all association names if isPublic is false and the user is not managing associations', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: _associationNames})
            isStaff.value = false
            await associationStore.getAssociationNames(false, false)
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith('/associations/names')
            expect(associationStore.associationNames).toEqual(_associationNames)
        })

        it('should get only public association names if isPublic is true', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: _associationNames})
            await associationStore.getAssociationNames(true, false)
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith('/associations/names?is_public=true')
            expect(associationStore.associationNames).toEqual(_associationNames)
        })

        it('should only get association names linked to the institutions of a staff member', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: _associationNames})
            userStore.user = _institutionManager
            isStaff.value = true
            const institutions = userStore.userInstitutions?.join(',')
            await associationStore.getAssociationNames(false, false)
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith(`/associations/names?institutions=${institutions}`)
            expect(associationStore.associationNames).toEqual(_associationNames)
        })

        it('should only get the names of the associations which can allow new members', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: _associationNames})
            await associationStore.getAssociationNames(false, true)
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith('/associations/names?allow_new_users=true')
            expect(associationStore.associationNames).toEqual(_associationNames)
        })
    })

    describe('getManagedAssociations', () => {
        const {axiosAuthenticated} = useAxios()
        const mockedAuthAxios = vi.mocked(axiosAuthenticated, true)

        afterEach(() => {
            userStore.user = undefined
            associationStore.associations = []
            isStaff.value = false
            vi.restoreAllMocks()
        })

        describe('if student member of associations', () => {
            it('should get all associations the user is a member of', async () => {
                userStore.user = _institutionStudent

                mockedAuthAxios.get.mockImplementation((url) => {
                    switch (url) {
                    case '/associations/1':
                        return Promise.resolve({data: _association})
                    case '/institutions/':
                        return Promise.resolve({data: _institutions})
                    case '/institutions/institution_components':
                        return Promise.resolve({data: _institutionComponents})
                    case '/associations/activity_fields':
                        return Promise.resolve({data: _activityFields})
                    default:
                        return Promise.reject(new Error('not found'))
                    }
                })

                await associationStore.getManagedAssociations()

                expect(axiosAuthenticated.get).toHaveBeenCalledTimes(4)
                expect(axiosAuthenticated.get).toHaveBeenLastCalledWith('/associations/1')
                expect(axiosAuthenticated.get).toHaveBeenCalledWith('/institutions/')
                expect(axiosAuthenticated.get).toHaveBeenCalledWith('/institutions/institution_components')
                expect(axiosAuthenticated.get).toHaveBeenCalledWith('/associations/activity_fields')
                expect(associationStore.associations).toEqual([_association])
            })
        })

        describe('if general manager', () => {
            it('should get all associations', async () => {
                userStore.user = _generalManager
                isStaff.value = true
                mockedAuthAxios.get.mockResolvedValueOnce({data: _associations})
                associationStore.getAssociations = vi.fn()
                await associationStore.getManagedAssociations()
                expect(associationStore.getAssociations).toHaveBeenCalledOnce()
            })
        })

        describe('if institution manager', () => {
            it('should get all associations linked to the associations of a manager', async () => {
                userStore.user = _institutionManager
                isStaff.value = true
                mockedAuthAxios.get.mockResolvedValueOnce({data: _associations})
                associationStore.getInstitutionAssociations = vi.fn()
                await associationStore.getManagedAssociations()
                expect(associationStore.getInstitutionAssociations).toHaveBeenCalledOnce()
            })
        })
    })

    describe('getAssociationDetail', () => {
        const {axiosPublic, axiosAuthenticated} = useAxios()
        const mockedPublicAxios = vi.mocked(axiosPublic, true)
        const mockedAuthAxios = vi.mocked(axiosAuthenticated, true)

        afterEach(() => {
            associationStore.association = undefined
        })

        it('should get a public association if isPublic is true', async () => {
            mockedPublicAxios.get.mockImplementation((url) => {
                switch (url) {
                case `/associations/${_association.id}`:
                    return Promise.resolve({data: _association})
                case '/institutions/':
                    return Promise.resolve({data: _institutions})
                case '/institutions/institution_components':
                    return Promise.resolve({data: _institutionComponents})
                case '/associations/activity_fields':
                    return Promise.resolve({data: _activityFields})
                default:
                    return Promise.reject(new Error('not found'))
                }
            })
            await associationStore.getAssociationDetail(_association.id, true)
            expect(axiosPublic.get).toHaveBeenCalledTimes(4)
            expect(axiosPublic.get).toHaveBeenCalledWith(`/associations/${_association.id}`)
            expect(associationStore.association).toEqual(_association)
        })

        it('should get a private association if isPublic is false', async () => {
            mockedAuthAxios.get.mockImplementation((url) => {
                switch (url) {
                case `/associations/${_association.id}`:
                    return Promise.resolve({data: _association})
                case '/institutions/':
                    return Promise.resolve({data: _institutions})
                case '/institutions/institution_components':
                    return Promise.resolve({data: _institutionComponents})
                case '/associations/activity_fields':
                    return Promise.resolve({data: _activityFields})
                default:
                    return Promise.reject(new Error('not found'))
                }
            })
            await associationStore.getAssociationDetail(_association.id, false)
            expect(axiosAuthenticated.get).toHaveBeenCalledTimes(4)
            expect(axiosAuthenticated.get).toHaveBeenCalledWith(`/associations/${_association.id}`)
            expect(associationStore.association).toEqual(_association)
        })
    })

    describe('updateAssociationLogo', () => {
        it('should patch the logo and update the store', async () => {
            const {axiosAuthenticated} = useAxios()

            associationStore.association = _association
            const logoData = new FormData()
            const associationId = 1
            const response = {pathLogo: 'path'}
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.patch.mockResolvedValueOnce({data: response})
            await associationStore.updateAssociationLogo(logoData, associationId)
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(`/associations/${associationId}`, logoData)
        })
    })

    describe('getInstitutions', () => {
        afterEach(() => {
            associationStore.institutions = []
        })

        const {axiosPublic} = useAxios()
        const mockedAxios = vi.mocked(axiosPublic, true)

        it('should get institutions if there are no institutions in store', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: _institutions})
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
            mockedAxios.get.mockResolvedValueOnce({data: _institutionComponents})
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
            mockedAxios.get.mockResolvedValueOnce({data: _activityFields})
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
            mockedAxios.patch.mockResolvedValueOnce({data: _association})
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
            mockedAxios.patch.mockResolvedValueOnce({data: _association})
            await associationStore.patchPublicAssociation(true, 1)
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith('/associations/1', {isPublic: true})
            expect(associationStore.association).toEqual(_association)
        })
    })

    describe('getAssociationUsers', () => {
        const {axiosAuthenticated} = useAxios()

        it('should get all users member of an association', async () => {
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.get.mockResolvedValueOnce({data: _userAssociations})
            await associationStore.getAssociationUsers(1)
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenLastCalledWith('/users/associations/?association_id=1')
            expect(associationStore.associationUsers).toEqual(_userAssociations)
        })
    })
})
