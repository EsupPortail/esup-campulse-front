import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {mockedAxios} from '~/mocks/axios.mock'
import {
    mockedGroups,
    mockedUser,
    mockedUserDirectory,
    mockedUserGroups,
    mockedUserNames,
    mockedUsers
} from '~/mocks/user.mock'
import {useUserManagerStore} from '@/stores/useUserManagerStore'


setActivePinia(createPinia())
let userManagerStore = useUserManagerStore()

describe('User manager store', () => {
    beforeEach(() => {
        userManagerStore = useUserManagerStore()
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })
    describe('getUsers', () => {
        beforeEach(() => {
            mockedAxios.get.mockResolvedValueOnce({data: mockedUsers})
        })
        afterEach(() => {
            userManagerStore.users = []
        })
        describe('If users are not populated yet', () => {
            beforeEach(() => {
                userManagerStore.getUsers()
            })
            afterEach(() => {
                userManagerStore.users = []
            })
            it('should call API once on /users/', () => {
                expect(mockedAxios.get).toHaveBeenCalledOnce()
                expect(mockedAxios.get).toHaveBeenCalledWith('/users/')
            })
            it('should populate users state', () => {
                expect(userManagerStore.users).toEqual(mockedUsers)
            })
            it('should set allUsers to true', () => {
                expect(userManagerStore.allUsers).toBeTruthy()
            })
            describe('If allUsers is false', () => {
                it('should call API', () => {
                    expect(mockedAxios.get).toHaveBeenCalledOnce()
                })
            })
        })
        describe('If all users are already populated', () => {
            beforeEach(() => {
                userManagerStore.users = mockedUsers
                userManagerStore.allUsers = true
            })
            afterEach(() => {
                userManagerStore.users = []
                userManagerStore.allUsers = false
            })
            it('should not call API', async () => {
                await userManagerStore.getUsers()
                expect(mockedAxios.get).toHaveBeenCalledTimes(0)
            })
            it('should keep users in state', () => {
                expect(userManagerStore.users).toEqual(mockedUsers)
            })
        })
    })
    describe('getUnvalidatedUsers', () => {
        beforeEach(() => {
            mockedAxios.get.mockResolvedValueOnce({data: mockedUsers})
        })
        afterEach(() => {
            userManagerStore.users = []
        })
        describe('If unvalidated users are not populated yet', () => {
            beforeEach(() => {
                userManagerStore.getUnvalidatedUsers()
            })
            afterEach(() => {
                userManagerStore.users = []
            })
            it('should call API once on /users/?is_validated_by_admin=false', () => {
                expect(mockedAxios.get).toHaveBeenCalledOnce()
                expect(mockedAxios.get).toHaveBeenCalledWith('/users/?is_validated_by_admin=false')
            })
            it('should populate users state', () => {
                expect(userManagerStore.users).toEqual(mockedUsers)
            })
            it('should set allUsers to false', () => {
                expect(userManagerStore.allUsers).toBeFalsy()
            })
        })
        describe('If unvalidated users are already populated', () => {
            beforeEach(() => {
                userManagerStore.users = mockedUsers
                userManagerStore.getUnvalidatedUsers()
            })
            afterEach(() => {
                userManagerStore.users = []
            })
            it('should not call API', () => {
                expect(mockedAxios.get).toHaveBeenCalledTimes(0)
            })
            it('should keep users data', () => {
                expect(userManagerStore.users).toEqual(mockedUsers)
            })
        })
    })
    describe('getUserDetail', () => {
        beforeEach(() => {
            mockedAxios.get.mockResolvedValueOnce({data: mockedUser})
            mockedAxios.get.mockResolvedValueOnce({data: mockedGroups})
        })
        afterEach(() => {
            userManagerStore.user = undefined
        })
        describe('If user not already in store', () => {
            beforeEach(() => {
                userManagerStore.getUserDetail(mockedUser.id)
            })
            afterEach(() => {
                userManagerStore.user = undefined
            })
            it('should call API to get user and groups', () => {
                expect(mockedAxios.get).toHaveBeenCalledTimes(2)
                expect(mockedAxios.get).toHaveBeenCalledWith(`/users/${mockedUser.id}`)
                expect(mockedAxios.get).toHaveBeenCalledWith(`/users/groups/${mockedUser.id}`)
            })
            it('should populate user state and groups', () => {
                expect(userManagerStore.user).toEqual(mockedUser)
                expect(userManagerStore.user?.groups).toEqual(mockedGroups)
            })
        })
        describe('If user already in store', () => {
            beforeEach(() => {
                userManagerStore.user = mockedUser
                userManagerStore.getUserDetail(mockedUser.id)
            })
            it('should not call API', () => {
                expect(mockedAxios.get).toHaveBeenCalledTimes(0)
            })
            it('should not modify user state', () => {
                expect(userManagerStore.user).toEqual(mockedUser)
                expect(userManagerStore.user?.groups).toEqual(mockedGroups)
            })
        })
    })
    describe('updateUserGroups', () => {
        beforeEach(() => {
            userManagerStore.user = mockedUser
            userManagerStore.updateUserGroups(mockedUserGroups)
        })
        it('should call API once on /users/groups/ with groups as payload', () => {
            expect(mockedAxios.post).toHaveBeenCalledOnce()
            expect(mockedAxios.post).toHaveBeenCalledWith('/users/groups/', {
                username: userManagerStore.user?.username,
                groups: mockedUserGroups
            })
        })
    })
    describe('validateUser', () => {
        beforeEach(() => {
            userManagerStore.user = mockedUser
            userManagerStore.validateUser()
        })
        it('should call API once on /users/id with isValidated as payload', () => {
            expect(mockedAxios.patch).toHaveBeenCalledOnce()
            expect(mockedAxios.patch).toHaveBeenCalledWith(`/users/${userManagerStore.user?.id}`, {
                isValidatedByAdmin: true
            })
        })
    })
    describe('deleteUser', () => {
        beforeEach(() => {
            userManagerStore.user = mockedUser
            userManagerStore.users = mockedUsers
            userManagerStore.deleteUser()
        })
        afterEach(() => {
            userManagerStore.user = undefined
            userManagerStore.users = []
        })
        it('should call API once on /users/id', () => {
            expect(mockedAxios.delete).toHaveBeenCalledOnce()
            expect(mockedAxios.delete).toHaveBeenCalledWith(`/users/${userManagerStore.user?.id}`)
        })
        it('should delete user in users store', () => {
            const deletedUser = userManagerStore.users.find((user) => user.id === userManagerStore.user?.id)
            expect(deletedUser).toBeUndefined()
        })
    })
    describe('deleteUserGroups', () => {
        beforeEach(() => {
            userManagerStore.user = mockedUser
            userManagerStore.deleteUserGroups([3])
        })
        it('should call API for each group', () => {
            expect(mockedAxios.delete).toHaveBeenCalledOnce()
        })
        it('should call API on /users/groups/userId/groupId', () => {
            expect(mockedAxios.delete).toHaveBeenCalledWith(
                `/users/groups/${userManagerStore.user?.id}/${3}`
            )
        })
    })
    describe('userNames', () => {
        it('should return the names of users with values and labels', () => {
            userManagerStore.users = [
                {
                    id: 1,
                    username: 'john.lennon@bbc.com',
                    firstName: 'John',
                    lastName: 'Lennon',
                    email: 'john.lennon@bbc.com',
                    isValidatedByAdmin: true,
                },
                {
                    id: 2,
                    username: 'bill@murray.com',
                    firstName: 'Bill',
                    lastName: 'Murray',
                    email: 'bill@murray.com',
                    isValidatedByAdmin: true,
                }
            ]
            expect(userManagerStore.userNames).toEqual(mockedUserNames)
        })
    })
    describe('userDirectory', () => {
        it('should return some data of each user for the directory', () => {
            userManagerStore.users = [
                {
                    id: 1,
                    username: 'john.lennon@bbc.com',
                    firstName: 'John',
                    lastName: 'Lennon',
                    email: 'john.lennon@bbc.com',
                    isValidatedByAdmin: true,
                },
                {
                    id: 2,
                    username: 'bill@murray.com',
                    firstName: 'Bill',
                    lastName: 'Murray',
                    email: 'bill@murray.com',
                    isValidatedByAdmin: true,
                }
            ]
            expect(userManagerStore.userDirectory).toEqual(mockedUserDirectory)
        })
    })
    describe('userGroups', () => {
        beforeEach(() => {
            userManagerStore.user = mockedUser
        })
        it('should return an array of numbers of the groups', () => {
            expect(userManagerStore.userGroups).toEqual(mockedUserGroups)
        })
    })
})
