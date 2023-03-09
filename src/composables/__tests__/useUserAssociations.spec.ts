import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {createPinia, setActivePinia} from 'pinia'
import {useUserStore} from '@/stores/useUserStore'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {_associationRole, _institutionStudent, _userAssociations} from '~/fixtures/user.mock'
import {useAxios} from '@/composables/useAxios'
import useUserAssociations from '@/composables/useUserAssociations'

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

let userStore = useUserStore()
let userManagerStore = useUserManagerStore()

describe('useUserAssociations', () => {
    beforeEach(() => {
        userStore = useUserStore()
        userManagerStore = useUserManagerStore()
    })

    const {
        updateUserAssociations,
        userAssociations,
        deleteUserAssociation,
        patchUserAssociations,
        getUserAssociations
    } = useUserAssociations()

    /*describe('updateUserAssociations', () => {
        describe('if editedByStaff', () => {
            beforeEach(() => {
                userStore.user = _institutionStudent
            })

            it('should delete userAssociations if the associations deleteAssociation params are set to true', () => {
                userAssociations.value = JSON.parse(JSON.stringify([_associationRole]))
                userAssociations.value[0].deleteAssociation = true

                vi.mocked(deleteUserAssociation).mockImplementation((args) => deleteUserAssociation(args))

                updateUserAssociations(true)
                expect(deleteUserAssociation).toHaveBeenCalledOnce()
            })
            it('should patch userAssociations if there are changes', () => {
                userAssociations.value = JSON.parse(JSON.stringify([_associationRole]))
                userManagerStore.userAssociations = JSON.parse(JSON.stringify([_userAssociationDetail]))
                userManagerStore.userAssociations[0].isPresident = false
                userManagerStore.userAssociations[0].isSecretary = true
                updateUserAssociations()
                expect(spies.patchUserAssociations).toHaveBeenCalledTimes(userAssociations.value.length)
            })
        })

        describe('if not editedByStaff', () => {
            //
        })
    })*/

    describe('deleteUserAssociation', () => {
        it('should call API once on /users/associations/userId/associationId', async () => {
            userManagerStore.user = _institutionStudent
            const {axiosAuthenticated} = useAxios()
            await deleteUserAssociation(userManagerStore.user?.id, 1)
            expect(axiosAuthenticated.delete).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.delete).toHaveBeenCalledWith(`/users/associations/${userManagerStore.user?.id}/1`)
        })
    })

    describe('patchUserAssociations', () => {
        it('should call API once on /users/associations/userId/associationId with data to patch as payload', async () => {
            userManagerStore.user = _institutionStudent
            const dataToPatch = {
                isPresident: false,
                canBePresident: true,
                isSecretary: false,
                isTreasurer: true,
            }
            await patchUserAssociations(userManagerStore.user?.id, 1, dataToPatch)
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(`/users/associations/${userManagerStore.user?.id}/1`, dataToPatch)
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
                    canBePresident: false,
                    isValidatedByAdmin: false,
                    isSecretary: false,
                    isTreasurer: false
                }
            ])
        })
    })

    describe('getUserAssociations', () => {
        it('should call API once on /users/associations/id and populate userAssociations', async () => {
            const {axiosAuthenticated} = useAxios()
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.get.mockResolvedValueOnce({data: _userAssociations})
            await getUserAssociations(1, true)
            expect(mockedAxios.get).toHaveBeenCalledOnce()
            expect(mockedAxios.get).toHaveBeenCalledWith('/users/associations/1')
            expect(userManagerStore.userAssociations).toEqual(_userAssociations)
        })
    })
})



