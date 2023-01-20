import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { mockedAxios } from '~/mocks/axios.mock'
import { mockedGroupList, mockedGroups } from '~/mocks/user.mock'
import useUserGroups from '@/composables/useUserGroups'

const { getGroups, groups, groupList, studentGroup, groupsToDelete } = useUserGroups()

describe('useUserGroups', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })
    describe('Get groups', () => {
        beforeEach(() => {
            mockedAxios.get.mockResolvedValueOnce({ data: mockedGroups })
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
    describe('Group list', () => {
        it('should create an array of value and label for each group', () => {
            groups.value = mockedGroups
            expect(groupList.value).toEqual(mockedGroupList)
        })
    })
    describe('Student group', () => {
        it('should return the student group object', () => {
            groups.value = mockedGroups
            expect(studentGroup.value).toEqual(mockedGroups[1])
        })
    })
    describe('Groups to delete', () => {
        const oldGroups = [1, 2, 3]
        const newGroups = [1, 4, 5]

        it('should return groups that are in oldGroups but not in newGroups', () => {
            const result = groupsToDelete(newGroups, oldGroups)
            expect(result).toEqual([2, 3])
        })
    })
})
