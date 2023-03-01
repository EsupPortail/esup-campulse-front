import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {_groupLabels, _institutionStudent, _userGroups} from '~/fixtures/user.mock'
import useUserGroups from '@/composables/useUserGroups'
import {config} from '@vue/test-utils'
import {createTestingPinia} from '@pinia/testing'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {useAxios} from '@/composables/useAxios'


vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

const {getGroups, groups, groupList, studentGroup, groupsToDelete, newGroups, updateUserGroups} = useUserGroups()

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
            const {axiosPublic} = useAxios()
            const mockedAxios = vi.mocked(axiosPublic, true)
            mockedAxios.get.mockResolvedValueOnce({data: _userGroups})
            getGroups()
        })
        it('should call API once on /groups/ and get user groups', () => {
            const {axiosPublic} = useAxios()
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith('/groups/')
            expect(groups.value).toEqual(_userGroups)
        })
    })
    describe('groupList', () => {
        it('should create an array of value and label for each group', () => {
            groups.value = _userGroups
            expect(groupList.value).toEqual(_groupLabels)
        })
    })
    describe('studentGroup', () => {
        it('should return the student group object', () => {
            groups.value = _userGroups
            expect(studentGroup.value).toEqual(_userGroups[1])
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
            userManagerStore.user = _institutionStudent
            newGroups.value = [4, 5]
            await updateUserGroups()
            expect(spies.updateUserGroups).toHaveBeenCalledOnce()
            expect(spies.deleteUserGroups).toHaveBeenCalledOnce()
        })
        it('should not update groups if there are no changes', async () => {
            userManagerStore.user = _institutionStudent
            newGroups.value = [1, 2, 3]
            await updateUserGroups()
            expect(spies.updateUserGroups).toHaveBeenCalledTimes(0)
            expect(spies.deleteUserGroups).toHaveBeenCalledTimes(0)
        })
    })
})
