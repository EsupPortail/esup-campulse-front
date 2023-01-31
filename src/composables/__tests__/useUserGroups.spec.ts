import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {mockedAxios} from '~/mocks/axios.mock'
import {mockedGroupList, mockedGroups, mockedUser} from '~/mocks/user.mock'
import useUserGroups from '@/composables/useUserGroups'
import {config} from '@vue/test-utils'
import {createTestingPinia} from '@pinia/testing'
import {useUserManagerStore} from '@/stores/useUserManagerStore'

const {getGroups, groups, groupList, studentGroup, groupsToDelete, newGroups, updateUserGroups} = useUserGroups()

vi.mock('@/plugins/axios')

config.global.plugins = [
    createTestingPinia({createSpy: vi.fn()}),
]

describe('useUserGroups', () => {
    let userManagerStore = useUserManagerStore()
    beforeEach(() => {
        userManagerStore = useUserManagerStore()
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })
    describe('getGroups', () => {
        beforeEach(() => {
            mockedAxios.get.mockResolvedValueOnce({data: mockedGroups})
            getGroups()
        })
        it('should get user groups', () => {
            expect(groups.value).toEqual(mockedGroups)
        })
        it('should be called once', () => {
            expect(mockedAxios.get).toHaveBeenCalledOnce()
        })
        it('should call API on /groups/', () => {
            expect(mockedAxios.get).toHaveBeenCalledWith('/groups/')
        })
    })
    describe('groupList', () => {
        it('should create an array of value and label for each group', () => {
            groups.value = mockedGroups
            expect(groupList.value).toEqual(mockedGroupList)
        })
    })
    describe('studentGroup', () => {
        it('should return the student group object', () => {
            groups.value = mockedGroups
            expect(studentGroup.value).toEqual(mockedGroups[1])
        })
    })
    describe('groupsToDelete', () => {
        const oldGroups = [1, 2, 3]
        const newGroups = [1, 4, 5]

        it('should return groups that are in oldGroups but not in newGroups', () => {
            const result = groupsToDelete(newGroups, oldGroups)
            expect(result).toEqual([2, 3])
        })
    })
    describe('updateUserGroups', () => {
        const spies = {
            updateUserGroups: vi.spyOn(userManagerStore, 'updateUserGroups'),
            deleteUserGroups: vi.spyOn(userManagerStore, 'deleteUserGroups')
        }
        it('should update groups if there are changes', async () => {
            userManagerStore.user = mockedUser
            newGroups.value = [4, 5]
            await updateUserGroups()
            expect(spies.updateUserGroups).toHaveBeenCalledOnce()
            expect(spies.deleteUserGroups).toHaveBeenCalledOnce()
        })
        it('should not update groups if there are no changes', async () => {
            userManagerStore.user = mockedUser
            newGroups.value = [1, 2, 3]
            await updateUserGroups()
            expect(spies.updateUserGroups).toHaveBeenCalledTimes(0)
            expect(spies.deleteUserGroups).toHaveBeenCalledTimes(0)
        })
    })
})
