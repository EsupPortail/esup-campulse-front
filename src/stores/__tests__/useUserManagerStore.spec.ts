import {createPinia, setActivePinia} from 'pinia'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {_commission, _institutionManager, _institutionStudent, _users, _usersNames} from '~/fixtures/user.mock'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {useUserStore} from "../useUserStore";
import {useAxios} from "../../composables/useAxios";
import useUserGroups from "../../composables/useUserGroups";
import {_groups} from "../../../tests/fixtures/group.mock";


vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))


setActivePinia(createPinia())
let userManagerStore = useUserManagerStore()
let userStore = useUserStore()

describe('User manager store', () => {
    beforeEach(() => {
        userManagerStore = useUserManagerStore()
        userStore = useUserStore()

    })
    afterEach(() => {
        vi.restoreAllMocks()
        userStore.user = undefined
    })

    describe('userNames', () => {
        it('should return an array of user objects with user IDs ans concatenated names', () => {
            userManagerStore.users = _users
            expect(userManagerStore.userNames).toEqual(_usersNames)
        })
    })

    describe('userGroups', () => {
        it('should return an array of group IDs', () => {
            userManagerStore.user = _institutionManager
            expect(userManagerStore.userGroups).toEqual([2, 3])
        })
    })

    describe('userCommissions', () => {
        it('should return an array of commission IDs if the user is a commission member', () => {
            userManagerStore.user = _commission
            expect(userManagerStore.userCommissions).toEqual([1])
        })
    })
    describe('getUsers', () => {
        const {axiosAuthenticated} = useAxios()
        const mockedAxios = vi.mocked(axiosAuthenticated, true)

        beforeEach(() => {
            userStore.user = _institutionManager
            mockedAxios.get.mockResolvedValueOnce({data: _users})
        })

        afterEach(() => {
            userStore.user = undefined
        })

        describe('if user is linked to institutions', () => {
            it('should call API once on /users/?institutions if user is linked to institutions', async () => {
                await userManagerStore.getUsers('all')
                expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
                const url = `/users/?institutions=${userStore.userInstitutions?.join(',')},`
                expect(axiosAuthenticated.get).toHaveBeenCalledWith(url)
                expect(userManagerStore.users).toEqual(_users)
            })
        })

        describe('if we want to get only validated users', () => {
            it('should call API once on /users/is_validated_by_admin=true', async () => {
                await userManagerStore.getUsers('validated')
                expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
                const url = `/users/?institutions=${userStore.userInstitutions?.join(',')},&is_validated_by_admin=true`
                expect(axiosAuthenticated.get).toHaveBeenCalledWith(url)
                expect(userManagerStore.users).toEqual(_users)
            })
        })

        describe('if we want to get only unvalidated users', () => {
            it('should call API once on /users/is_validated_by_admin=false', async () => {
                await userManagerStore.getUsers('unvalidated')
                expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
                const url = `/users/?institutions=${userStore.userInstitutions?.join(',')},&is_validated_by_admin=false`
                expect(axiosAuthenticated.get).toHaveBeenCalledWith(url)
                expect(userManagerStore.users).toEqual(_users)
            })
        })
    })

    describe('getUserDetail', () => {
        afterEach(() => {
            userManagerStore.user = undefined
        })
        it('should call API once on /user/id and populate user in store', async () => {
            const {axiosAuthenticated} = useAxios()
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.get.mockResolvedValueOnce({data: _institutionStudent})

            await userManagerStore.getUserDetail(_institutionStudent.id)

            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith(`/users/${_institutionStudent.id}`)
            expect(userManagerStore.user).toEqual(_institutionStudent)
        })
    })

    describe('updateUserGroups', () => {
        const {groups} = useUserGroups()
        const {axiosAuthenticated} = useAxios()
        groups.value = _groups
        userManagerStore.user = _commission

        describe('if COMMISSION is a new group to post', () => {
            it('should post every new group and commission on /users/groups/', async () => {
                await userManagerStore.updateUserGroups([4, 5], [1, 2])
                expect(axiosAuthenticated.post).toHaveBeenCalledTimes(3)
                expect(axiosAuthenticated.post).toHaveBeenLastCalledWith('/users/groups/',
                    {
                        username: userManagerStore.user?.username,
                        group: 5,
                        institution: null,
                        commission: null
                    }
                )
            })
        })

        describe('if COMMISSION is an old group and we new to update commissions', () => {
            it('should post every new commission on /users/groups/', async () => {
                await userManagerStore.updateUserGroups([], [1, 2])
                expect(axiosAuthenticated.post).toHaveBeenCalledTimes(2)
                expect(axiosAuthenticated.post).toHaveBeenLastCalledWith('/users/groups/',
                    {
                        username: userManagerStore.user?.username,
                        group: 4,
                        institution: null,
                        commission: 2
                    }
                )
            })
        })
    })

    describe('deleteUserGroups', () => {
        const {axiosAuthenticated} = useAxios()

        describe('if we delete groups (not COMMISSION)', () => {
            beforeEach(() => {
                userManagerStore.user = _institutionStudent
            })

            afterEach(() => {
                userManagerStore.user = undefined
            })

            it('should delete groups on /users/userId/groups/groupId', async () => {
                await userManagerStore.deleteUserGroups([5, 6], [])
                expect(axiosAuthenticated.delete).toHaveBeenCalledTimes(2)
                const url = `/users/${userManagerStore.user?.id}/groups/6`
                expect(axiosAuthenticated.delete).toHaveBeenLastCalledWith(url)
            })
        })

        describe('if we delete groups (including COMMISSION)', () => {
            beforeEach(() => {
                userManagerStore.user = _commission
            })

            afterEach(() => {
                userManagerStore.user = undefined
            })

            it('should delete groups on /users/userId/groups/groupId', async () => {
                await userManagerStore.deleteUserGroups([4], [])
                expect(axiosAuthenticated.delete).toHaveBeenCalledTimes(1)
                const url = `/users/${userManagerStore.user?.id}/groups/4/commissions/${userManagerStore.userCommissions[0]}`
                expect(axiosAuthenticated.delete).toHaveBeenCalledWith(url)
            })
        })

        describe('if we delete commissions while not deleting COMMISSION group', () => {
            beforeEach(() => {
                userManagerStore.user = _commission
            })

            afterEach(() => {
                userManagerStore.user = undefined
            })

            it('should delete each commission in the array', async () => {
                await userManagerStore.deleteUserGroups([], [1, 2])
                expect(axiosAuthenticated.delete).toHaveBeenCalledTimes(2)
                const url = `/users/${userManagerStore.user?.id}/groups/4/commissions/2`
                expect(axiosAuthenticated.delete).toHaveBeenLastCalledWith(url)
            })
        })
    })

    describe('validateUser', () => {
        it('should call API once on /users/id with isValidated as payload', async () => {
            userManagerStore.user = _institutionStudent
            await userManagerStore.validateUser()
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(`/users/${userManagerStore.user?.id}`, {
                isValidatedByAdmin: true
            })
        })
    })

    describe('deleteUser', () => {
        it('should call API once on /users/id', () => {
            userManagerStore.user = _institutionStudent
            userManagerStore.deleteUser()
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.delete).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.delete).toHaveBeenCalledWith(`/users/${userManagerStore.user?.id}`)
        })
    })
})
