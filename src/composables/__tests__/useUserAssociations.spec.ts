import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {createPinia, setActivePinia} from 'pinia'
import {useUserStore} from '@/stores/useUserStore'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {
    _associationMembers,
    _associationRole,
    _institutionStudent,
    _userAssociationDetail,
    _userAssociationDetails,
    _userAssociations,
    _users
} from '~/fixtures/user.mock'
import useUserAssociations from '@/composables/useUserAssociations'
import {useAxios} from '../useAxios'
import {_association, _associationNames} from '../../../tests/fixtures/association.mock'
import {useAssociationStore} from '../../stores/useAssociationStore'

vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

vi.mock('@/composable/useUserAssociations', () => ({
    default: () => ({
        updateUserAssociations: vi.fn(),
        deleteUserAssociation: vi.fn(),
        getUserAssociations: vi.fn(),
        patchUserAssociations: vi.fn()
    })
}))

setActivePinia(createPinia())

config.global.plugins = [
    createTestingPinia({
        createSpy: vi.fn()
    })
]

let userManagerStore = useUserManagerStore()
let userStore = useUserStore()
let associationStore = useAssociationStore()

describe('useUserAssociations', () => {
    beforeEach(() => {
        userStore = useUserStore()
        userManagerStore = useUserManagerStore()
        associationStore = useAssociationStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    const {
        deleteUserAssociation,
        patchUserAssociations,
        getUserAssociations,
        userAssociations
    } = useUserAssociations()

    describe('updateUserAssociations', () => {
        const {updateUserAssociations} = useUserAssociations()
        const {axiosAuthenticated} = useAxios()

        describe('if editedByStaff', () => {

            beforeEach(() => {
                userManagerStore.user = _institutionStudent
                userAssociations.value = [_associationRole]
            })

            afterEach(() => {
                userManagerStore.user = undefined
                userManagerStore.userAssociations = []
                userAssociations.value = []
            })

            it('should delete userAssociations if the deleteAssociation param is set to true', async () => {
                userAssociations.value[0].deleteAssociation = true
                await updateUserAssociations(true)
                expect(axiosAuthenticated.delete).toHaveBeenCalledOnce()
                const url = `/users/${userManagerStore.user?.id}/associations/${userAssociations.value[0].id}`
                expect(axiosAuthenticated.delete).toHaveBeenCalledWith(url)
            })

            it('should patch userAssociations if there are changes', async () => {
                userAssociations.value[0].deleteAssociation = false
                userManagerStore.userAssociations = [_userAssociationDetail]
                userManagerStore.userAssociations[0].isPresident = false
                userManagerStore.userAssociations[0].isSecretary = true
                await updateUserAssociations(true)
                expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            })
        })

        describe('if not editedByStaff', () => {

            beforeEach(() => {
                userStore.user = _institutionStudent
                userAssociations.value = [_associationRole]
            })

            afterEach(() => {
                userStore.user = undefined
                userAssociations.value = []
            })

            it('should delete userAssociations if the deleteAssociation param is set to true and splice it from composable and store', async () => {
                userAssociations.value[0].deleteAssociation = true
                await updateUserAssociations(false)
                expect(axiosAuthenticated.delete).toHaveBeenCalledOnce()
                const url = `/users/${userStore.user?.id}/associations/${userAssociations.value[0].id}`
                expect(axiosAuthenticated.delete).toHaveBeenCalledWith(url)
                //expect(userAssociations.value.length).toEqual(0) TODO: test this part
            })

            it('should patch userAssociations if there are changes', async () => {
                userAssociations.value[0].deleteAssociation = false
                userStore.userAssociations = [_userAssociationDetail]
                userStore.userAssociations[0].isPresident = false
                userStore.userAssociations[0].isSecretary = true
                await updateUserAssociations(false)
                expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            })
        })
    })

    describe('deleteUserAssociation', () => {
        it('should call API once on /users/userId/associations/associationId', async () => {
            userManagerStore.user = _institutionStudent
            const {axiosAuthenticated} = useAxios()
            await deleteUserAssociation(userManagerStore.user?.id, 1)
            expect(axiosAuthenticated.delete).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.delete).toHaveBeenCalledWith(`/users/${userManagerStore.user?.id}/associations/1`)
        })
    })

    describe('patchUserAssociations', () => {
        it('should call API once on /users/userId/associations/associationId with data to patch as payload', async () => {
            userManagerStore.user = _institutionStudent
            const dataToPatch = {
                isPresident: false,
                canBePresidentPermanent: true,
                canBePresidentFrom: null,
                canBePresidentTo: null,
                isSecretary: false,
                isTreasurer: true,
                isVicePresident: false
            }
            await patchUserAssociations(userManagerStore.user?.id, 1, dataToPatch)
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(`/users/${userManagerStore.user?.id}/associations/1`, dataToPatch)
        })
    })

    describe('addAssociation', () => {
        const {newAssociations, addAssociation, associationRoleOptions} = useUserAssociations()

        afterEach(() => {
            newAssociations.value = []
        })

        it('should push a new association object into newAssociations', () => {
            addAssociation()
            expect(newAssociations.value).toEqual([{
                id: null,
                role: 'isMember',
                options: associationRoleOptions
            }])
        })
    })

    describe('removeAssociation', () => {
        const {newAssociations, addAssociation, removeAssociation} = useUserAssociations()

        afterEach(() => {
            newAssociations.value = []
        })

        it('should remove an association from newAssociations based on association index', () => {
            addAssociation()
            removeAssociation(0)
            expect(newAssociations.value).toEqual([])
        })
    })

    describe('updateRegisterRoleInAssociation', () => {
        const {updateRegisterRoleInAssociation, newAssociations, newAssociationsUser} = useUserAssociations()

        afterEach(() => {
            newAssociations.value = []
        })

        it('should return an array of association users based on newAssociations', () => {
            newAssociations.value = JSON.parse(JSON.stringify([_associationRole]))
            updateRegisterRoleInAssociation()
            expect(newAssociationsUser.value).toEqual([
                {
                    association: 1,
                    isPresident: true,
                    canBePresidentPermanent: false,
                    canBePresidentFrom: null,
                    canBePresidentTo: null,
                    isValidatedByAdmin: false,
                    isSecretary: false,
                    isTreasurer: false,
                    isVicePresident: false
                }
            ])
        })
    })

    describe('getUserAssociations', () => {
        const {getUserAssociations} = useUserAssociations()
        const {axiosAuthenticated} = useAxios()

        const associationNamesUrl = '/associations/names'

        describe('if the user is a managedUser', () => {
            beforeEach(() => {
                userManagerStore.user = _institutionStudent
            })

            afterEach(() => {
                userManagerStore.user = undefined
                userManagerStore.userAssociations = []
                vi.restoreAllMocks()
            })

            it('should get extended userAssociations', async () => {
                const userAssociationsUrl = `/users/${userManagerStore.user?.id}/associations/`

                const mockedAxios = vi.mocked(axiosAuthenticated, true)
                mockedAxios.get.mockImplementation((url) => {
                    if (url === userAssociationsUrl) return Promise.resolve({data: [_userAssociations[0]]})
                    else return Promise.resolve({data: _association})
                })

                await getUserAssociations(userManagerStore.user?.id, true)

                expect(axiosAuthenticated.get).toHaveBeenCalledTimes(2)
                expect(axiosAuthenticated.get).toHaveBeenCalledWith(userAssociationsUrl)
                expect(axiosAuthenticated.get).toHaveBeenCalledWith('/associations/1')
                expect(userManagerStore.userAssociations).toEqual([_userAssociationDetails[0]])
            })
        })

        describe('if the user is not a managedUser', () => {
            beforeEach(() => {
                userStore.user = _institutionStudent
            })

            afterEach(() => {
                userStore.user = undefined
                userStore.userAssociations = []
            })

            it('should get extended userAssociations', async () => {
                const userAssociationsUrl = '/users/associations/'

                const mockedAxios = vi.mocked(axiosAuthenticated, true)
                mockedAxios.get.mockImplementation((url) => {
                    if (url === userAssociationsUrl) return Promise.resolve({data: [_userAssociations[4]]})
                    else if (url === associationNamesUrl) return Promise.resolve({data: _associationNames})
                    else return Promise.resolve({data: _association})
                })

                await getUserAssociations(userStore.user?.id, false)

                expect(axiosAuthenticated.get).toHaveBeenCalledTimes(2)
                expect(axiosAuthenticated.get).toHaveBeenCalledWith(userAssociationsUrl)
                expect(axiosAuthenticated.get).toHaveBeenCalledWith(associationNamesUrl)
                expect(userStore.userAssociations).toEqual([_userAssociationDetails[4]])
            })
        })
    })

    describe('getAssociationUserRole', () => {
        const {getAssociationUserRole} = useUserAssociations()

        it('should return the string code of the role', () => {
            expect(getAssociationUserRole(_userAssociations[0])).toEqual('isPresident')
            expect(getAssociationUserRole(_userAssociations[1])).toEqual('isSecretary')
            expect(getAssociationUserRole(_userAssociations[2])).toEqual('isTreasurer')
            expect(getAssociationUserRole(_userAssociations[3])).toEqual('isVicePresident')
            expect(getAssociationUserRole(_userAssociations[4])).toEqual('isMember')
        })
    })

    describe('getAssociationUserNames', () => {
        const {axiosAuthenticated} = useAxios()
        const {getAssociationUsersNames} = useUserAssociations()

        it('should get users based on association affiliation', async () => {
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.get.mockResolvedValueOnce({data: _users})
            await getAssociationUsersNames(1)
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/users/?association_id=1')
        })
    })

    describe('initAssociationMembers', () => {
        const {initAssociationMembers, associationMembers} = useUserAssociations()
        const {axiosAuthenticated} = useAxios()
        const spy = vi.spyOn(associationStore, 'getAssociationUsers')

        beforeEach(() => {
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.get.mockResolvedValueOnce({data: _users})
        })

        it('should get associationUsers and userNames', async () => {
            await initAssociationMembers(1, false)
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/users/?association_id=1')
            expect(spy).toHaveBeenCalledOnce()
        })

        it('should init all users into associationMembers', async () => {
            associationStore.associationUsers = _userAssociations
            await initAssociationMembers(1, false)
            expect(associationMembers.value).toEqual(_associationMembers)
        })
    })
})
